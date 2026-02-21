// routes/reportRoutes.js
// Analytics and reporting routes

const express = require('express');
const router = express.Router();
const {
  getUserStats,
  getProduceStats,
  getActivityStats,
  getTopUsers,
  getGeographicDistribution,
  getEngagementMetrics,
  getOverviewSummary
} = require('../controllers/reportController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Report endpoints
router.get('/users', getUserStats);
router.get('/produce', getProduceStats);
router.get('/activity', getActivityStats);
router.get('/top-users', getTopUsers);
router.get('/geographic', getGeographicDistribution);
router.get('/engagement', getEngagementMetrics);
router.get('/overview', getOverviewSummary);

module.exports = router;