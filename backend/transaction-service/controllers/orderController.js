const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Item = require('../../item-management/models/Item');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;

    // 1. Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // 2. Prepare order items and calculate totals
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price // Store the price at the time of purchase
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const platformFee = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + platformFee;

    // 3. Create the order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      platformFee,
      totalAmount,
      paymentMethod,
      shippingAddress,
      paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending',
      orderStatus: 'pending'
    });

    // 4. Update item statuses to 'pending' (locked for others) or 'sold'
    // For now, let's mark them as 'pending' to indicate they are in a transaction
    const itemIds = orderItems.map(item => item.product);
    await Item.updateMany(
      { _id: { $in: itemIds } },
      { $set: { status: 'pending' } }
    );

    // 5. Clear the user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's order history
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'title imageUrl price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName universityEmail')
      .populate('items.product', 'title price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // If order is delivered/completed, mark items as 'sold'
    if (orderStatus === 'delivered' || paymentStatus === 'completed') {
       const itemIds = order.items.map(item => item.product);
       await Item.updateMany(
         { _id: { $in: itemIds } },
         { $set: { status: 'sold' } }
       );
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};
