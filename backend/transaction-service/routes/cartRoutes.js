const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart
} = require('../controllers/cartController');

const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');

router.use(protect); // All cart routes are private

router
  .route('/')
  .get(getCart)
  .post(addToCart);

router
  .route('/:productId')
  .delete(removeFromCart);

module.exports = router;
