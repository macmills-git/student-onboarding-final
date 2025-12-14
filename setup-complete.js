#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 COMPSSA Student Management System - Complete Setup\n");

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    log(`Running: ${command}`, "blue");
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch (error) {
    log(`Error running command: ${command}`, "red");
    log(error.message, "red");
    return false;
  }
}

function checkFile(filePath) {
  return fs.existsSync(filePath);
}

async function setupProject() {
  try {
    log("📋 Step 1: Checking project structure...", "yellow");

    // Check if we're in the right directory
    if (!checkFile("package.json") || !checkFile("backend/package.json")) {
      log("❌ Please run this script from the project root directory", "red");
      process.exit(1);
    }

    log("✅ Project structure looks good", "green");

    log("\n📦 Step 2: Installing frontend dependencies...", "yellow");
    if (!runCommand("npm install")) {
      log("❌ Failed to install frontend dependencies", "red");
      process.exit(1);
    }
    log("✅ Frontend dependencies installed", "green");

    log("\n📦 Step 3: Installing backend dependencies...", "yellow");
    if (!runCommand("npm install", "./backend")) {
      log("❌ Failed to install backend dependencies", "red");
      process.exit(1);
    }
    log("✅ Backend dependencies installed", "green");

    log("\n🔧 Step 4: Setting up environment files...", "yellow");

    // Check backend .env
    if (!checkFile("backend/.env")) {
      log("⚠️  Backend .env file not found, creating default...", "yellow");
      const defaultEnv = `# Database Configuration
DB_TYPE=sqlite
DB_PATH=./database.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Security Configuration
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=15
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100`;

      fs.writeFileSync("backend/.env", defaultEnv);
      log("✅ Backend .env file created", "green");
    } else {
      log("✅ Backend .env file exists", "green");
    }

    log("\n🗄️  Step 5: Setting up database...", "yellow");
    if (!runCommand("node scripts/migrate.js", "./backend")) {
      log("⚠️  Database migration failed, but continuing...", "yellow");
    } else {
      log("✅ Database setup completed", "green");
    }

    log("\n🎉 Setup completed successfully!", "green");
    log("\n📋 Next steps:", "bold");
    log("1. Start the backend server:", "blue");
    log("   cd backend && npm run dev", "blue");
    log("\n2. In a new terminal, start the frontend:", "blue");
    log("   npm run dev", "blue");
    log("\n3. Open your browser and go to:", "blue");
    log("   http://localhost:5173", "blue");
    log("\n4. Login with default credentials:", "blue");
    log("   Username: admin, Password: admin123", "blue");
    log("   Username: clerk, Password: clerk123", "blue");

    log("\n🔗 Useful URLs:", "bold");
    log("- Frontend: http://localhost:5173", "blue");
    log("- Backend API: http://localhost:5000/api", "blue");
    log("- Health Check: http://localhost:5000/api/health", "blue");

    log("\n📚 Documentation:", "bold");
    log("- README.md - General project information", "blue");
    log("- backend/README.md - Backend API documentation", "blue");
    log("- SETUP_INSTRUCTIONS.md - Detailed setup guide", "blue");
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, "red");
    log("\n🔧 Troubleshooting:", "yellow");
    log(
      "1. Make sure you have Node.js installed (version 16 or higher)",
      "blue"
    );
    log("2. Make sure you have npm installed", "blue");
    log("3. Check that you have write permissions in this directory", "blue");
    log("4. Try running the setup steps manually", "blue");
    process.exit(1);
  }
}

// Run setup
setupProject();
