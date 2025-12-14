#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

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

function runCommand(command, options = {}) {
  try {
    log(`Running: ${command}`, "blue");
    const result = execSync(command, {
      encoding: "utf8",
      stdio: options.silent ? "pipe" : "inherit",
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

async function setupPostgreSQL() {
  log("🐘 PostgreSQL Setup for COMPSSA Student Management System\n", "bold");

  try {
    // Check if PostgreSQL is installed
    log("1. Checking PostgreSQL installation...", "yellow");
    const pgCheck = runCommand("psql --version", { silent: true });

    if (!pgCheck.success) {
      log("❌ PostgreSQL is not installed or not in PATH", "red");
      log("\n📥 Please install PostgreSQL first:", "yellow");
      log("1. Download from: https://www.postgresql.org/download/", "blue");
      log("2. Or use package manager:", "blue");
      log("   - Windows: winget install PostgreSQL.PostgreSQL", "blue");
      log("   - macOS: brew install postgresql", "blue");
      log(
        "   - Ubuntu: sudo apt install postgresql postgresql-contrib",
        "blue"
      );
      log(
        "\n⚠️  After installation, restart your terminal and run this script again.",
        "yellow"
      );
      return;
    }

    log("✅ PostgreSQL is installed", "green");
    log(`   Version: ${pgCheck.output.trim()}`, "blue");

    // Check if PostgreSQL service is running
    log("\n2. Checking PostgreSQL service...", "yellow");
    const serviceCheck = runCommand("pg_isready -h localhost -p 5432", {
      silent: true,
    });

    if (!serviceCheck.success) {
      log("⚠️  PostgreSQL service is not running", "yellow");
      log("\n🔧 Please start PostgreSQL service:", "yellow");
      log("- Windows: net start postgresql-x64-14 (or similar)", "blue");
      log("- macOS: brew services start postgresql", "blue");
      log("- Ubuntu: sudo systemctl start postgresql", "blue");
      log("\n💡 Or start it manually and run this script again.", "blue");
      return;
    }

    log("✅ PostgreSQL service is running", "green");

    // Create database
    log("\n3. Creating database...", "yellow");
    const createDbCommand =
      "createdb -h localhost -p 5432 -U postgres compssa_db";
    const createDb = runCommand(createDbCommand, { silent: true });

    if (createDb.success) {
      log('✅ Database "compssa_db" created successfully', "green");
    } else if (createDb.error.includes("already exists")) {
      log('✅ Database "compssa_db" already exists', "green");
    } else {
      log("⚠️  Could not create database automatically", "yellow");
      log("Please create the database manually:", "blue");
      log("1. Open PostgreSQL command line (psql)", "blue");
      log("2. Run: CREATE DATABASE compssa_db;", "blue");
      log("3. Run: \\q to exit", "blue");
    }

    // Test connection
    log("\n4. Testing database connection...", "yellow");
    const testConnection = runCommand(
      'psql -h localhost -p 5432 -U postgres -d compssa_db -c "SELECT version();"',
      { silent: true }
    );

    if (testConnection.success) {
      log("✅ Database connection successful", "green");
    } else {
      log("❌ Database connection failed", "red");
      log("Please check your PostgreSQL credentials in backend/.env", "yellow");
      return;
    }

    // Update package.json with PostgreSQL setup script
    log("\n5. Updating package.json...", "yellow");
    const packageJsonPath = "./backend/package.json";
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      if (!packageJson.scripts["setup:postgres"]) {
        packageJson.scripts["setup:postgres"] =
          "node scripts/migrate.js && node scripts/seed-data.cjs";
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        log("✅ Added PostgreSQL setup script to package.json", "green");
      }
    }

    log("\n🎉 PostgreSQL setup completed successfully!", "green");
    log("\n📋 Next steps:", "bold");
    log("1. The backend/.env file has been updated for PostgreSQL", "blue");
    log("2. Run the migration to create tables:", "blue");
    log("   cd backend && node scripts/migrate.js", "blue");
    log("3. Run the seeding to add sample data:", "blue");
    log("   cd backend && node scripts/seed-data.cjs", "blue");
    log("4. Restart your backend server:", "blue");
    log("   cd backend && npm run dev", "blue");

    log("\n🔗 Database Connection Details:", "bold");
    log("- Host: localhost", "blue");
    log("- Port: 5432", "blue");
    log("- Database: compssa_db", "blue");
    log("- User: postgres", "blue");
    log("- Password: postgres (change in .env if different)", "blue");
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, "red");
    log("\n🔧 Troubleshooting:", "yellow");
    log("1. Make sure PostgreSQL is installed and running", "blue");
    log(
      "2. Check if the postgres user exists and has the right password",
      "blue"
    );
    log("3. Verify PostgreSQL is listening on localhost:5432", "blue");
    log("4. Try connecting manually: psql -h localhost -U postgres", "blue");
  }
}

// Run setup
setupPostgreSQL();
