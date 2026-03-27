const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow your Vite React frontend
    credentials: true,
}));

// Placeholder for future Routers
// app.use('/api/auth', require('./routes/authRoutes'));

// Health Check Route
app.get('/', (req, res) => {
    res.send('Campus Marketplace API is completely operational! 🚀');
});

// Initialize MongoDB Connection
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Database seamlessly.');
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Backend Express Server executing securely on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB Critical Connection Error:', err.message);
        process.exit(1);
    }
};

startServer();
