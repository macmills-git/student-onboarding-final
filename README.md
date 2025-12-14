# COMPSSA Student Management System

A comprehensive, production-ready student management system built with React, TypeScript, Node.js, and Express. Features secure authentication, student registration, payment tracking, and analytics dashboard.

## 🌟 Features

### Frontend (React + TypeScript)

- **Modern UI/UX**: Clean, responsive design with dark mode support
- **Role-based Access**: Different interfaces for Admin and Clerk users
- **Student Management**: Register, view, edit, and manage student records
- **Payment Tracking**: Record and monitor student payments with multiple methods
- **Analytics Dashboard**: Real-time insights and performance metrics
- **User Management**: Admin can manage system users and permissions
- **Export Functionality**: Export data to CSV and PDF formats

### Backend (Node.js + Express)

- **Secure Authentication**: JWT-based auth with refresh tokens
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive data validation and sanitization
- **Database Support**: SQLite (development) and PostgreSQL (production)
- **API Documentation**: RESTful API with comprehensive endpoints
- **Error Handling**: Structured error responses and logging
- **Security Headers**: CORS, helmet, and other security middleware

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Git

### Automated Setup

```bash
# Clone the repository
git clone <repository-url>
cd project

# Run the automated setup script
node setup-complete.js
```

### Manual Setup

1. **Install Dependencies**

   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

2. **Environment Configuration**

   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env

   # Edit backend/.env with your configuration
   ```

3. **Database Setup**

   ```bash
   cd backend
   node scripts/migrate.js
   cd ..
   ```

4. **Start the Application**

   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev

   # Terminal 2: Start frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 🔐 Default Login Credentials

| Role  | Username | Password |
| ----- | -------- | -------- |
| Admin | admin    | admin123 |
| Clerk | clerk    | clerk123 |

## 📁 Project Structure

```
project/
├── src/                          # Frontend source code
│   ├── components/              # Reusable React components
│   ├── contexts/               # React contexts (Auth, Theme)
│   ├── pages/                  # Page components
│   ├── lib/                    # Utilities and API services
│   └── assets/                 # Static assets
├── backend/                     # Backend source code
│   ├── config/                 # Database and app configuration
│   ├── middleware/             # Express middleware
│   ├── models/                 # Database models
│   ├── routes/                 # API route handlers
│   └── scripts/                # Database and setup scripts
├── public/                     # Static files
└── docs/                       # Documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
# Database
DB_TYPE=sqlite                  # sqlite or postgres
DB_PATH=./database.sqlite      # SQLite path
DB_HOST=localhost              # PostgreSQL host
DB_PORT=5432                   # PostgreSQL port
DB_NAME=compssa_db             # Database name
DB_USER=username               # Database user
DB_PASS=password               # Database password

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=15
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Payments

- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record new payment
- `GET /api/payments/:id` - Get payment by ID
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Users (Admin only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics

- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/users` - User performance data
- `GET /api/analytics/students` - Student statistics

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Sanitizes and validates all inputs
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Password Hashing**: bcrypt for secure password storage
- **Account Lockout**: Temporary lockout after failed attempts

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Animations**: Smooth transitions and loading states
- **Accessibility**: WCAG compliant design
- **Export Options**: CSV and PDF export functionality
- **Real-time Updates**: Live data updates and notifications

## 🧪 Testing

```bash
# Test backend connection
node test-connection.js

# Run frontend tests (if available)
npm test

# Run backend tests (if available)
cd backend
npm test
```

## 📈 Performance

- **Optimized Builds**: Vite for fast development and production builds
- **Code Splitting**: Lazy loading for better performance
- **Caching**: Efficient caching strategies
- **Database Optimization**: Indexed queries and connection pooling

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)

```bash
cd backend
# Set environment variables
# Deploy with your preferred platform
```

### Database (Production)

- Configure PostgreSQL connection in backend/.env
- Run migrations: `node scripts/migrate.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and request features via GitHub issues
- **Email**: Contact the development team for support

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added analytics dashboard and export features
- **v1.2.0** - Enhanced security and performance improvements

## 🙏 Acknowledgments

- React and TypeScript communities
- Express.js and Node.js ecosystems
- Tailwind CSS for styling
- Lucide React for icons
- All contributors and testers

---

**Built with ❤️ for COMPSSA - University of Ghana**
