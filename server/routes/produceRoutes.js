// routes/produceRoutes.js
// Produce management routes

const express = require('express');
const router = express.Router();
const {
    createProduceListing,
    getProduceListings,
    getProduceListing,
    getMyListings,
    updateProduceListing,
    deleteProduceListing,
    getProduceCategories
} = require('../controllers/produceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProduceListings);
router.get('/categories', getProduceCategories);
router.get('/:id', getProduceListing);

// Protected routes (Farmers only)
router.post('/', protect, authorize('farmer'), upload.single('image'), createProduceListing);
router.get('/farmer/my-listings', protect, authorize('farmer'), getMyListings);
router.put('/:id', protect, authorize('farmer'), upload.single('image'), updateProduceListing);

// Delete route - Allow both farmer and admin
router.delete('/:id', protect, deleteProduceListing);

module.exports = router;
