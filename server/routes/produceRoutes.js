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

// Public routes
router.get('/', getProduceListings);                    // Get all produce (with filters)
router.get('/categories', getProduceCategories);        // Get all categories
router.get('/:id', getProduceListing);                  // Get single produce

// Protected routes (Farmers only)
router.post('/', protect, authorize('farmer'), createProduceListing);           // Create listing
router.get('/farmer/my-listings', protect, authorize('farmer'), getMyListings); // Get my listings
router.put('/:id', protect, authorize('farmer'), updateProduceListing);         // Update listing
router.delete('/:id', protect, authorize('farmer'), deleteProduceListing);      // Delete listing

module.exports = router;