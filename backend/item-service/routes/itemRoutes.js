const express = require('express');
const {
  getItemsByCategory,
  getItemById,
  createItem,
  getMyListings,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../../middleware/authMiddleware');
const { upload } = require('../../config/cloudinaryUpload');

const router = express.Router();

router.route('/').get(getItemsByCategory).post(protect, upload.array('images', 4), createItem);
router.get('/my', protect, getMyListings);

router
  .route('/:id')
  .get(getItemById)
  .put(protect, upload.array('images', 4), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
