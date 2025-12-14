// Database inspection script
require("dotenv").config({ path: "./backend/.env" });

const { sequelize } = require("./backend/models");
const { User, Student, Payment } = require("./backend/models");

async function inspectDatabase() {
  console.log("🔍 Database Inspection Report\n");

  try {
    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection: SUCCESSFUL");
    console.log(`📁 Database type: ${sequelize.getDialect()}`);
    console.log(`📍 Database location: ${sequelize.config.storage || "N/A"}\n`);

    // Check tables
    console.log("📊 Database Tables:");
    const tables = await sequelize.getQueryInterface().showAllTables();
    tables.forEach((table) => console.log(`  - ${table}`));
    console.log("");

    // Check Users table
    console.log("👥 Users Table:");
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "full_name",
        "role",
        "is_active",
        "created_at",
      ],
    });

    if (users.length === 0) {
      console.log("  ⚠️  No users found");
    } else {
      console.log(`  📈 Total users: ${users.length}`);
      users.forEach((user) => {
        console.log(
          `  - ID: ${user.id}, Username: ${user.username}, Name: ${user.full_name}, Role: ${user.role}, Active: ${user.is_active}`
        );
      });
    }
    console.log("");

    // Check Students table
    console.log("🎓 Students Table:");
    const students = await Student.findAll({
      attributes: ["id", "student_id", "name", "course", "level", "created_at"],
    });

    if (students.length === 0) {
      console.log("  ⚠️  No students found");
    } else {
      console.log(`  📈 Total students: ${students.length}`);
      students.forEach((student) => {
        console.log(
          `  - ID: ${student.student_id}, Name: ${student.name}, Course: ${student.course}, Level: ${student.level}`
        );
      });
    }
    console.log("");

    // Check Payments table
    console.log("💰 Payments Table:");
    const payments = await Payment.findAll({
      attributes: [
        "id",
        "student_id",
        "amount",
        "payment_method",
        "created_at",
      ],
    });

    if (payments.length === 0) {
      console.log("  ⚠️  No payments found");
    } else {
      console.log(`  📈 Total payments: ${payments.length}`);
      const totalAmount = payments.reduce(
        (sum, payment) => sum + parseFloat(payment.amount),
        0
      );
      console.log(`  💵 Total amount: GH₵ ${totalAmount.toLocaleString()}`);
      payments.slice(0, 5).forEach((payment) => {
        console.log(
          `  - Student: ${payment.student_id}, Amount: GH₵ ${payment.amount}, Method: ${payment.payment_method}`
        );
      });
      if (payments.length > 5) {
        console.log(`  ... and ${payments.length - 5} more payments`);
      }
    }
    console.log("");

    // Database statistics
    console.log("📊 Database Statistics:");
    console.log(`  - Database size: ${await getDatabaseSize()}`);
    console.log(
      `  - Total records: ${users.length + students.length + payments.length}`
    );
    console.log(`  - Last updated: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("❌ Database inspection failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

async function getDatabaseSize() {
  try {
    const fs = require("fs");
    const path = require("path");
    const dbPath = path.join(__dirname, "backend", "database.sqlite");

    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      const sizeInBytes = stats.size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      return `${sizeInKB} KB`;
    }
    return "Unknown";
  } catch (error) {
    return "Error calculating size";
  }
}

// Run inspection
inspectDatabase();
