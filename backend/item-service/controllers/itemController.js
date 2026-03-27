const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');
const { cloudinary } = require('../../config/cloudinaryUpload');

const allowedCategories = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Clothing & Uniforms',
  'Sports & Fitness',
  'Services & Tutoring',
  'Other',
];

const allowedStatuses = ['Available', 'Sold', 'Reserved'];
const allowedConditions = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

const normalizeRole = (role = '') => String(role).toLowerCase();

const normalizeStatusValue = (status = '') => {
  const lowered = String(status || '').toLowerCase();
  if (lowered === 'available') {
    return 'Available';
  }
  if (lowered === 'reserved') {
    return 'Reserved';
  }
  if (lowered === 'sold') {
    return 'Sold';
  }
  return status || 'Available';
};

const normalizeConditionValue = (condition = '') => {
  const lowered = String(condition || '').toLowerCase();
  if (lowered === 'used') {
    return 'Good';
  }
  return condition;
};

const getItemImageArray = (item) => {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    return item.images.filter(Boolean);
  }
  if (item?.imageUrl && typeof item.imageUrl === 'string') {
    return [item.imageUrl];
  }
  return [];
};

const uploadFileToCloudinary = (fileBuffer, mimetype) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'campus-marketplace/items',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });

const uploadManyFilesToCloudinary = async (files = []) => {
  if (!files || files.length === 0) {
    return [];
  }

  return Promise.all(
    files.map((file) => uploadFileToCloudinary(file.buffer, file.mimetype))
  );
};

const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const splitByUpload = url.split('/upload/');
  if (splitByUpload.length < 2) {
    return null;
  }

  const pathWithVersion = splitByUpload[1];
  const withoutVersion = pathWithVersion.replace(/^v\d+\//, '');
  return withoutVersion.replace(/\.[^/.]+$/, '');
};

const parseExistingImages = (existingImages) => {
  if (!existingImages) {
    return [];
  }

  if (Array.isArray(existingImages)) {
    return existingImages.filter(Boolean);
  }

  if (typeof existingImages === 'string') {
    try {
      const parsed = JSON.parse(existingImages);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

const parseRemoveImages = (removeImages) => {
  if (!removeImages) {
    return [];
  }

  if (Array.isArray(removeImages)) {
    return removeImages.filter(Boolean);
  }

  if (typeof removeImages === 'string') {
    try {
      const parsed = JSON.parse(removeImages);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

const validateItemPayload = ({ title, category, condition, description, price, status }, isCreate = true) => {
  if (isCreate && (!title || !category || !condition || !description || price === undefined)) {
    return 'Title, category, condition, description, and price are required';
  }

  if (price !== undefined && (Number.isNaN(Number(price)) || Number(price) < 0)) {
    return 'Price must be a number greater than or equal to 0';
  }

  if (category && !allowedCategories.includes(category)) {
    return 'Invalid category value';
  }

  const normalizedCondition = condition !== undefined ? normalizeConditionValue(condition) : condition;

  if (normalizedCondition && !allowedConditions.includes(normalizedCondition)) {
    return 'Invalid condition value';
  }

  const normalizedStatus = status !== undefined ? normalizeStatusValue(status) : status;

  if (normalizedStatus && !allowedStatuses.includes(normalizedStatus)) {
    return 'Invalid status value';
  }

  return null;
};

const buildSellerPayload = (seller) => {
  if (!seller) {
    return null;
  }

  const name = `${seller.firstName || ''} ${seller.lastName || ''}`.trim();

  return {
    _id: seller._id,
    name: name || 'Unknown Seller',
    email: seller.universityEmail || '',
    createdAt: seller.createdAt || null,
    profileImage: seller.profileImage || '',
  };
};

const buildItemPayload = (item) => {
  const plain = item.toObject();
  const images = getItemImageArray(plain);

  return {
    _id: plain._id,
    title: plain.title,
    description: plain.description,
    price: plain.price,
    category: plain.category,
    condition: normalizeConditionValue(plain.condition),
    status: normalizeStatusValue(plain.status),
    images,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    seller: buildSellerPayload(plain.seller),
  };
};

const getAllItems = asyncHandler(async (req, res) => {
  const { category, status, limit, excludeId } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = normalizeStatusValue(status);
  }

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  let query = Item.find(filter)
    .populate('seller', 'firstName lastName universityEmail')
    .sort({ createdAt: -1 });

  if (limit && !Number.isNaN(Number(limit))) {
    query = query.limit(Number(limit));
  }

  const items = await query;

  const payload = items.map((item) => {
    const plain = item.toObject();
    return {
      ...plain,
      status: normalizeStatusValue(plain.status),
      condition: normalizeConditionValue(plain.condition),
      images: getItemImageArray(plain),
      seller: buildSellerPayload(plain.seller),
    };
  });

  res.status(200).json(payload);
});

const getItemsByCategory = getAllItems;

const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    'seller',
    'firstName lastName universityEmail createdAt profileImage'
  );

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  return res.status(200).json(buildItemPayload(item));
});

const createItem = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    condition,
    description,
    price,
    status,
  } = req.body;

  const normalizedStatus = status !== undefined ? normalizeStatusValue(status) : status;
  const normalizedCondition = condition !== undefined ? normalizeConditionValue(condition) : condition;

  const validationError = validateItemPayload(
    {
      title,
      category,
      condition: normalizedCondition,
      description,
      price,
      status: normalizedStatus,
    },
    true
  );

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const uploadedImages = await uploadManyFilesToCloudinary(req.files || []);

  if (uploadedImages.length === 0) {
    return res.status(400).json({ message: 'Please upload at least one image' });
  }

  const item = await Item.create({
    title,
    category,
    condition: normalizedCondition,
    description,
    price: Number(price),
    status: normalizedStatus || 'Available',
    images: uploadedImages,
    seller: req.user._id,
  });

  const populatedItem = await item.populate('seller', 'firstName lastName universityEmail');

  return res.status(201).json(populatedItem);
});

