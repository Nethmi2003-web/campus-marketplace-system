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

    // 4. Update item stock quantities and status
    for (const item of orderItems) {
      const product = await Item.findById(item.product);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        if (product.stockQuantity === 0) {
          product.status = 'sold';
        }
        await product.save();
      }
    }

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

    // If order is delivered/completed, additional logic can be added here if needed
    // (Stock was already decremented at creation for online/immediate orders)

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user spending analytics
// @route   GET /api/orders/analytics
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id, paymentStatus: 'completed' });

    // 1. Basic Stats
    const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const platformFees = orders.reduce((acc, order) => acc + order.platformFee, 0);
    const itemsPurchased = orders.reduce((acc, order) => 
      acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);

    // 2. Monthly Spending (Last 6 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyDataMap = {};
    
    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      monthlyDataMap[monthName] = 0;
    }

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthName = months[date.getMonth()];
      if (monthlyDataMap.hasOwnProperty(monthName)) {
        monthlyDataMap[monthName] += order.totalAmount;
      }
    });

    const monthlySpending = Object.keys(monthlyDataMap).map(month => ({
      month,
      amount: monthlyDataMap[month]
    }));

    // 3. Pending Stats
    const pendingOrders = await Order.countDocuments({ user: req.user.id, orderStatus: 'pending' });

    // 4. Completed Orders List (Detailed)
    const completedOrdersList = await Order.find({ user: req.user.id, paymentStatus: 'completed' })
      .populate('items.product', 'title imageUrl price category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalSpent,
        itemsPurchased,
        platformFees,
        monthlySpending,
        pendingOrders,
        completedOrders: completedOrdersList
      }
    });
  } catch (err) {
    next(err);
  }
};
