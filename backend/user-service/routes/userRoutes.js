const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');
const { upload } = require('../../config/cloudinaryUpload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/me', protect, upload.single('profileImage'), updateUserProfile);
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
