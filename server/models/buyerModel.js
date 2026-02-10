// models/buyerModel.js
// Database queries for buyer request operations

const { pool } = require('../config/db');

/**
 * Create new buyer request
 * @param {object} requestData - Request information
 * @returns {number} New request ID
 */
const createRequest = async (requestData) => {
    const {
        buyer_id,
        produce_needed,
        category,
        quantity_needed,
        unit,
        budget_per_unit,
        delivery_location,
        needed_by_date,
        description
    } = requestData;

    const [result] = await pool.query(
        `INSERT INTO buyer_requests 
        (buyer_id, produce_needed, category, quantity_needed, unit, budget_per_unit, 
         delivery_location, needed_by_date, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            buyer_id,
            produce_needed,
            category || null,
            quantity_needed,
            unit,
            budget_per_unit || null,
            delivery_location,
            needed_by_date || null,
            description || null
        ]
    );

    return result.insertId;
};

/**
 * Get all buyer requests (with filters)
 * @param {object} filters - Optional filters
 * @param {number} limit - Results per page
 * @param {number} offset - Skip results
 * @returns {array} Array of buyer requests
 */
const getAllRequests = async (filters = {}, limit = 20, offset = 0) => {
    let query = `
        SELECT 
            br.*,
            u.full_name as buyer_name,
            u.phone_number as buyer_phone,
            u.email as buyer_email,
            u.location as buyer_location,
            bp.business_name,
            bp.business_type
        FROM buyer_requests br
        INNER JOIN users u ON br.buyer_id = u.user_id
        LEFT JOIN buyer_profiles bp ON u.user_id = bp.user_id
        WHERE br.status = 'open'
    `;

    const params = [];

    // Apply filters
    if (filters.category) {
        query += ' AND br.category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (br.produce_needed LIKE ? OR br.description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
    }

    if (filters.location) {
        query += ' AND br.delivery_location LIKE ?';
        params.push(`%${filters.location}%`);
    }

    if (filters.min_budget) {
        query += ' AND br.budget_per_unit >= ?';
        params.push(filters.min_budget);
    }

    if (filters.max_budget) {
        query += ' AND br.budget_per_unit <= ?';
        params.push(filters.max_budget);
    }

    // Order by most recent first
    query += ' ORDER BY br.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

/**
 * Get total count of requests (for pagination)
 * @param {object} filters - Optional filters
 * @returns {number} Total count
 */
const getRequestCount = async (filters = {}) => {
    let query = 'SELECT COUNT(*) as total FROM buyer_requests WHERE status = "open"';
    const params = [];

    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (produce_needed LIKE ? OR description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
    }

    if (filters.location) {
        query += ' AND delivery_location LIKE ?';
        params.push(`%${filters.location}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
};

/**
 * Get single request by ID
 * @param {number} requestId 
 * @returns {object} Request details with buyer info
 */
const getRequestById = async (requestId) => {
    const [rows] = await pool.query(
        `SELECT 
            br.*,
            u.full_name as buyer_name,
            u.phone_number as buyer_phone,
            u.email as buyer_email,
            u.location as buyer_location,
            bp.business_name,
            bp.business_type,
            bp.preferred_produce
        FROM buyer_requests br
        INNER JOIN users u ON br.buyer_id = u.user_id
        LEFT JOIN buyer_profiles bp ON u.user_id = bp.user_id
        WHERE br.request_id = ?`,
        [requestId]
    );

    return rows.length > 0 ? rows[0] : null;
};

/**
 * Get all requests by a specific buyer
 * @param {number} buyerId 
 * @returns {array} Array of buyer's requests
 */
const getRequestsByBuyer = async (buyerId) => {
    const [rows] = await pool.query(
        `SELECT * FROM buyer_requests 
         WHERE buyer_id = ? 
         ORDER BY created_at DESC`,
        [buyerId]
    );

    return rows;
};

/**
 * Update buyer request
 * @param {number} requestId 
 * @param {object} updateData 
 * @returns {boolean} Success status
 */
const updateRequest = async (requestId, updateData) => {
    const fields = [];
    const values = [];

    // Build dynamic UPDATE query
    const allowedFields = [
        'produce_needed', 'category', 'quantity_needed', 'unit', 'budget_per_unit',
        'delivery_location', 'needed_by_date', 'description', 'status'
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

    values.push(requestId);

    const [result] = await pool.query(
        `UPDATE buyer_requests SET ${fields.join(', ')} WHERE request_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * Delete buyer request (soft delete - mark as cancelled)
 * @param {number} requestId 
 * @returns {boolean} Success status
 */
const deleteRequest = async (requestId) => {
    const [result] = await pool.query(
        'DELETE FROM buyer_requests WHERE request_id = ?',
        [requestId]
    );

    return result.affectedRows > 0;
};

/**
 * Hard delete buyer request (permanent removal)
 * @param {number} requestId 
 * @returns {boolean} Success status
 */
const hardDeleteRequest = async (requestId) => {
    const [result] = await pool.query(
        'DELETE FROM buyer_requests WHERE request_id = ?',
        [requestId]
    );

    return result.affectedRows > 0;
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestCount,
    getRequestById,
    getRequestsByBuyer,
    updateRequest,
    deleteRequest,
    hardDeleteRequest
};