require('dotenv').config();
const { cloudinary, upload } = require('./config/cloudinary');
const express = require('express');
const app = express();
app.post('/test', upload.single('image'), (req, res) => {
  res.json({ file: req.file || 'no file', body: req.body });
});
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
const server = app.listen(5005, () => console.log('Test server ready'));
