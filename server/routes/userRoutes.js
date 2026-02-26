const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getUserById,
  updateProfile,
  changePassword,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/stats', protect, getUserStats);

// Public routes
router.get('/:id', getUserById);

module.exports = router;