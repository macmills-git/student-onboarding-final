# Student Management System - Backend API

## Overview

Express.js backend API for the Student Management System with authentication, student management, payment tracking, and user management.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Payments

- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Record new payment
- `GET /api/payments/student/:studentId` - Get payments for specific student

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check

- `GET /api/health` - API health status

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration (add your database details)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=student_management
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
```

## Default Users

The system comes with two default users:

- **Admin**: username: `admin`, password: `admin123`
- **Clerk**: username: `clerk`, password: `clerk123`

## Data Models

### Student

```javascript
{
  id: string,
  student_id: string,
  name: string,
  email: string,
  gender: string,
  nationality: string,
  phone_number: string,
  course: string,
  level: string,
  study_mode: 'regular' | 'distance' | 'city_campus',
  residential_status: 'resident' | 'non_resident',
  registered_by: string,
  created_at: string,
  updated_at: string
}
```

### Payment

```javascript
{
  id: string,
  student_id: string,
  student_name: string,
  amount: number,
  payment_method: 'cash' | 'momo' | 'bank',
  reference_id: string,
  operator: string,
  recorded_by: string,
  payment_date: string,
  created_at: string
}
```

### User

```javascript
{
  id: string,
  username: string,
  full_name: string,
  role: 'admin' | 'clerk',
  permissions: object,
  is_active: boolean,
  created_at: string,
  updated_at: string
}
```

## Current Implementation

- ✅ Express.js server setup
- ✅ CORS configuration for frontend
- ✅ Basic authentication with JWT
- ✅ Mock data for all entities
- ✅ All CRUD operations
- ✅ Error handling
- ✅ Input validation

## TODO for Backend Developer

1. **Database Integration**

   - Set up PostgreSQL/MySQL database
   - Create database schema and tables
   - Replace mock data with database queries
   - Add database connection and ORM (Sequelize/Prisma)

2. **Authentication & Security**

   - Add JWT middleware for protected routes
   - Implement role-based access control
   - Add rate limiting
   - Add input sanitization

3. **Advanced Features**

   - Add pagination for large datasets
   - Implement search and filtering
   - Add file upload for student photos
   - Add audit logging
   - Add email notifications

4. **Testing**

   - Add unit tests
   - Add integration tests
   - Add API documentation (Swagger)

5. **Production Setup**
   - Add proper logging
   - Add monitoring
   - Add deployment configuration
   - Add database migrations

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Get students
curl http://localhost:5000/api/students
```

## Frontend Integration

Update the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Then replace the mock data calls in the frontend with actual API calls to these endpoints.
