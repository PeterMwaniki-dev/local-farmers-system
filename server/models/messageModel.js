const { pool } = require('../config/db');

/**
 * Insert a new message
 */
const createMessage = async ({ sender_id, receiver_id, subject, message_text }) => {
    const [result] = await pool.query(
        'INSERT INTO messages (sender_id, receiver_id, subject, message_text) VALUES (?, ?, ?, ?)',
        [sender_id, receiver_id, subject || null, message_text]
    );
    return result.insertId;
};

/**
 * Check if any messages exist between two users
 */
const hasConversation = async (userId1, userId2) => {
    const [rows] = await pool.query(
        `SELECT 1 FROM messages
         WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
         LIMIT 1`,
        [userId1, userId2, userId2, userId1]
    );
    return rows.length > 0;
};

/**
 * Get full message thread between current user and another user
 */
const getThread = async (userId, otherUserId) => {
    const [rows] = await pool.query(
        `SELECT
            m.message_id,
            m.sender_id,
            m.receiver_id,
            m.subject,
            m.message_text,
            m.is_read,
            m.created_at,
            s.full_name AS sender_name,
            r.full_name AS receiver_name
         FROM messages m
         JOIN users s ON m.sender_id = s.user_id
         JOIN users r ON m.receiver_id = r.user_id
         WHERE (m.sender_id = ? AND m.receiver_id = ?)
            OR (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC`,
        [userId, otherUserId, otherUserId, userId]
    );
    return rows;
};

/**
 * List conversations for inbox (one row per contact, most recent first)
 */
const getConversations = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            u.user_id AS partner_id,
            u.full_name AS partner_name,
            u.user_type AS partner_type,
            lm.message_text AS last_message,
            lm.sender_id AS last_sender_id,
            lm.created_at AS last_message_at,
            (
                SELECT COUNT(*)
                FROM messages um
                WHERE um.receiver_id = ? AND um.sender_id = u.user_id AND um.is_read = FALSE
            ) AS unread_count
         FROM users u
         INNER JOIN (
            SELECT
                CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS partner_id,
                MAX(message_id) AS last_message_id
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY partner_id
         ) conv ON conv.partner_id = u.user_id
         INNER JOIN messages lm ON lm.message_id = conv.last_message_id
         ORDER BY lm.created_at DESC`,
        [userId, userId, userId, userId]
    );
    return rows;
};

/**
 * Count all unread messages for the logged-in user
 */
const getUnreadCount = async (userId) => {
    const [rows] = await pool.query(
        'SELECT COUNT(*) AS count FROM messages WHERE receiver_id = ? AND is_read = FALSE',
        [userId]
    );
    return rows[0].count;
};

/**
 * Mark messages from a sender as read for the current receiver
 */
const markAsRead = async (receiverId, senderId) => {
    const [result] = await pool.query(
        'UPDATE messages SET is_read = TRUE WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE',
        [receiverId, senderId]
    );
    return result.affectedRows;
};

/**
 * Get a single message by ID with sender/receiver names
 */
const getMessageById = async (messageId) => {
    const [rows] = await pool.query(
        `SELECT m.*, s.full_name AS sender_name, r.full_name AS receiver_name
         FROM messages m
         JOIN users s ON m.sender_id = s.user_id
         JOIN users r ON m.receiver_id = r.user_id
         WHERE m.message_id = ?`,
        [messageId]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Get a user by ID (for validation)
 */
const getUserById = async (userId) => {
    const [rows] = await pool.query(
        'SELECT user_id, full_name, email, user_type, is_active FROM users WHERE user_id = ?',
        [userId]
    );
    return rows.length > 0 ? rows[0] : null;
};

module.exports = {
    createMessage,
    hasConversation,
    getThread,
    getConversations,
    getUnreadCount,
    markAsRead,
    getMessageById,
    getUserById
};
