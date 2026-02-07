// controllers/authController.js
// Handle authentication logic (register, login)

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const generateToken = require('../utils/generateToken');
const {
    findUserByEmail,
    findUserByPhone,
    createUser
} = require('../models/userModel');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone_number,
            password,
            user_type,
            location,
            // Optional profile data
            farm_size,
            main_crops,
            farming_experience,
            specialization,
            qualification,
            business_name,
            business_type
        } = req.body;

        // Validation
        if (!full_name || !email || !phone_number || !password || !user_type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate user_type
        const validUserTypes = ['farmer', 'expert', 'buyer', 'admin'];
        if (!validUserTypes.includes(user_type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // Check if email already exists
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Check if phone number already exists
        const existingPhone = await findUserByPhone(phone_number);
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const userId = await createUser({
            full_name,
            email,
            phone_number,
            password_hash,
            user_type,
            location
        });

        // Create profile based on user type
        if (user_type === 'farmer' && (farm_size || main_crops || farming_experience)) {
            await pool.query(
                'INSERT INTO farmer_profiles (user_id, farm_size, farm_location, main_crops, farming_experience) VALUES (?, ?, ?, ?, ?)',
                [userId, farm_size || null, location, main_crops || null, farming_experience || null]
            );
        } else if (user_type === 'expert' && (specialization || qualification)) {
            await pool.query(
                'INSERT INTO expert_profiles (user_id, specialization, qualification, organization) VALUES (?, ?, ?, ?)',
                [userId, specialization || null, qualification || null, req.body.organization || null]
            );
        } else if (user_type === 'buyer' && (business_name || business_type)) {
            await pool.query(
                'INSERT INTO buyer_profiles (user_id, business_name, business_type, delivery_location) VALUES (?, ?, ?, ?)',
                [userId, business_name || null, business_type || null, location]
            );
        }

        // Generate token
        const token = generateToken(userId, user_type);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user_id: userId,
                full_name,
                email,
                phone_number,
                user_type,
                location,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists
        const user = await findUserByEmail(email);
        console.log('🔍 User found:', user ? 'YES' : 'NO'); // ADD THIS
        console.log('🔍 User data:', user); // ADD THIS
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        console.log('🔑 Password match:', isPasswordMatch);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user.user_id, user.user_type);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number,
                user_type: user.user_type,
                location: user.location,
                profile_image: user.profile_image,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        // req.user is set by protect middleware
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};