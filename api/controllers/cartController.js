const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price image stock'
  });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check if product is in stock
  if (product.stock < quantity) {
    return next(new ErrorResponse('Not enough stock available', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // Create new cart if it doesn't exist
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity }]
    });
  } else {
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if product exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item if product doesn't exist
      cart.items.push({ product: productId, quantity });
    }
  }

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Check if product is in stock
  const product = await Product.findById(cart.items[itemIndex].product);
  if (product.stock < quantity) {
    return next(new ErrorResponse('Not enough stock available', 400));
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== req.params.itemId
  );

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
}); 