#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, "green");
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, "red");
  }
  return exists;
}

function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  if (exists) {
    log(`✅ ${description}`, "green");
  } else {
    log(`❌ ${description} - Missing: ${dirPath}`, "red");
  }
  return exists;
}

async function verifySetup() {
  log("🔍 COMPSSA Student Management System - Setup Verification\n", "bold");

  let allGood = true;

  // Check project structure
  log("📁 Checking project structure...", "yellow");
  allGood &= checkFile("package.json", "Frontend package.json");
  allGood &= checkFile("backend/package.json", "Backend package.json");
  allGood &= checkDirectory("src", "Frontend source directory");
  allGood &= checkDirectory("backend", "Backend directory");

  // Check key files
  log("\n📄 Checking key files...", "yellow");
  allGood &= checkFile("src/App.tsx", "Main App component");
  allGood &= checkFile("src/main.tsx", "Main entry point");
  allGood &= checkFile("src/lib/api.ts", "API service layer");
  allGood &= checkFile("backend/server.js", "Backend server");
  allGood &= checkFile("backend/.env", "Backend environment file");

  // Check page components
  log("\n📱 Checking page components...", "yellow");
  allGood &= checkFile("src/pages/HomePage.tsx", "Home page");
  allGood &= checkFile("src/pages/LoginPage.tsx", "Login page");
  allGood &= checkFile("src/pages/DashboardPage.tsx", "Dashboard page");
  allGood &= checkFile("src/pages/StudentsPage.tsx", "Students page");
  allGood &= checkFile("src/pages/RegisterPage.tsx", "Register page");
  allGood &= checkFile("src/pages/PaymentsPage.tsx", "Payments page");
  allGood &= checkFile("src/pages/UsersPage.tsx", "Users page");

  // Check backend routes
  log("\n🛣️  Checking backend routes...", "yellow");
  allGood &= checkFile("backend/routes/auth.js", "Authentication routes");
  allGood &= checkFile("backend/routes/students.js", "Students routes");
  allGood &= checkFile("backend/routes/payments.js", "Payments routes");
  allGood &= checkFile("backend/routes/users.js", "Users routes");
  allGood &= checkFile("backend/routes/analytics.js", "Analytics routes");

  // Final result
  log("\n" + "=".repeat(50), "blue");
  if (allGood) {
    log("🎉 VERIFICATION PASSED! All components are in place.", "green");
    log("\n✅ Your COMPSSA Student Management System is ready!", "green");
    log("\n🚀 Next steps:", "bold");
    log("1. Start backend: cd backend && npm run dev", "blue");
    log("2. Start frontend: npm run dev", "blue");
    log("3. Open http://localhost:5173", "blue");
    log("4. Login with admin/admin123 or clerk/clerk123", "blue");
  } else {
    log("❌ VERIFICATION FAILED! Some components are missing.", "red");
  }
  log("=".repeat(50), "blue");
}

// Run verification
verifySetup().catch((error) => {
  log(`\n❌ Verification failed: ${error.message}`, "red");
  process.exit(1);
});
