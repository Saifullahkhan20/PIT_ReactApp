const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload,
  getProductsByCategory
} = require('../controllers/productController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

router
  .route('/')
  .get(advancedResults(Product, 'category brand'), getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/category/:categoryName').get(getProductsByCategory);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/image').put(protect, authorize('admin'), productImageUpload);

module.exports = router; 