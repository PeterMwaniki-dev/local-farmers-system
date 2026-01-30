// controllers/buyerController.js
// Handle buyer request logic

const {
    createRequest,
    getAllRequests,
    getRequestCount,
    getRequestById,
    getRequestsByBuyer,
    updateRequest,
    deleteRequest
} = require('../models/buyerModel');

/**
 * @desc    Create new buyer request
 * @route   POST /api/buyers/requests
 * @access  Private (Buyer only)
 */
const createBuyerRequest = async (req, res) => {
    try {
        const {
            produce_needed,
            category,
            quantity_needed,
            unit,
            budget_per_unit,
            delivery_location,
            needed_by_date,
            description
        } = req.body;

        // Validation
        if (!produce_needed || !quantity_needed || !unit || !delivery_location) {
            return res.status(400).json({
                success: false,
                message: 'Please provide produce needed, quantity, unit, and delivery location'
            });
        }

        // Validate quantity is positive
        if (quantity_needed <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }

        // Validate budget if provided
        if (budget_per_unit && budget_per_unit < 0) {
            return res.status(400).json({
                success: false,
                message: 'Budget cannot be negative'
            });
        }

        // Create buyer request
        const requestId = await createRequest({
            buyer_id: req.user.user_id,  // From auth middleware
            produce_needed,
            category,
            quantity_needed,
            unit,
            budget_per_unit,
            delivery_location,
            needed_by_date,
            description
        });

        // Get the created request
        const newRequest = await getRequestById(requestId);

        res.status(201).json({
            success: true,
            message: 'Buyer request created successfully',
            data: newRequest
        });

    } catch (error) {
        console.error('Create buyer request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating buyer request'
        });
    }
};

/**
 * @desc    Get all buyer requests with filters
 * @route   GET /api/buyers/requests
 * @access  Public
 */
const getBuyerRequests = async (req, res) => {
    try {
        const {
            category,
            search,
            location,
            min_budget,
            max_budget,
            page = 1,
            limit = 20
        } = req.query;

        // Build filters object
        const filters = {};
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (location) filters.location = location;
        if (min_budget) filters.min_budget = parseFloat(min_budget);
        if (max_budget) filters.max_budget = parseFloat(max_budget);

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Get requests and total count
        const [requests, total] = await Promise.all([
            getAllRequests(filters, limitNum, offset),
            getRequestCount(filters)
        ]);

        res.status(200).json({
            success: true,
            count: requests.length,
            total: total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: requests
        });

    } catch (error) {
        console.error('Get buyer requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching buyer requests'
        });
    }
};

/**
 * @desc    Get single buyer request by ID
 * @route   GET /api/buyers/requests/:id
 * @access  Public
 */
const getBuyerRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Get request
        const request = await getRequestById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Buyer request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });

    } catch (error) {
        console.error('Get buyer request by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching buyer request'
        });
    }
};

/**
 * @desc    Get buyer's own requests
 * @route   GET /api/buyers/my-requests
 * @access  Private (Buyer only)
 */
const getMyRequests = async (req, res) => {
    try {
        const requests = await getRequestsByBuyer(req.user.user_id);

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching your requests'
        });
    }
};

/**
 * @desc    Update buyer request
 * @route   PUT /api/buyers/requests/:id
 * @access  Private (Buyer only - own request)
 */
const updateBuyerRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if request exists
        const request = await getRequestById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Buyer request not found'
            });
        }

        // Check if user owns this request
        if (request.buyer_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this request'
            });
        }

        // Validate quantity if provided
        if (updateData.quantity_needed && updateData.quantity_needed <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }

        // Validate budget if provided
        if (updateData.budget_per_unit && updateData.budget_per_unit < 0) {
            return res.status(400).json({
                success: false,
                message: 'Budget cannot be negative'
            });
        }

        // Update request
        const updated = await updateRequest(id, updateData);

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: 'No changes were made'
            });
        }

        // Get updated request
        const updatedRequest = await getRequestById(id);

        res.status(200).json({
            success: true,
            message: 'Buyer request updated successfully',
            data: updatedRequest
        });

    } catch (error) {
        console.error('Update buyer request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating buyer request'
        });
    }
};

/**
 * @desc    Delete buyer request
 * @route   DELETE /api/buyers/requests/:id
 * @access  Private (Buyer only - own request)
 */
const deleteBuyerRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if request exists
        const request = await getRequestById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Buyer request not found'
            });
        }

        // Check if user owns this request
        if (request.buyer_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this request'
            });
        }

        // Delete request (soft delete - marks as cancelled)
        await deleteRequest(id);

        res.status(200).json({
            success: true,
            message: 'Buyer request deleted successfully'
        });

    } catch (error) {
        console.error('Delete buyer request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting buyer request'
        });
    }
};

module.exports = {
    createBuyerRequest,
    getBuyerRequests,
    getBuyerRequest,
    getMyRequests,
    updateBuyerRequest,
    deleteBuyerRequest
};
