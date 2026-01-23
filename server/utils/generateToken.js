// utils/generateToken.js
// Helper function to generate JWT tokens

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated users
 * @param {number} userId - User's ID from database
 * @param {string} userType - User's role (farmer, expert, buyer, admin)
 * @returns {string} JWT token
 */
const generateToken = (userId, userType) => {
    return jwt.sign(
        { 
            id: userId,
            userType: userType 
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

module.exports = generateToken;