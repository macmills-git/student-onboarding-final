#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Setting up Student Management System Backend...\n");

// Check if .env exists
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.log("❌ .env file not found!");
  console.log("📝 Please create a .env file with the following content:\n");

  const envTemplate = `# Backend Environment Variables
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration - Choose one:

# Option 1: SQLite (Easy for development)
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# Option 2: PostgreSQL (Recommended for production)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=student_management
# DB_USER=postgres
# DB_PASSWORD=your_db_password
# DB_DIALECT=postgres

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info`;

  fs.writeFileSync(envPath, envTemplate);
  console.log("✅ Created .env file with default configuration");
  console.log("⚠️  Please update the JWT secrets and database settings!\n");
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, "..", "node_modules");
if (!fs.existsSync(nodeModulesPath)) {
  console.log("📦 Installing dependencies...");
  try {
    execSync("npm install", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
    console.log("✅ Dependencies installed successfully\n");
  } catch (error) {
    console.log("❌ Failed to install dependencies");
    console.log("Please run: npm install\n");
  }
}

console.log("🎯 Next Steps:");
console.log("1. Update .env file with your database settings");
console.log("2. Run: npm run db:migrate (to create database tables)");
console.log("3. Run: npm run dev (to start development server)");
console.log("4. Test: http://localhost:5000/api/health\n");

console.log("🔐 Default Login Credentials:");
console.log("Admin - Username: admin, Password: Admin123!");
console.log("Clerk - Username: clerk, Password: Clerk123!");
console.log("⚠️  Change these passwords after first login!\n");

console.log("✅ Setup completed! Happy coding! 🎉");
