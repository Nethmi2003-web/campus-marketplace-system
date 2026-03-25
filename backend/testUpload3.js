require('dotenv').config();
const { upload } = require('./config/cloudinary');
const express = require('express');
const app = express();

app.post('/test', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.log('MULTER ERROR:', err);
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    console.log('UPLOAD SUCCESS:', req.file);
    res.json({ file: req.file });
  });
});

const server = app.listen(5006, () => console.log('Test server ready'));
