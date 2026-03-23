const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
// Handle both CommonJS and ES Module default exports gracefully just in case User.js is transpiled or native ESM
const UserModel = require('../models/User');
const User = UserModel.default || UserModel;

// Generate JWT with Session Versioning for concurrent logout protection
const generateToken = (id, sessionVersion = 0) =>
  jwt.sign({ id, sessionVersion }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

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
    token: generateToken(user._id, user.sessionVersion || 0),
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
    // Invalidate older sessions by forcing a new concurrent session integer
    user.sessionVersion = (user.sessionVersion || 0) + 1;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      universityEmail: user.universityEmail,
      role: user.role,
      token: generateToken(user._id, user.sessionVersion),
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

  const updated = await user.save();
  res.json({ 
    _id: updated._id, 
    firstName: updated.firstName, 
    lastName: updated.lastName, 
    universityEmail: updated.universityEmail, 
    role: updated.role 
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
