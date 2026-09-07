# Sekelela Loans - Backend Setup Guide

Complete guide for setting up the backend infrastructure for Sekelela Loans, including database, API, authentication, and payment processing.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [API Development](#api-development)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Integration](#payment-integration)
- [Email & SMS Notifications](#email--sms-notifications)
- [Admin Dashboard](#admin-dashboard)
- [Security Implementation](#security-implementation)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (index.html)                  │
│         (HTML5, CSS3, Vanilla JavaScript)               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              API Server (Node.js/Express)                │
│  • Authentication & Authorization                       │
│  • Form Data Processing                                 │
│  • Application Management                               │
│  • Payment Processing                                   │
│  • Document Management                                  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌─────────┐
    │Database│  │File    │  │External │
    │ (MySQL)│  │Storage │  │Services │
    └────────┘  └────────┘  └─────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
            Payments         Email Service    SMS Service
            (Stripe)         (SendGrid)       (Twilio)
```

---

## 💻 Technology Stack

### Recommended Backend Stack

| Component | Technology | Alternative |
|-----------|-----------|-------------|
| Runtime | Node.js 18+ | Python 3.10+, Java 11+ |
| Framework | Express.js | Django, FastAPI, Spring Boot |
| Database | MySQL 8.0+ | PostgreSQL, MongoDB |
| Authentication | JWT | OAuth2, Session-based |
| File Storage | AWS S3 | Google Cloud, Azure, Local |
| Payment Gateway | Stripe | PayPal, Flutterwave |
| Email Service | SendGrid | Mailgun, AWS SES |
| SMS Service | Twilio | Vonage, AWS SNS |
| API Documentation | Swagger/OpenAPI | Postman |

---

## 📋 Prerequisites

### System Requirements
- Linux/macOS/Windows with WSL2
- Node.js 18+ or Python 3.10+
- MySQL 8.0+ or PostgreSQL 12+
- Git
- 4GB RAM (minimum)
- 20GB Storage (minimum)

### Accounts & Services
- GitHub account (code repository)
- AWS account or equivalent cloud provider
- Stripe account (payment processing)
- SendGrid account (email)
- Twilio account (SMS)
- Domain name

---

## 🗄️ Database Setup

### Database Schema

```sql
-- Customers/Applicants Table
CREATE TABLE applicants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    nrc_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    physical_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- Next of Kin Table
CREATE TABLE next_of_kin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    applicant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Loan Applications Table
CREATE TABLE loan_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_reference VARCHAR(50) UNIQUE NOT NULL,
    applicant_id INT NOT NULL,
    loan_amount DECIMAL(10, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    repayment_term_days INT NOT NULL,
    total_repayment DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'paid', 'defaulted') DEFAULT 'pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approval_date TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    INDEX (status),
    INDEX (due_date)
);

-- Documents Table
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    document_type ENUM('nrc_front', 'nrc_back', 'photo') NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    UNIQUE KEY unique_document (application_id, document_type)
);

-- Payments Table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('card', 'mobile_money', 'bank_transfer') NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    INDEX (status)
);

-- Audit Log Table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id),
    INDEX (timestamp)
);

-- Admin Users Table
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator', 'viewer') DEFAULT 'viewer',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### MySQL Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE sekelela_loans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'sekelela'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON sekelela_loans.* TO 'sekelela'@'localhost';
FLUSH PRIVILEGES;

# Import schema
mysql -u sekelela -p sekelela_loans < schema.sql

# Verify
USE sekelela_loans;
SHOW TABLES;
```

---

## 🔌 API Development

### Express.js Backend Setup

#### 1. Initialize Project

```bash
mkdir sekelela-loans-api
cd sekelela-loans-api
npm init -y
npm install express dotenv cors mysql2 jsonwebtoken bcryptjs multer stripe sendgrid twilio joi
npm install -D nodemon
```

#### 2. Project Structure

```
sekelela-loans-api/
├── config/
│   └── database.js
├── controllers/
│   ├── applicationController.js
│   ├── authController.js
│   └── paymentController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── models/
│   ├── Application.js
│   └── User.js
├── routes/
│   ├── applications.js
│   ├── auth.js
│   └── payments.js
├── utils/
│   ├── emailService.js
│   ├── smsService.js
│   └── fileUpload.js
├── .env
├── .env.example
├── .gitignore
├── server.js
└── package.json
```

#### 3. Environment Configuration (.env)

```env
# Server
PORT=3001
NODE_ENV=production
API_URL=https://api.sekelela.zm

