const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getUserById,
  updateProfile,
  changePassword,
  getUserStats,
  getPublicStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (no authentication)
router.get('/public/stats', getPublicStats);

// Protected routes (require authentication)
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/stats', protect, getUserStats);

// Public user lookup by ID (keep this last so it doesn't catch /profile)
router.get('/:id', getUserById);

module.exports = router;
