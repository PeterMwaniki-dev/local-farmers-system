// routes/adminRoutes.js
// Admin routes

const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getRecentUsers,
  getRecentActivity,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getChartData
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
// For now, we'll just use protect. Later you can add authorize('admin')

router.get('/stats', protect, getAdminStats);
router.get('/recent-users', protect, getRecentUsers);
router.get('/recent-activity', protect, getRecentActivity);
router.get('/users', protect, getAllUsers);
router.put('/users/:userId/toggle-status', protect, toggleUserStatus);
router.delete('/users/:userId', protect, deleteUser);
router.get('/chart-data', protect, getChartData);

module.exports = router;