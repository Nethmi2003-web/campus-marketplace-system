const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const { upload } = require('../../config/cloudinary');

// GET all events
router.route('/').get(getEvents);

// POST create event with image upload
// 'image' matches the name attribute in the frontend file input
router.route('/').post(upload.single('image'), createEvent);

module.exports = router;
