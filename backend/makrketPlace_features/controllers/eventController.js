const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { 
      name, 
      faculty, 
      date, 
      time, 
      venue, 
      organizedTeam, 
      category, 
      description,
      status 
    } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    // Access Cloudinary URL from the multer file object (different versions use different keys)
    const imageUrl = req.file.secure_url || req.file.url || req.file.path;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image upload failed, no URL returned.' });
    }

    const event = new Event({
      name,
      faculty,
      date,
      time,
      venue,
      organizedTeam,
      category,
      description,
      imageUrl,
      status: status || 'Upcoming'
    });

    const createdEvent = await event.save();

    res.status(201).json({
      success: true,
      data: createdEvent
    });

  } catch (error) {
    console.error(`Error in createEvent: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error while creating event' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    // You can add filtering here later (e.g., by category or upcoming dates)
    const events = await Event.find({}).sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error(`Error in getEvents: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error while fetching events' });
  }
};

module.exports = {
  createEvent,
  getEvents
};
