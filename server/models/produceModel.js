// models/produceModel.js
// Database queries for produce-related operations

const { pool } = require('../config/db');

/**
 * Create new produce listing
 * @param {object} produceData - Produce information
 * @returns {number} New listing ID
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
        [
            farmer_id,
            produce_name,
            category,
            quantity,
            unit,
            price_per_unit || null,
            available_from || null,
            available_until || null,
            description || null,
            quality_grade || null,
            location,
            image_url || null
        ]
    );

    return result.insertId;
};

/**
 * Get all available produce (with filters)
 * @param {object} filters - Optional filters (category, search, location)
 * @param {number} limit - Results per page
 * @param {number} offset - Skip results
 * @returns {array} Array of produce listings
 */
const getAllProduce = async (filters = {}, limit = 20, offset = 0) => {
    let query = `
        SELECT 
            pl.*,
            u.full_name as farmer_name,
            u.phone_number as farmer_phone,
            u.location as farmer_location
        FROM produce_listings pl
        INNER JOIN users u ON pl.farmer_id = u.user_id
        WHERE pl.status = 'available'
    `;

    const params = [];

    // Apply filters
    if (filters.category) {
        query += ' AND pl.category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (pl.produce_name LIKE ? OR pl.description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
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

    // Order by most recent first
    query += ' ORDER BY pl.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

/**
 * Get total count of produce listings (for pagination)
 * @param {object} filters - Optional filters
 * @returns {number} Total count
 */
const getProduceCount = async (filters = {}) => {
    let query = 'SELECT COUNT(*) as total FROM produce_listings WHERE status = "available"';
    const params = [];

    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (produce_name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
    }

    if (filters.location) {
        query += ' AND location LIKE ?';
        params.push(`%${filters.location}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
};

/**
 * Get single produce by ID
 * @param {number} listingId 
 * @returns {object} Produce details with farmer info
 */
const getProduceById = async (listingId) => {
    const [rows] = await pool.query(
        `SELECT 
            pl.*,
            u.full_name as farmer_name,
            u.phone_number as farmer_phone,
            u.email as farmer_email,
            u.location as farmer_location,
            fp.farm_size,
            fp.main_crops
        FROM produce_listings pl
        INNER JOIN users u ON pl.farmer_id = u.user_id
        LEFT JOIN farmer_profiles fp ON u.user_id = fp.user_id
        WHERE pl.listing_id = ?`,
        [listingId]
    );

    return rows.length > 0 ? rows[0] : null;
};

/**
 * Get all produce listings by a specific farmer
 * @param {number} farmerId 
 * @returns {array} Array of farmer's produce listings
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
 * Update produce listing
 * @param {number} listingId 
 * @param {object} updateData 
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
 * Delete produce listing (soft delete - mark as expired)
 * @param {number} listingId 
 * @returns {boolean} Success status
 */
const deleteProduce = async (listingId) => {
    const [result] = await pool.query(
        'UPDATE produce_listings SET status = "expired" WHERE listing_id = ?',
        [listingId]
    );

    return result.affectedRows > 0;
};

/**
 * Hard delete produce listing (permanent removal)
 * @param {number} listingId 
 * @returns {boolean} Success status
 */
const hardDeleteProduce = async (listingId) => {
    const [result] = await pool.query(
        'DELETE FROM produce_listings WHERE listing_id = ?',
        [listingId]
    );

    return result.affectedRows > 0;
};

/**
 * Increment views count
 * @param {number} listingId 
 */
const incrementViews = async (listingId) => {
    await pool.query(
        'UPDATE produce_listings SET views_count = views_count + 1 WHERE listing_id = ?',
        [listingId]
    );
};

/**
 * Get produce categories (for filters/dropdowns)
 * @returns {array} Array of unique categories
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
    hardDeleteProduce,
    incrementViews,
    getCategories
};