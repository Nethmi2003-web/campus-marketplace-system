const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        'Books',
        'Electronics',
        'Lab Equipment',
        'Clothing & Uniforms',
        'Sports & Fitness',
        'Services & Tutoring',
        'Other',
      ],
      required: true,
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Reserved'],
      default: 'Available',
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);
