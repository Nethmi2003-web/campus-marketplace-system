const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'campus_marketplace/events',
  allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  transformation: [{ width: 800, height: 600, crop: 'limit' }]
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
