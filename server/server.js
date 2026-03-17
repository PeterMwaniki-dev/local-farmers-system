// Main server file 

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./config/db');

// Initialize Express app
const app = express();

// 
// MIDDLEWARE
// 

// CORS middleware (allow React frontend to communicate)
// IMPORTANT: CORS must come BEFORE body parser
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware (to read JSON from requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 
// ROUTES
// 

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sonnet Shamba API',
    version: '1.0.0',
    status: 'Server is running'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/produce', require('./routes/produceRoutes'));
app.use('/api/advisory', require('./routes/advisoryRoutes'));
app.use('/api/buyers', require('./routes/buyerRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/trends', require('./routes/trendsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// 
// ERROR HANDLING
// 

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

// 
// START SERVER
// 

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