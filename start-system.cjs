#!/usr/bin/env node

const { spawn } = require("child_process");
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

async function startSystem() {
  log("🚀 Starting COMPSSA Student Management System...", "bold");
  log("", "reset");

  // Start backend
  log("📡 Starting backend server...", "yellow");
  const backend = spawn("npm", ["run", "dev"], {
    cwd: path.join(process.cwd(), "backend"),
    stdio: "pipe",
    shell: true,
  });

  backend.stdout.on("data", (data) => {
    const output = data.toString();
    if (output.includes("Server running on port")) {
      log(
        "✅ Backend server started successfully on http://localhost:5000",
        "green"
      );
    }
  });

  backend.stderr.on("data", (data) => {
    const error = data.toString();
    if (!error.includes("nodemon")) {
      log(`Backend error: ${error}`, "red");
    }
  });

  // Wait a moment for backend to start
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Start frontend
  log("🎨 Starting frontend application...", "yellow");
  const frontend = spawn("npm", ["run", "dev"], {
    cwd: process.cwd(),
    stdio: "pipe",
    shell: true,
  });

  frontend.stdout.on("data", (data) => {
    const output = data.toString();
    if (output.includes("Local:")) {
      log(
        "✅ Frontend application started successfully on http://localhost:5173",
        "green"
      );
      log("", "reset");
      log("🎉 System is ready!", "bold");
      log("", "reset");
      log("📋 Quick Start Guide:", "bold");
      log("1. Open your browser and go to: http://localhost:5173", "blue");
      log("2. Login with one of these accounts:", "blue");
      log("   • Admin: username=admin, password=Admin123!", "blue");
      log("   • Clerk: username=clerk, password=Clerk123!", "blue");
      log("3. Start managing students and payments!", "blue");
      log("", "reset");
      log("🔗 Useful URLs:", "bold");
      log("• Frontend: http://localhost:5173", "blue");
      log("• Backend API: http://localhost:5000/api", "blue");
      log("• Health Check: http://localhost:5000/api/health", "blue");
      log("", "reset");
      log("⚠️  To stop the system, press Ctrl+C", "yellow");
    }
  });

  frontend.stderr.on("data", (data) => {
    const error = data.toString();
    if (!error.includes("update-browserslist-db")) {
      log(`Frontend error: ${error}`, "red");
    }
  });

  // Handle process termination
  process.on("SIGINT", () => {
    log("\n🛑 Shutting down system...", "yellow");
    backend.kill();
    frontend.kill();
    log("✅ System stopped successfully", "green");
    process.exit(0);
  });

  // Keep the process alive
  process.stdin.resume();
}

// Start the system
startSystem().catch((error) => {
  log(`❌ Failed to start system: ${error.message}`, "red");
  process.exit(1);
});
