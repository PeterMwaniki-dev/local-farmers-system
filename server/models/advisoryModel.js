// models/advisoryModel.js
// Database queries for advisory system operations

const { pool } = require('../config/db');

// =============================================
// ADVISORY POSTS (Expert-generated content)
// =============================================

/**
 * Create new advisory post
 * @param {object} postData - Post information
 * @returns {number} New post ID
 */
const createPost = async (postData) => {
    const {
        expert_id,
        title,
        content,
        category,
        tags,
        image_url
    } = postData;

    const [result] = await pool.query(
        `INSERT INTO advisory_posts 
        (expert_id, title, content, category, tags, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [expert_id, title, content, category || null, tags || null, image_url || null]
    );

    return result.insertId;
};

/**
 * Get all advisory posts (with filters)
 * @param {object} filters - Optional filters
 * @param {number} limit - Results per page
 * @param {number} offset - Skip results
 * @returns {array} Array of advisory posts
 */
const getAllPosts = async (filters = {}, limit = 20, offset = 0) => {
    let query = `
        SELECT 
            ap.*,
            u.full_name as expert_name,
            u.email as expert_email,
            ep.specialization,
            ep.qualification
        FROM advisory_posts ap
        INNER JOIN users u ON ap.expert_id = u.user_id
        LEFT JOIN expert_profiles ep ON u.user_id = ep.user_id
        WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (filters.category) {
        query += ' AND ap.category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (ap.title LIKE ? OR ap.content LIKE ? OR ap.tags LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.expert_id) {
        query += ' AND ap.expert_id = ?';
        params.push(filters.expert_id);
    }

    // Order by most recent first
    query += ' ORDER BY ap.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

/**
 * Get total count of posts (for pagination)
 * @param {object} filters - Optional filters
 * @returns {number} Total count
 */
const getPostCount = async (filters = {}) => {
    let query = 'SELECT COUNT(*) as total FROM advisory_posts WHERE 1=1';
    const params = [];

    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
};

/**
 * Get single post by ID
 * @param {number} postId 
 * @returns {object} Post details with expert info
 */
const getPostById = async (postId) => {
    const [rows] = await pool.query(
        `SELECT 
            ap.*,
            u.full_name as expert_name,
            u.email as expert_email,
            u.phone_number as expert_phone,
            ep.specialization,
            ep.qualification,
            ep.organization
        FROM advisory_posts ap
        INNER JOIN users u ON ap.expert_id = u.user_id
        LEFT JOIN expert_profiles ep ON u.user_id = ep.user_id
        WHERE ap.post_id = ?`,
        [postId]
    );

    return rows.length > 0 ? rows[0] : null;
};

/**
 * Get all posts by a specific expert
 * @param {number} expertId 
 * @returns {array} Array of expert's posts
 */
const getPostsByExpert = async (expertId) => {
    const [rows] = await pool.query(
        `SELECT * FROM advisory_posts 
         WHERE expert_id = ? 
         ORDER BY created_at DESC`,
        [expertId]
    );

    return rows;
};

/**
 * Update advisory post
 * @param {number} postId 
 * @param {object} updateData 
 * @returns {boolean} Success status
 */
const updatePost = async (postId, updateData) => {
    const fields = [];
    const values = [];

    const allowedFields = ['title', 'content', 'category', 'tags', 'image_url'];

    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(postId);

    const [result] = await pool.query(
        `UPDATE advisory_posts SET ${fields.join(', ')} WHERE post_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * Delete advisory post
 * @param {number} postId 
 * @returns {boolean} Success status
 */
const deletePost = async (postId) => {
    const [result] = await pool.query(
        'DELETE FROM advisory_posts WHERE post_id = ?',
        [postId]
    );

    return result.affectedRows > 0;
};

/**
 * Increment views count for post
 * @param {number} postId 
 */
const incrementPostViews = async (postId) => {
    await pool.query(
        'UPDATE advisory_posts SET views_count = views_count + 1 WHERE post_id = ?',
        [postId]
    );
};

// =============================================
// ADVISORY QUESTIONS (Farmer questions)
// =============================================

/**
 * Create new question
 * @param {object} questionData - Question information
 * @returns {number} New question ID
 */
const createQuestion = async (questionData) => {
    const {
        farmer_id,
        title,
        question_text,
        category
    } = questionData;

    const [result] = await pool.query(
        `INSERT INTO advisory_questions 
        (farmer_id, title, question_text, category) 
        VALUES (?, ?, ?, ?)`,
        [farmer_id, title, question_text, category || null]
    );

    return result.insertId;
};

/**
 * Get all questions (with filters)
 * @param {object} filters - Optional filters
 * @param {number} limit - Results per page
 * @param {number} offset - Skip results
 * @returns {array} Array of questions
 */
const getAllQuestions = async (filters = {}, limit = 20, offset = 0) => {
    let query = `
        SELECT 
            aq.*,
            u.full_name as farmer_name,
            u.location as farmer_location,
            (SELECT COUNT(*) FROM advisory_responses WHERE question_id = aq.question_id) as response_count
        FROM advisory_questions aq
        INNER JOIN users u ON aq.farmer_id = u.user_id
        WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (filters.category) {
        query += ' AND aq.category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (aq.title LIKE ? OR aq.question_text LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
    }

    if (filters.status) {
        query += ' AND aq.status = ?';
        params.push(filters.status);
    }

    // Order by most recent first
    query += ' ORDER BY aq.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};

/**
 * Get total count of questions (for pagination)
 * @param {object} filters - Optional filters
 * @returns {number} Total count
 */
const getQuestionCount = async (filters = {}) => {
    let query = 'SELECT COUNT(*) as total FROM advisory_questions WHERE 1=1';
    const params = [];

    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.search) {
        query += ' AND (title LIKE ? OR question_text LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
    }

    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
};

/**
 * Get single question by ID with all responses
 * @param {number} questionId 
 * @returns {object} Question details with responses
 */
const getQuestionById = async (questionId) => {
    // Get question details
    const [questionRows] = await pool.query(
        `SELECT 
            aq.*,
            u.full_name as farmer_name,
            u.email as farmer_email,
            u.phone_number as farmer_phone,
            u.location as farmer_location
        FROM advisory_questions aq
        INNER JOIN users u ON aq.farmer_id = u.user_id
        WHERE aq.question_id = ?`,
        [questionId]
    );

    if (questionRows.length === 0) {
        return null;
    }

    const question = questionRows[0];

    // Get all responses for this question
    const [responseRows] = await pool.query(
        `SELECT 
            ar.*,
            u.full_name as expert_name,
            u.email as expert_email,
            ep.specialization,
            ep.qualification
        FROM advisory_responses ar
        INNER JOIN users u ON ar.expert_id = u.user_id
        LEFT JOIN expert_profiles ep ON u.user_id = ep.user_id
        WHERE ar.question_id = ?
        ORDER BY ar.created_at ASC`,
        [questionId]
    );

    question.responses = responseRows;

    return question;
};

/**
 * Get all questions by a specific farmer
 * @param {number} farmerId 
 * @returns {array} Array of farmer's questions
 */
const getQuestionsByFarmer = async (farmerId) => {
    const [rows] = await pool.query(
        `SELECT 
            aq.*,
            (SELECT COUNT(*) FROM advisory_responses WHERE question_id = aq.question_id) as response_count
        FROM advisory_questions aq
        WHERE aq.farmer_id = ? 
        ORDER BY aq.created_at DESC`,
        [farmerId]
    );

    return rows;
};

/**
 * Update question
 * @param {number} questionId 
 * @param {object} updateData 
 * @returns {boolean} Success status
 */
const updateQuestion = async (questionId, updateData) => {
    const fields = [];
    const values = [];

    const allowedFields = ['title', 'question_text', 'category', 'status'];

    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(questionId);

    const [result] = await pool.query(
        `UPDATE advisory_questions SET ${fields.join(', ')} WHERE question_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * Delete question
 * @param {number} questionId 
 * @returns {boolean} Success status
 */
const deleteQuestion = async (questionId) => {
    const [result] = await pool.query(
        'DELETE FROM advisory_questions WHERE question_id = ?',
        [questionId]
    );

    return result.affectedRows > 0;
};

/**
 * Increment views count for question
 * @param {number} questionId 
 */
const incrementQuestionViews = async (questionId) => {
    await pool.query(
        'UPDATE advisory_questions SET views_count = views_count + 1 WHERE question_id = ?',
        [questionId]
    );
};

// =============================================
// ADVISORY RESPONSES (Expert answers)
// =============================================

/**
 * Create response to a question
 * @param {object} responseData - Response information
 * @returns {number} New response ID
 */
const createResponse = async (responseData) => {
    const {
        question_id,
        expert_id,
        response_text
    } = responseData;

    const [result] = await pool.query(
        `INSERT INTO advisory_responses 
        (question_id, expert_id, response_text) 
        VALUES (?, ?, ?)`,
        [question_id, expert_id, response_text]
    );

    // Update question status to 'answered'
    await pool.query(
        'UPDATE advisory_questions SET status = "answered" WHERE question_id = ?',
        [question_id]
    );

    return result.insertId;
};

/**
 * Get response by ID
 * @param {number} responseId 
 * @returns {object} Response details
 */
const getResponseById = async (responseId) => {
    const [rows] = await pool.query(
        `SELECT 
            ar.*,
            u.full_name as expert_name,
            ep.specialization
        FROM advisory_responses ar
        INNER JOIN users u ON ar.expert_id = u.user_id
        LEFT JOIN expert_profiles ep ON u.user_id = ep.user_id
        WHERE ar.response_id = ?`,
        [responseId]
    );

    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update response
 * @param {number} responseId 
 * @param {object} updateData 
 * @returns {boolean} Success status
 */
const updateResponse = async (responseId, updateData) => {
    const fields = [];
    const values = [];

    const allowedFields = ['response_text', 'is_helpful'];

    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(responseId);

    const [result] = await pool.query(
        `UPDATE advisory_responses SET ${fields.join(', ')} WHERE response_id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * Delete response
 * @param {number} responseId 
 * @returns {boolean} Success status
 */
const deleteResponse = async (responseId) => {
    const [result] = await pool.query(
        'DELETE FROM advisory_responses WHERE response_id = ?',
        [responseId]
    );

    return result.affectedRows > 0;
};

module.exports = {
    // Posts
    createPost,
    getAllPosts,
    getPostCount,
    getPostById,
    getPostsByExpert,
    updatePost,
    deletePost,
    incrementPostViews,
    
    // Questions
    createQuestion,
    getAllQuestions,
    getQuestionCount,
    getQuestionById,
    getQuestionsByFarmer,
    updateQuestion,
    deleteQuestion,
    incrementQuestionViews,
    
    // Responses
    createResponse,
    getResponseById,
    updateResponse,
    deleteResponse
};