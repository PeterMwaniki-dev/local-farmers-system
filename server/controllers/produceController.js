// controllers/produceController.js
// Handle produce management logic

const {
    createProduce,
    getAllProduce,
    getProduceCount,
    getProduceById,
    getProduceByFarmer,
    updateProduce,
    deleteProduce,
    incrementViews,
    getCategories
} = require('../models/produceModel');

/**
 * @desc    Create new produce listing
 * @route   POST /api/produce
 * @access  Private (Farmer only)
 */
const createProduceListing = async (req, res) => {
    try {
        const {
            produce_name,
            category,
            quantity,
            unit,
            price_per_unit,
            available_from,
            available_until,
            description,
            quality_grade,
            location
        } = req.body;

        // Get image URL if file was uploaded
        const image_url = req.file ? `/uploads/produce/${req.file.filename}` : null;

        // Validation
        if (!produce_name || !quantity || !unit || !location) {
            return res.status(400).json({
                success: false,
                message: 'Please provide produce name, quantity, unit, and location'
            });
        }

        // Validate quantity is positive
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }

        // Validate price if provided
        if (price_per_unit && price_per_unit < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative'
            });
        }

        // Create produce listing
        const listingId = await createProduce({
            farmer_id: req.user.user_id,  // From auth middleware
            produce_name,
            category,
            quantity,
            unit,
            price_per_unit,
            available_from,
            available_until,
            description,
            quality_grade,
            location,
            image_url
        });

        // Get the created listing
        const newListing = await getProduceById(listingId);

        res.status(201).json({
            success: true,
            message: 'Produce listing created successfully',
            data: newListing
        });

    } catch (error) {
        console.error('Create produce error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating produce listing'
        });
    }
};

/**
 * @desc    Get all produce listings with filters
 * @route   GET /api/produce
 * @access  Public
 */
const getProduceListings = async (req, res) => {
    try {
        const {
            category,
            search,
            location,
            min_price,
            max_price,
            page = 1,
            limit = 20
        } = req.query;

        // Build filters object
        const filters = {};
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (location) filters.location = location;
        if (min_price) filters.min_price = parseFloat(min_price);
        if (max_price) filters.max_price = parseFloat(max_price);

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Get produce and total count
        const [produce, total] = await Promise.all([
            getAllProduce(filters, limitNum, offset),
            getProduceCount(filters)
        ]);

        res.status(200).json({
            success: true,
            count: produce.length,
            total: total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: produce
        });

    } catch (error) {
        console.error('Get produce error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching produce listings'
        });
    }
};

/**
 * @desc    Get single produce listing by ID
 * @route   GET /api/produce/:id
 * @access  Public
 */
const getProduceListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Get produce
        const produce = await getProduceById(id);

        if (!produce) {
            return res.status(404).json({
                success: false,
                message: 'Produce listing not found'
            });
        }

        // Increment view count
        await incrementViews(id);

        res.status(200).json({
            success: true,
            data: produce
        });

    } catch (error) {
        console.error('Get produce by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching produce listing'
        });
    }
};

/**
 * @desc    Get farmer's own produce listings
 * @route   GET /api/produce/my-listings
 * @access  Private (Farmer only)
 */
const getMyListings = async (req, res) => {
    try {
        const produce = await getProduceByFarmer(req.user.user_id);

        res.status(200).json({
            success: true,
            count: produce.length,
            data: produce
        });

    } catch (error) {
        console.error('Get my listings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching your listings'
        });
    }
};

/**
 * @desc    Update produce listing
 * @route   PUT /api/produce/:id
 * @access  Private (Farmer only - own listing)
 */
const updateProduceListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Get image URL if file was uploaded
        if (req.file) {
            updateData.image_url = `/uploads/produce/${req.file.filename}`;
        }

        // Check if listing exists
        const listing = await getProduceById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Produce listing not found'
            });
        }

        // Check if user owns this listing
        if (listing.farmer_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this listing'
            });
        }

        // Validate quantity if provided
        if (updateData.quantity && updateData.quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }

        // Validate price if provided
        if (updateData.price_per_unit && updateData.price_per_unit < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative'
            });
        }

        // Update listing
        const updated = await updateProduce(id, updateData);

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: 'No changes were made'
            });
        }

        // Get updated listing
        const updatedListing = await getProduceById(id);

        res.status(200).json({
            success: true,
            message: 'Produce listing updated successfully',
            data: updatedListing
        });

    } catch (error) {
        console.error('Update produce error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating produce listing'
        });
    }
};

/**
 * @desc    Delete produce listing
 * @route   DELETE /api/produce/:id
 * @access  Private (Farmer only - own listing)
 */
const deleteProduceListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if listing exists
        const listing = await getProduceById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Produce listing not found'
            });
        }

        // Check if user owns this listing
        if (listing.farmer_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this listing'
            });
        }

        // Delete listing (soft delete - marks as expired)
        await deleteProduce(id);

        res.status(200).json({
            success: true,
            message: 'Produce listing deleted successfully'
        });

    } catch (error) {
        console.error('Delete produce error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting produce listing'
        });
    }
};

/**
 * @desc    Get all produce categories
 * @route   GET /api/produce/categories
 * @access  Public
 */
const getProduceCategories = async (req, res) => {
    try {
        const categories = await getCategories();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories'
        });
    }
};

module.exports = {
    createProduceListing,
    getProduceListings,
    getProduceListing,
    getMyListings,
    updateProduceListing,
    deleteProduceListing,
    getProduceCategories
};