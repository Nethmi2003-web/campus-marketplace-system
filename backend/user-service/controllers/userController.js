const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
// Handle both CommonJS and ES Module default exports gracefully just in case User.js is transpiled or native ESM
const UserModel = require('../models/User');
const User = UserModel.default || UserModel;

// Generate standard JWT token without aggressive concurrent tracking
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// @desc  Register new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, faculty, universityEmail, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !faculty || !universityEmail || !password || !confirmPassword) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const userExists = await User.findOne({ universityEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this university email');
  }

  // Pass confirmPassword to satisfy Mongoose virtual validation hook
  const user = await User.create({ 
    firstName, 
    lastName, 
    faculty, 
    universityEmail, 
    password, 
    confirmPassword 
  });

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    universityEmail: user.universityEmail,
    role: user.role,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  // Mapping the frontend 'email' input payload to 'universityEmail' for the DB check
  const { email, password } = req.body;

  const user = await User.findOne({ universityEmail: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      universityEmail: user.universityEmail,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc  Get logged-in user profile
// @route GET /api/users/me
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const { cloudinary } = require('../../config/cloudinaryUpload');

// @desc  Update user profile
// @route PUT /api/users/me
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.phone = req.body.phone || user.phone;
  user.bio = req.body.bio || user.bio;
  
  if (req.body.password) {
    user.password = req.body.password;
    if (req.body.confirmPassword) {
      user.confirmPassword = req.body.confirmPassword;
    } else {
      user.confirmPassword = req.body.password; // automatically bypass confirm on backend patch
    }
  }

  // Handle Cloudinary upload if an image exists
  if (req.file) {
    try {
      // Delete existing old profile image from Cloudinary to save space
      if (user.profileImage) {
        try {
          const publicId = user.profileImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete old profile image:", err);
        }
      }

      const uploadFileToCloudinary = (fileBuffer, mimetype) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", format: "webp" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          require('stream').Readable.from(fileBuffer).pipe(uploadStream);
        });

      const result = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
      user.profileImage = result.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary Exception:", uploadError);
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary. Check your internet or API keys.");
    }
  }

  const updated = await user.save();
  res.json({ 
    _id: updated._id, 
    firstName: updated.firstName, 
    lastName: updated.lastName, 
    universityEmail: updated.universityEmail, 
    role: updated.role,
    phone: updated.phone,
    bio: updated.bio,
    profileImage: updated.profileImage
  });
});

// @desc  Get all users (admin)
// @route GET /api/users
// @access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers };
