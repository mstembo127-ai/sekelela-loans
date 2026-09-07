const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'sekelela',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'sekelela_loans',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✓ MySQL Database connected successfully');
        connection.release();
    })
    .catch(error => {
        console.error('✗ MySQL Database connection failed:', error.message);
        console.error('Please check your database configuration in .env file');
    });

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
    if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.error('Fatal error occurred; no more connections will be created to the server.');
    }
    if (err.code === 'PROTOCOL_ENQUEUE_AFTER_INVOKING_ERROR') {
        console.error('An error was invoked with the connection.');
    }
});

module.exports = pool;
