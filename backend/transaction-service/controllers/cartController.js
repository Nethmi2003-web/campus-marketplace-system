const Cart = require('../models/Cart');
const Item = require('../../item-management/models/Item');

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'title price category condition imageUrl'
    });

    if (!cart) {
      // Create empty cart if not exists
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Item.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    const itemData = {
      product: productId,
      name: product.title,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      category: product.category,
      condition: product.condition
    };

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [itemData]
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists, update quantity and sync other details
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price; // Sync price in case it changed
        cart.items[itemIndex].name = product.title;
        cart.items[itemIndex].imageUrl = product.imageUrl;
      } else {
        // Product does not exist, push to array
        cart.items.push(itemData);
      }
      await cart.save();
    }

    // Populate and return
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title price category condition imageUrl'
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Filter out the item
    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title price category condition imageUrl'
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    next(err);
  }
};
