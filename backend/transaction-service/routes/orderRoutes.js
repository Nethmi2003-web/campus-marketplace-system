const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.use(protect); // All order routes require authentication

router
  .route('/')
  .post(createOrder)
  .get(adminOnly, getAllOrders); // Only admin can see all orders

router.get('/my', getMyOrders);

router.put('/:id/status', adminOnly, updateOrderStatus); // Only admin can update statuses

module.exports = router;
