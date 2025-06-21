const express = require('express');
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const advancedResults = require('../middleware/advancedResults');
const Brand = require('../models/Brand');

router
  .route('/')
  .get(advancedResults(Brand), getBrands)
  .post(protect, authorize('admin'), createBrand);

router
  .route('/:id')
  .get(getBrand)
  .put(protect, authorize('admin'), updateBrand)
  .delete(protect, authorize('admin'), deleteBrand);

module.exports = router; 