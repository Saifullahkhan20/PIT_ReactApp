const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'category', 'brand'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let findObject = JSON.parse(queryStr);

  // Handle category filter by name
  if (req.query.category) {
    const Category = require('../models/Category'); // Dynamically import model
    const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(req.query.category, 'i') } });
    if (categoryDoc) {
      findObject.category = categoryDoc._id;
    } else {
      // If category not found, return no results for this filter
      return res.status(200).json({
        success: true,
        count: 0,
        pagination: {},
        data: []
      });
    }
  }

  // Handle brand filter by name
  if (req.query.brand) {
    const Brand = require('../models/Brand'); // Dynamically import model
    const brandDoc = await Brand.findOne({ name: { $regex: new RegExp(req.query.brand, 'i') } });
    if (brandDoc) {
      findObject.brand = brandDoc._id;
    } else {
      // If brand not found, return no results for this filter
      return res.status(200).json({
        success: true,
        count: 0,
        pagination: {},
        data: []
      });
    }
  }

  // Add search query to findObject
  if (req.query.search) {
    const searchTerm = req.query.search;
    findObject.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  console.log('Final Mongoose findObject:', findObject);

  // Finding resource
  query = model.find(findObject);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults; 