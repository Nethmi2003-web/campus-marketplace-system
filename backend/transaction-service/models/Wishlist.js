const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Item'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
