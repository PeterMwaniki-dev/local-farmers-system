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
router.get('/:id', getUserById);

// Protected routes (require authentication)
router.use(protect);
router.get('/profile', getMyProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/stats', getUserStats);

module.exports = router;