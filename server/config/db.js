// config/db.js
// Database connection configuration

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (more efficient than single connections)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,        // Maximum 10 connections at once
    queueLimit: 0
});

// Convert pool to use promises instead of callbacks
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);  // Exit if database connection fails
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};