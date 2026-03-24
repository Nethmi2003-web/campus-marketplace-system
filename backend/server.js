const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Component 1 – User Management
app.use('/api/users', require('./user-service/routes/userRoutes'));

// Component 2 – Item Management
app.use('/api/items', require('./item-management/routes/itemRoutes'));

// Component 3 – Transaction Management (Cart & Orders)
app.use('/api/cart', require('./transaction-service/routes/cartRoutes'));
app.use('/api/orders', require('./transaction-service/routes/orderRoutes'));
app.use('/api/wishlist', require('./transaction-service/routes/wishlistRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎓 Campus Marketplace API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ 
    success: false,
    message: err.message || 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