# Database
DB_HOST=localhost
DB_USER=sekelela
DB_PASSWORD=StrongPassword123!
DB_NAME=sekelela_loans
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=sekelela-loans-documents

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# SendGrid
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=support@sekelela.zm

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+260...

# Frontend
FRONTEND_URL=https://sekelela.zm
```

#### 4. Main Server File (server.js)

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later'
});
app.use('/api/', limiter);

// Routes
app.use('/api/applications', require('./routes/applications'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Sekelela Loans API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
```

---

## 🔐 Authentication & Authorization

### JWT Implementation

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
```

### Registration & Login Endpoints

```javascript
// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if user exists
        const [existingUser] = await db.query(
            'SELECT id FROM admin_users WHERE email = ? OR username = ?',
            [email, username]
        );
        
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        await db.query(
            'INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'viewer']
        );
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const [users] = await db.query(
            'SELECT id, username, email, password_hash, role FROM admin_users WHERE email = ? AND status = ?',
            [email, 'active']
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        
        // Update last login
        await db.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);
        
        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};
```

---

## 💳 Payment Integration

### Stripe Integration

```javascript
// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');

exports.createPaymentIntent = async (req, res) => {
    try {
        const { applicationId, amount } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd', // Change to appropriate currency
            metadata: {
                applicationId: applicationId.toString()
            }
        });
        
        res.json({
            clientSecret: paymentIntent.client_secret,
            publicKey: process.env.STRIPE_PUBLIC_KEY
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.handlePaymentWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const applicationId = paymentIntent.metadata.applicationId;
            
            // Update database
            await db.query(
                'INSERT INTO payments (application_id, amount, payment_method, transaction_id, status, payment_date) VALUES (?, ?, ?, ?, ?, NOW())',
                [applicationId, paymentIntent.amount / 100, 'card', paymentIntent.id, 'completed']
            );
            
            // Update application status
            await db.query(
                'UPDATE loan_applications SET status = ? WHERE id = ?',
                ['paid', applicationId]
            );
        }
        
        res.json({ received: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
```

---

## 📧 Email & SMS Notifications

### SendGrid Email Service

```javascript
// utils/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendApplicationConfirmation = async (email, referenceNumber, applicantName) => {
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Sekelela Loans - Application Received',
        html: `
            <h2>Application Received</h2>
            <p>Dear ${applicantName},</p>
            <p>Thank you for applying for a loan with Sekelela Loans.</p>
            <p><strong>Application Reference:</strong> ${referenceNumber}</p>
            <p>Your application is being reviewed. You will receive an update via email or SMS within 24 hours.</p>
            <p>If you have any questions, please contact us at support@sekelela.zm</p>
            <p>Best regards,<br>Sekelela Loans Team</p>
        `
    };
    
    try {
        await sgMail.send(msg);
        console.log('Confirmation email sent');
    } catch (error) {
        console.error('Email send failed:', error);
    }
};

exports.sendApplicationApproved = async (email, applicantName, loanAmount, repaymentDate) => {
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Sekelela Loans - Application Approved!',
        html: `
            <h2>Congratulations! Your Loan is Approved</h2>
            <p>Dear ${applicantName},</p>
            <p>Great news! Your loan application has been approved.</p>
            <p><strong>Loan Amount:</strong> ZMW ${loanAmount.toLocaleString()}</p>
            <p><strong>Repayment Date:</strong> ${repaymentDate}</p>
            <p>Funds will be transferred to your account within 24 hours.</p>
            <p>Best regards,<br>Sekelela Loans Team</p>
        `
    };
    
    try {
        await sgMail.send(msg);
        console.log('Approval email sent');
    } catch (error) {
        console.error('Email send failed:', error);
    }
};
```

### Twilio SMS Service

```javascript
// utils/smsService.js
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendApplicationSMS = async (phoneNumber, referenceNumber) => {
    try {
        await client.messages.create({
            body: `Sekelela Loans: Your application has been received. Reference: ${referenceNumber}. We will update you within 24 hours.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('SMS send failed:', error);
    }
};

exports.sendLoanApprovedSMS = async (phoneNumber, loanAmount) => {
    try {
        await client.messages.create({
            body: `Sekelela Loans: Congratulations! Your loan of ZMW ${loanAmount} has been approved. Funds will arrive within 24 hours.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('SMS send failed:', error);
    }
};
```

---

## 📊 Admin Dashboard

### API Endpoints for Admin Dashboard

```javascript
// routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const db = require('../config/database');

// Get dashboard statistics
router.get('/stats', authenticate, authorize('admin', 'moderator'), async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT
                COUNT(*) as total_applications,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_loans,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_applications,
                SUM(loan_amount) as total_loan_amount,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as completed_loans
            FROM loan_applications
        `);
        
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all applications
router.get('/applications', authenticate, authorize('admin', 'moderator'), async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT a.*, app.application_reference, app.status, app.loan_amount, app.due_date
            FROM applicants a
            LEFT JOIN loan_applications app ON a.id = app.applicant_id
        `;
        
        const params = [];
        if (status) {
            query += ' WHERE app.status = ?';
            params.push(status);
        }
        
        query += ` LIMIT ${limit} OFFSET ${offset}`;
        
        const [applications] = await db.query(query, params);
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve loan application
router.put('/applications/:id/approve', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query(
            'UPDATE loan_applications SET status = ?, approval_date = NOW() WHERE id = ?',
            ['approved', id]
        );
        
        // Log action
        await db.query(
            'INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
            [req.user.id, 'APPROVE_LOAN', 'loan_application', id]
        );
        
        res.json({ message: 'Application approved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reject loan application
router.put('/applications/:id/reject', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        await db.query(
            'UPDATE loan_applications SET status = ?, rejection_reason = ? WHERE id = ?',
            ['rejected', reason, id]
        );
        
        res.json({ message: 'Application rejected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## 🔒 Security Implementation

### Security Best Practices

1. **Input Validation & Sanitization**
```javascript
const Joi = require('joi');

const applicationSchema = Joi.object({
    firstName: Joi.string().alphanum().min(2).max(100).required(),
    lastName: Joi.string().alphanum().min(2).max(100).required(),
    nrcNumber: Joi.string().pattern(/^\d{6}\/\d{2}\/\d{1}$/).required(),
    mobileNumber: Joi.string().pattern(/^\+260\d{9}$/).required(),
    loanAmount: Joi.number().min(5).max(10000).required()
});

exports.validateApplication = (req, res, next) => {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};
```

2. **Rate Limiting & DDoS Protection**
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests'
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts
    skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', loginLimiter);
```

3. **SQL Injection Prevention**
```javascript
// Use prepared statements (parameterized queries)
const [result] = await db.query(
    'SELECT * FROM users WHERE email = ? AND status = ?',
    [email, 'active']
);
```

4. **XSS Prevention**
```javascript
const xss = require('xss');

exports.sanitizeInput = (req, res, next) => {
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = xss(req.body[key]);
        }
    }
    next();
};
```

---

## 🧪 Testing

### Unit Tests with Jest

```javascript
// __tests__/payment.test.js
const paymentController = require('../controllers/paymentController');

describe('Payment Controller', () => {
    test('should create payment intent', async () => {
        const req = {
            body: { applicationId: 1, amount: 1200 }
        };
        const res = {
            json: jest.fn()
        };
        
        await paymentController.createPaymentIntent(req, res);
        
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                clientSecret: expect.any(String)
            })
        );
    });
});
```

### API Testing with Postman

Create Postman collections for:
- Authentication endpoints
- Application endpoints
- Payment endpoints
- Admin endpoints

---

## 🚀 Production Deployment

### Docker Setup

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=sekelela
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=sekelela_loans
    depends_on:
      - mysql
    networks:
      - sekelela-network

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=sekelela_loans
      - MYSQL_USER=sekelela
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - sekelela-network

volumes:
  mysql_data:

networks:
  sekelela-network:
    driver: bridge
```

### Environment Variables for Production

```bash
# .env.production
NODE_ENV=production
PORT=3001
DB_HOST=prod-mysql.internal
DB_USER=sekelela_prod
DB_PASSWORD=very_strong_password_here
JWT_SECRET=very_long_random_secret_key_here
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG.prod_key...
TWILIO_ACCOUNT_SID=AC_prod...
```

---

## 📞 Support & Maintenance

### Monitoring & Logging
- Use tools like Datadog, New Relic, or Sentry
- Implement structured logging
- Monitor error rates and performance

### Regular Maintenance
- Security patches
- Dependency updates
- Database backups
- Log rotation

### Incident Response
- Documented procedures
- On-call rotation
- Post-mortem analysis

---

**Last Updated**: September 7, 2026  
**Version**: 1.0.0

For questions or support, contact: dev@sekelela.zm
