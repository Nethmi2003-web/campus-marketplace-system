const { v2: cloudinary } = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const eventStorage = cloudinaryStorage({
  cloudinary,
  folder: 'campus_marketplace/events',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  transformation: [{ width: 800, height: 600, crop: 'limit' }],
});

const itemStorage = cloudinaryStorage({
  cloudinary,
  folder: 'campus-marketplace/items',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
});

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error('Only jpg, jpeg, png, and webp image uploads are allowed'));
};

const upload = multer({ storage: eventStorage, fileFilter: imageFileFilter });

const itemUpload = multer({
  storage: itemStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { cloudinary, upload, itemUpload };
