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

    const { cloudinary } = require('../../config/cloudinaryUpload');
    let imageUrl = '';

    try {
      const uploadFileToCloudinary = (fileBuffer, mimetype) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", format: "webp", folder: "campus_marketplace/events" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          require('stream').Readable.from(fileBuffer).pipe(uploadStream);
        });

      const result = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary Upload Exception:", uploadError);
      return res.status(500).json({ success: false, message: "Image upload failed. Please try again." });
    }

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

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, faculty, date, time, venue, organizedTeam, category, description, status 
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.name = name || event.name;
    event.faculty = faculty || event.faculty;
    event.date = date || event.date;
    event.time = time !== undefined ? time : event.time;
    event.venue = venue || event.venue;
    event.organizedTeam = organizedTeam || event.organizedTeam;
    event.category = category || event.category;
    event.description = description !== undefined ? description : event.description;
    event.status = status || event.status;

    // Optional: Update image if provided
    if (req.file) {
      const { cloudinary } = require('../../config/cloudinaryUpload');
      try {
        const uploadFileToCloudinary = (fileBuffer, mimetype) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: "image", format: "webp", folder: "campus_marketplace/events" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            require('stream').Readable.from(fileBuffer).pipe(uploadStream);
          });
        const result = await uploadFileToCloudinary(req.file.buffer, req.file.mimetype);
        event.imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Exception on Update:", uploadError);
        return res.status(500).json({ success: false, message: "Image upload failed during update." });
      }
    }

    const updatedEvent = await event.save();
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error(`Error in updateEvent: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error while updating event' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Optional: Delete image from Cloudinary to save space
    // if (event.imageUrl) {
    //   const { cloudinary } = require('../../config/cloudinaryUpload');
    //   const publicId = 'campus_marketplace/events/' + event.imageUrl.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(publicId).catch(console.error);
    // }

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event removed' });
  } catch (error) {
    console.error(`Error in deleteEvent: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error while deleting event' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};
