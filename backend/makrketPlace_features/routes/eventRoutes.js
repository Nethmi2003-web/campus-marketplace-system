const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const { upload } = require('../../config/cloudinaryUpload');

// GET all events
router.route('/').get(getEvents);

// POST create event with image upload
// 'image' matches the name attribute in the frontend file input
router.route('/').post(upload.single('image'), createEvent);

// PUT update event & DELETE event
router.route('/:id')
  .put(upload.single('image'), updateEvent)
  .delete(deleteEvent);

module.exports = router;
