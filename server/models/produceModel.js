// models/produceModel.js
// Database queries for produce listings

const { pool } = require('../config/db');

/**
 * @desc    Create new produce listing
 * @returns {number} Listing ID
 */
const createProduce = async (produceData) => {
    const {
        farmer_id,
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
    } = produceData;

    const [result] = await pool.query(
        `INSERT INTO produce_listings 
        (farmer_id, produce_name, category, quantity, unit, price_per_unit, 
         available_from, available_until, description, quality_grade, location, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [farmer_id, produce_name, category, quantity, unit, price_per_unit,
         available_from, available_until, description, quality_grade, location, image_url]
    );

    return result.insertId;
};

/**
 * @desc    Get all produce listings with filters
 * @returns {Array} Produce listings
 */
const getAllProduce = async (filters = {}, limit = 20, offset = 0) => {
    let query = `
        SELECT 
            pl.*,
            u.full_name as farmer_name,
            u.phone_number as farmer_phone,
            u.location as farmer_location
        FROM produce_listings pl
        JOIN users u ON pl.farmer_id = u.user_id
        WHERE pl.status = 'available'
    `;

    const params = [];

    // Apply filters
    if (filters.category) {
        query += ' AND pl.category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND pl.produce_name LIKE ?';
        params.push(`%${filters.search}%`);
    }

    if (filters.location) {
        query += ' AND pl.location LIKE ?';
        params.push(`%${filters.location}%`);
    }

    if (filters.min_price) {
        query += ' AND pl.price_per_unit >= ?';
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ' AND pl.price_per_unit <= ?';
        params.push(filters.max_price);
    }

    // Add ordering and pagination
    query += ' ORDER BY pl.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

/**
 * @desc    Get count of produce listings
 * @returns {number} Total count
 */
const getProduceCount = async (filters = {}) => {
    let query = 'SELECT COUNT(*) as total FROM produce_listings WHERE status = "available"';
    const params = [];

    // Apply same filters
    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND produce_name LIKE ?';
        params.push(`%${filters.search}%`);
    }

    if (filters.location) {
        query += ' AND location LIKE ?';
        params.push(`%${filters.location}%`);
    }

    if (filters.min_price) {
        query += ' AND price_per_unit >= ?';
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ' AND price_per_unit <= ?';
        params.push(filters.max_price);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
};

/**
 * @desc    Get single produce by ID
 * @returns {Object} Produce listing
 */
const getProduceById = async (listingId) => {
    const [rows] = await pool.query(
        `SELECT 
            pl.*,
            u.full_name as farmer_name,
            u.phone_number as farmer_phone,
            u.email as farmer_email,
            u.location as farmer_location
        FROM produce_listings pl
        JOIN users u ON pl.farmer_id = u.user_id
        WHERE pl.listing_id = ?`,
        [listingId]
    );

    return rows[0];
};

/**
 * @desc    Get produce by farmer
 * @returns {Array} Produce listings
 */
const getProduceByFarmer = async (farmerId) => {
    const [rows] = await pool.query(
        `SELECT * FROM produce_listings 
        WHERE farmer_id = ? 
        ORDER BY created_at DESC`,
        [farmerId]
    );

    return rows;
};

/**
 * @desc    Update produce listing
 * @returns {boolean} Success status
 */
const updateProduce = async (listingId, updateData) => {
    const fields = [];
    const values = [];

    // Build dynamic UPDATE query
    const allowedFields = [
        'produce_name', 'category', 'quantity', 'unit', 'price_per_unit',
        'available_from', 'available_until', 'description', 'quality_grade',
        'location', 'image_url', 'status'
    ];

    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(listingId);

    const [result] = await pool.query(
        `UPDATE produce_listings SET ${fields.join(', ')} WHERE listing_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * @desc    Delete produce listing (HARD DELETE)
 * @returns {boolean} Success status
 */
const deleteProduce = async (listingId) => {
    const [result] = await pool.query(
        'DELETE FROM produce_listings WHERE listing_id = ?',
        [listingId]
    );

    return result.affectedRows > 0;
};

/**
 * @desc    Increment views count
 * @returns {boolean} Success status
 */
const incrementViews = async (listingId) => {
    const [result] = await pool.query(
        'UPDATE produce_listings SET views_count = views_count + 1 WHERE listing_id = ?',
        [listingId]
    );

    return result.affectedRows > 0;
};

/**
 * @desc    Get all categories
 * @returns {Array} Categories
 */
const getCategories = async () => {
    const [rows] = await pool.query(
        'SELECT DISTINCT category FROM produce_listings WHERE category IS NOT NULL ORDER BY category'
    );

    return rows.map(row => row.category);
};

module.exports = {
    createProduce,
    getAllProduce,
    getProduceCount,
    getProduceById,
    getProduceByFarmer,
    updateProduce,
    deleteProduce,
    incrementViews,
    getCategories
};