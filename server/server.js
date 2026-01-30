// server.js
// Main server file for Local Farmers Information and Advisory System

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./config/db');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body parser middleware (to read JSON from requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (allow React frontend to communicate)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Request logging middleware (for development)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Local Farmers Information and Advisory System API',
        version: '1.0.0',
        status: 'Server is running'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes (I'll add these later)
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/produce', require('./routes/produceRoutes'));
// app.use('/api/advisory', require('./routes/advisoryRoutes'));
app.use('/api/buyers', require('./routes/buyerRoutes'));
// app.use('/api/forum', require('./routes/forumRoutes'));

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler (route not found)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection first
        await testConnection();
        
        // Start listening for requests
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🌐 API URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();