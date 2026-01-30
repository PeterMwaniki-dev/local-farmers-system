// routes/buyerRoutes.js
// Buyer request routes

const express = require('express');
const router = express.Router();
const {
    createBuyerRequest,
    getBuyerRequests,
    getBuyerRequest,
    getMyRequests,
    updateBuyerRequest,
    deleteBuyerRequest
} = require('../controllers/buyerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/requests', getBuyerRequests);              // Get all requests (with filters)
router.get('/requests/:id', getBuyerRequest);           // Get single request

// Protected routes (Buyers only)
router.post('/requests', protect, authorize('buyer'), createBuyerRequest);           // Create request
router.get('/my-requests', protect, authorize('buyer'), getMyRequests);              // Get my requests
router.put('/requests/:id', protect, authorize('buyer'), updateBuyerRequest);        // Update request
router.delete('/requests/:id', protect, authorize('buyer'), deleteBuyerRequest);     // Delete request

module.exports = router;
