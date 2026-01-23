// models/userModel.js
// Database queries for user-related operations

const { pool } = require('../config/db');

/**
 * Find user by email
 * @param {string} email 
 * @returns {object} User object or null
 */
const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find user by phone number
 * @param {string} phoneNumber 
 * @returns {object} User object or null
 */
const findUserByPhone = async (phoneNumber) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE phone_number = ?',
        [phoneNumber]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find user by ID (excluding password)
 * @param {number} userId 
 * @returns {object} User object or null
 */
const findUserById = async (userId) => {
    const [rows] = await pool.query(
        'SELECT user_id, full_name, email, phone_number, user_type, location, profile_image, created_at, is_active FROM users WHERE user_id = ?',
        [userId]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Create new user
 * @param {object} userData - User data (full_name, email, phone_number, password_hash, user_type, location)
 * @returns {number} New user ID
 */
const createUser = async (userData) => {
    const { full_name, email, phone_number, password_hash, user_type, location } = userData;
    
    const [result] = await pool.query(
        'INSERT INTO users (full_name, email, phone_number, password_hash, user_type, location) VALUES (?, ?, ?, ?, ?, ?)',
        [full_name, email, phone_number, password_hash, user_type, location]
    );
    
    return result.insertId;
};

/**
 * Update user profile
 * @param {number} userId 
 * @param {object} updateData 
 * @returns {boolean} Success status
 */
const updateUser = async (userId, updateData) => {
    const fields = [];
    const values = [];

    // Build dynamic UPDATE query based on provided fields
    for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined && key !== 'user_id' && key !== 'password_hash') {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(userId);

    const [result] = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * Delete user (deactivate)
 * @param {number} userId 
 * @returns {boolean} Success status
 */
const deactivateUser = async (userId) => {
    const [result] = await pool.query(
        'UPDATE users SET is_active = FALSE WHERE user_id = ?',
        [userId]
    );
    return result.affectedRows > 0;
};

module.exports = {
    findUserByEmail,
    findUserByPhone,
    findUserById,
    createUser,
    updateUser,
    deactivateUser
};