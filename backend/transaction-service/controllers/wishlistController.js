const Wishlist = require('../models/Wishlist');
const Item = require('../../item-management/models/Item');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'products',
      select: 'title price category condition imageUrl status'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Item.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId]
      });
    } else {
      // Check if already in wishlist (using string comparison for reliability)
      const exists = wishlist.products.some(id => id.toString() === productId);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Item already in wishlist' });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'title price category condition imageUrl status'
    });

    res.status(200).json({
      success: true,
      data: updatedWishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== req.params.productId
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'title price category condition imageUrl status'
    });

    res.status(200).json({
      success: true,
      data: updatedWishlist
    });
  } catch (err) {
    next(err);
  }
};
