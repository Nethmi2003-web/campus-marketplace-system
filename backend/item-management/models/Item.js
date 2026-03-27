const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Books',
      'Electronics',
      'Lab Equipment',
      'Clothing & Uniforms',
      'Sports & Fitness',
      'Services & Tutoring',
      'Other'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Please add item condition'],
    enum: ['New', 'Like New', 'Used', 'Refurbished']
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop'
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  stockQuantity: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Item || mongoose.model('Item', ItemSchema);
