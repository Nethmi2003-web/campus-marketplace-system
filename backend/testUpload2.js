require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');
cloudinary.uploader.upload('package.json', { resource_type: "auto" })
  .then(res => console.log("SUCCESS:", res.secure_url))
  .catch(err => console.error("ERROR:", err));
