#!/usr/bin/env node

const readline = require("readline");
const { execSync } = require("child_process");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupPostgreSQL() {
  log("🐘 PostgreSQL Quick Setup for COMPSSA\n", "bold");

  try {
    log("We need to set up your PostgreSQL connection.", "blue");
    log("PostgreSQL is installed and running on your system.\n", "green");

    // Ask for password
    const password = await askQuestion(
      "Enter your PostgreSQL postgres user password (or press Enter if no password): "
    );

    // Update .env file
    const envPath = "./backend/.env";
    let envContent = fs.readFileSync(envPath, "utf8");

    // Update the password line
    envContent = envContent.replace(
      /DB_PASSWORD=.*/,
      `DB_PASSWORD=${password}`
    );

    fs.writeFileSync(envPath, envContent);
    log("✅ Updated .env file with PostgreSQL password", "green");

    // Test connection
    log("\n🔍 Testing PostgreSQL connection...", "yellow");

    try {
      process.env.PGPASSWORD = password;

      // Try to create database
      try {
        execSync(`createdb -h localhost -p 5432 -U postgres compssa_db`, {
          stdio: "pipe",
          env: { ...process.env, PGPASSWORD: password },
        });
        log('✅ Database "compssa_db" created successfully', "green");
      } catch (error) {
        if (error.message.includes("already exists")) {
          log('✅ Database "compssa_db" already exists', "green");
        } else {
          log("⚠️  Could not create database automatically", "yellow");
          log("You may need to create it manually", "blue");
        }
      }

      // Test connection to database
      execSync(
        `psql -h localhost -p 5432 -U postgres -d compssa_db -c "SELECT 'Connection successful!' as status;"`,
        {
          stdio: "pipe",
          env: { ...process.env, PGPASSWORD: password },
        }
      );

      log("✅ PostgreSQL connection successful!", "green");

      log("\n🚀 Ready to migrate data!", "bold");
      log("Next steps:", "blue");
      log("1. Run migration: cd backend && node scripts/migrate.js", "blue");
      log(
        "2. Add sample data: cd backend && node scripts/seed-data.cjs",
        "blue"
      );
      log("3. Start backend: cd backend && npm run dev", "blue");
    } catch (error) {
      log("❌ Connection failed", "red");
      log("Please check your password and try again", "yellow");
      log("\nAlternatively, you can:", "blue");
      log("1. Open PostgreSQL command line: psql -U postgres", "blue");
      log("2. Create database: CREATE DATABASE compssa_db;", "blue");
      log(
        "3. Set password: ALTER USER postgres PASSWORD 'your_password';",
        "blue"
      );
    }
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, "red");
  } finally {
    rl.close();
  }
}

// Run setup
setupPostgreSQL();
