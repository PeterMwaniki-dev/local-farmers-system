const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

/**
 * Protect routes - verify JWT token
 * Adds user info to req.user if token is valid
 */
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database (exclude password)
            const [users] = await pool.query(
                'SELECT user_id, full_name, email, phone_number, user_type, location, profile_image, is_active FROM users WHERE user_id = ?',
                [decoded.id]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user is active
            if (!users[0].is_active) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated'
                });
            }

            // Attach user to request object
            req.user = users[0];
            next();

        } catch (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }
};

/**
 * Authorize specific user types
 * @param  {...string} roles - Allowed user types (farmer, expert, buyer, admin)
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.user_type)) {
            return res.status(403).json({
                success: false,
                message: `User type '${req.user.user_type}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };