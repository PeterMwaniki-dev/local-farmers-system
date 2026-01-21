-- ============================================
-- Local Farmers Information and Advisory System
-- Database Schema
-- Author: Peter Mbugua Mwaniki
-- Date: January 2026
-- ============================================

-- Use the database
USE local_farmers_db;

-- ============================================
-- 1. USERS TABLE (Core table for all user types)
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('farmer', 'expert', 'buyer', 'admin') NOT NULL,
    location VARCHAR(100),
    profile_image VARCHAR(255) DEFAULT 'default-avatar.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_user_type (user_type),
    INDEX idx_email (email)
);

-- ============================================
-- 2. FARMER PROFILES TABLE
-- ============================================
CREATE TABLE farmer_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    farm_size DECIMAL(10,2) COMMENT 'Farm size in acres',
    farm_location VARCHAR(150),
    main_crops TEXT COMMENT 'Comma-separated list of main crops',
    farming_experience INT COMMENT 'Years of farming experience',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- 3. EXPERT PROFILES TABLE
-- ============================================
CREATE TABLE expert_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    specialization VARCHAR(100) COMMENT 'e.g., Crop Science, Livestock, Soil Management',
    qualification VARCHAR(200),
    years_of_experience INT,
    organization VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- 4. BUYER PROFILES TABLE
-- ============================================
CREATE TABLE buyer_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    business_name VARCHAR(150),
    business_type VARCHAR(100) COMMENT 'e.g., Retailer, Wholesaler, Restaurant',
    preferred_produce TEXT COMMENT 'Comma-separated list of produce types',
    delivery_location VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- 5. PRODUCE LISTINGS TABLE
-- ============================================
CREATE TABLE produce_listings (
    listing_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    produce_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) COMMENT 'e.g., Vegetables, Fruits, Cereals, Legumes',
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) COMMENT 'e.g., kg, bags, crates',
    price_per_unit DECIMAL(10,2),
    available_from DATE,
    available_until DATE,
    description TEXT,
    quality_grade VARCHAR(20) COMMENT 'e.g., Grade A, Grade B, Premium',
    location VARCHAR(100),
    image_url VARCHAR(255),
    status ENUM('available', 'sold', 'expired') DEFAULT 'available',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_produce_name (produce_name),
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- ============================================
-- 6. BUYER REQUESTS TABLE
-- ============================================
CREATE TABLE buyer_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    buyer_id INT NOT NULL,
    produce_needed VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity_needed DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    budget_per_unit DECIMAL(10,2),
    delivery_location VARCHAR(100),
    needed_by_date DATE,
    description TEXT,
    status ENUM('open', 'fulfilled', 'cancelled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_produce_needed (produce_needed),
    INDEX idx_status (status)
);

-- ============================================
-- 7. ADVISORY POSTS TABLE (Expert-generated content)
-- ============================================
CREATE TABLE advisory_posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    expert_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) COMMENT 'e.g., Pest Control, Fertilization, Planting',
    tags VARCHAR(255) COMMENT 'Comma-separated tags for searchability',
    image_url VARCHAR(255),
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expert_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 8. ADVISORY QUESTIONS TABLE (Farmer questions)
-- ============================================
CREATE TABLE advisory_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    question_text TEXT NOT NULL,
    category VARCHAR(50),
    status ENUM('open', 'answered', 'closed') DEFAULT 'open',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- ============================================
-- 9. ADVISORY RESPONSES TABLE (Expert answers)
-- ============================================
CREATE TABLE advisory_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    expert_id INT NOT NULL,
    response_text TEXT NOT NULL,
    is_helpful BOOLEAN DEFAULT NULL COMMENT 'Farmer can mark if helpful',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES advisory_questions(question_id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id)
);

-- ============================================
-- 10. FORUM POSTS TABLE (Community discussions)
-- ============================================
CREATE TABLE forum_posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) COMMENT 'e.g., General, Success Stories, Tips',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 11. FORUM COMMENTS TABLE
-- ============================================
CREATE TABLE forum_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
);

-- ============================================
-- 12. MARKET TRENDS TABLE (Aggregated data)
-- ============================================
CREATE TABLE market_trends (
    trend_id INT PRIMARY KEY AUTO_INCREMENT,
    produce_name VARCHAR(100) NOT NULL,
    average_price DECIMAL(10,2),
    demand_level ENUM('low', 'medium', 'high'),
    supply_level ENUM('low', 'medium', 'high'),
    recorded_date DATE NOT NULL,
    location VARCHAR(100),
    data_points INT COMMENT 'Number of listings used for calculation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_produce_name (produce_name),
    INDEX idx_recorded_date (recorded_date)
);

-- ============================================
-- 13. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) COMMENT 'e.g., new_response, new_request, system',
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT COMMENT 'ID of related entity (question_id, request_id, etc.)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- ============================================
-- 14. MESSAGES TABLE (Direct messaging)
-- ============================================
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(150),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_is_read (is_read)
);

-- ============================================
-- END OF SCHEMA
-- ============================================