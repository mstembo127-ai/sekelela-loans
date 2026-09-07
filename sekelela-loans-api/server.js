require('express-async-errors');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging Middleware
app.use(morgan('combined'));

// Custom Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Request Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// ============================================
// RATE LIMITING
// ============================================

const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/api/health'
});

// Login rate limiter (stricter)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts
    message: 'Too many login attempts, please try again later',
    skipSuccessfulRequests: true
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', loginLimiter);

// ============================================
// ROUTES
// ============================================

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Version
app.get('/api/version', (req, res) => {
    res.status(200).json({
        version: '1.0.0',
        name: 'Sekelela Loans API'
    });
});

// Import route handlers
const applicationsRouter = require('./routes/applications');
const authRouter = require('./routes/auth');
const paymentsRouter = require('./routes/payments');
const adminRouter = require('./routes/admin');

// Register routes
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404,
            path: req.path,
            method: req.method
        }
    });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
    // Logging
    console.error(`\n${'='.repeat(50)}`);
    console.error(`Error: ${err.message}`);
    console.error(`Status: ${err.status || 500}`);
    console.error(`Path: ${req.path}`);
    console.error(`Method: ${req.method}`);
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`${'='.repeat(50)}\n`);

    // Determine status code
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Validation errors from Joi
    if (err.details) {
        return res.status(400).json({
            error: {
                message: 'Validation Error',
                status: 400,
                details: err.details
            }
        });
    }

    // Database errors
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: {
                message: 'Resource already exists',
                status: 409
            }
        });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(404).json({
            error: {
                message: 'Referenced resource not found',
                status: 404
            }
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: {
                message: 'Invalid token',
                status: 401
            }
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: {
                message: 'Token expired',
                status: 401
            }
        });
    }

    // Generic error response
    res.status(status).json({
        error: {
            message: message,
            status: status,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Sekelela Loans API Server Started    ║
╠════════════════════════════════════════╣
║ Port: ${PORT}
║ Environment: ${process.env.NODE_ENV || 'development'}
║ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
║ Time: ${new Date().toISOString()}
╚════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = app;
