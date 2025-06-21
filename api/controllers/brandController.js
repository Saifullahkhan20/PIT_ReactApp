const Brand = require('../models/Brand');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(
      new ErrorResponse(`Brand not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: brand
  });
});

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const brand = await Brand.create(req.body);

  res.status(201).json({
    success: true,
    data: brand
  });
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  let brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(
      new ErrorResponse(`Brand not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is brand owner
  if (brand.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this brand`,
        401
      )
    );
  }

  brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: brand
  });
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(
      new ErrorResponse(`Brand not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is brand owner
  if (brand.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this brand`,
        401
      )
    );
  }

  await brand.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 