const getMyListings = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const items = await Item.find({ seller: req.user._id })
    .populate('seller', 'firstName lastName universityEmail')
    .sort({ createdAt: -1 });

  const normalizedItems = items.map((item) => {
    const plain = item.toObject();
    return {
      ...plain,
      status: normalizeStatusValue(plain.status),
      condition: normalizeConditionValue(plain.condition),
      images: getItemImageArray(plain),
    };
  });

  const availableCount = normalizedItems.filter((item) => item.status === 'Available').length;
  const reservedCount = normalizedItems.filter((item) => item.status === 'Reserved').length;
  const soldCount = normalizedItems.filter((item) => item.status === 'Sold').length;

  return res.status(200).json({
    items: normalizedItems,
    totalCount: normalizedItems.length,
    availableCount,
    soldCount,
    reservedCount,
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (!req.user || String(item.seller) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to edit this listing' });
  }

  const incomingStatus = req.body.status !== undefined ? normalizeStatusValue(req.body.status) : req.body.status;
  const incomingCondition = req.body.condition !== undefined ? normalizeConditionValue(req.body.condition) : req.body.condition;
  const validationError = validateItemPayload(
    {
      ...req.body,
      status: incomingStatus,
      condition: incomingCondition,
    },
    false
  );
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const removeImages = parseRemoveImages(req.body.removeImages);
  const currentImages = getItemImageArray(item);
  const existingImages = currentImages.filter((url) => !removeImages.includes(url));
  const uploadedImages = await uploadManyFilesToCloudinary(req.files || []);
  const nextImages = [...existingImages, ...uploadedImages];

  if (removeImages.length > 0) {
    await Promise.all(
      removeImages.map(async (imageUrl) => {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            // Ignore cloudinary deletion errors during update to avoid data loss.
          }
        }
      })
    );
  }

  const updateData = {};

  if (req.body.title !== undefined) {
    updateData.title = req.body.title;
  }

  if (req.body.description !== undefined) {
    updateData.description = req.body.description;
  }

  if (req.body.price !== undefined) {
    updateData.price = Number(req.body.price);
  }

  if (req.body.category !== undefined) {
    updateData.category = req.body.category;
  }

  if (req.body.condition !== undefined) {
    updateData.condition = incomingCondition;
  }

  if (req.body.status !== undefined) {
    updateData.status = incomingStatus;
  }

  if (removeImages.length > 0 || uploadedImages.length > 0) {
    updateData.images = nextImages;
  }

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('seller', 'firstName lastName universityEmail');

  const populatedItem = {
    ...updatedItem.toObject(),
    status: normalizeStatusValue(updatedItem.status),
    condition: normalizeConditionValue(updatedItem.condition),
  };

  return res.status(200).json(populatedItem);
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const isOwner = req.user && String(item.seller) === String(req.user._id);
  const isAdmin = req.user && normalizeRole(req.user.role) === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to delete this listing' });
  }

  if (item.images && item.images.length > 0) {
    await Promise.all(
      item.images.map(async (imageUrl) => {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            // Ignore cloudinary deletion errors to avoid blocking item cleanup.
          }
        }
      })
    );
  }

  await item.deleteOne();

  return res.status(200).json({ message: 'Listing deleted successfully' });
});

module.exports = {
  getAllItems,
  getItemsByCategory,
  getItemById,
  createItem,
  getMyListings,
  updateItem,
  deleteItem,
};
