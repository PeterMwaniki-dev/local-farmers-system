// routes/trendsRoutes.js
// Market trends routes

const express = require('express');
const router = express.Router();
const {
  getAllTrends,
  getTrendsByProduce,
  getLatestTrends,
  createTrend,
  getTrendStats
} = require('../controllers/trendsController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllTrends);
router.get('/latest', getLatestTrends);
router.get('/stats', getTrendStats);
router.get('/produce/:produceName', getTrendsByProduce);

// Protected routes (for adding trends - can be restricted to admin later)
router.post('/', protect, createTrend);

module.exports = router;