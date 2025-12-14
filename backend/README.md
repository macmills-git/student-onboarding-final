# Student Management System Backend

Production-ready backend API for the Student Management System built with Express.js, PostgreSQL/SQLite, and comprehensive security features.

## 🚀 Features

- **Authentication & Security**

  - JWT-based authentication with refresh tokens
  - Account lockout after failed login attempts
  - Rate limiting and request validation
  - Security headers with Helmet.js
  - Input sanitization and XSS protection

- **Database & Performance**

  - PostgreSQL for production, SQLite for development
  - Sequelize ORM with optimized queries
  - Database connection pooling
  - Automatic migrations and seeding

- **API Features**
  - RESTful API design
  - Role-based access control (Admin/Clerk)
  - Comprehensive input validation
  - Structured error handling
  - Request/response logging

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL 12+ (for production) OR SQLite (for development)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended for Production)

```bash
# Install PostgreSQL on your system
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS with Homebrew:
brew install postgresql

# Windows: Download from https://www.postgresql.org/download/windows/

# Create database
sudo -u postgres createdb student_management
```

#### Option B: SQLite (Easy for Development)

```bash
# No installation needed - SQLite file will be created automatically
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env .env.local

# Edit .env with your settings:
# - For PostgreSQL: Update DB_* variables
# - For SQLite: Set DB_DIALECT=sqlite
# - Change JWT secrets to secure random strings
```

### 4. Database Migration

```bash
# Run database migration (creates tables and default users)
npm run db:migrate
```

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔐 Default Users

After migration, these default users are created:

| Username | Password  | Role  |
| -------- | --------- | ----- |
| admin    | Admin123! | admin |
| clerk    | Clerk123! | clerk |

⚠️ **IMPORTANT**: Change default passwords immediately after first login!

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

```bash
POST /auth/login          # User login
POST /auth/refresh        # Refresh access token
POST /auth/logout         # User logout
GET  /auth/me            # Get current user info
```

### Student Management

```bash
GET    /students         # Get all students (with pagination)
POST   /students         # Create new student
GET    /students/:id     # Get student by ID
PUT    /students/:id     # Update student
DELETE /students/:id     # Delete student
```

### Payment Tracking

```bash
GET    /payments              # Get all payments
POST   /payments              # Record new payment
GET    /payments/:id          # Get payment by ID
GET    /payments/student/:id  # Get payments for student
```

### User Management (Admin Only)

```bash
GET    /users           # Get all users
POST   /users           # Create new user
GET    /users/:id       # Get user by ID
PUT    /users/:id       # Update user
DELETE /users/:id       # Delete user
```

### System

```bash
GET /health             # Health check endpoint
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Authentication Rate Limiting**: 5 login attempts per 15 minutes per IP
- **Account Lockout**: Account locked for 2 hours after 5 failed login attempts
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, and numbers
- **Input Validation**: Comprehensive validation for all endpoints
- **Security Headers**: Helmet.js for security headers
- **XSS Protection**: Input sanitization to prevent XSS attacks

## 🧪 Testing

```bash
# Test database connection
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

## 🚀 Production Deployment

1. **Environment Setup**

   - Set `NODE_ENV=production`
   - Use strong JWT secrets (32+ characters)
   - Configure PostgreSQL database
   - Set up reverse proxy (nginx)

2. **Security Checklist**
   - Change default passwords
   - Use HTTPS in production
   - Configure firewall rules
   - Set up database backups
   - Monitor logs for security events
