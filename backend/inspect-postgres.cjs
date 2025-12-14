// PostgreSQL database inspection script
require("dotenv").config();

const { sequelize } = require("./models");
const { User, Student, Payment } = require("./models");

async function inspectPostgreSQL() {
  console.log("🐘 PostgreSQL Database Inspection Report\n");

  try {
    // Test connection
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection: SUCCESSFUL");
    console.log(`📁 Database type: ${sequelize.getDialect()}`);
    console.log(`🏠 Host: ${sequelize.config.host}:${sequelize.config.port}`);
    console.log(`📊 Database: ${sequelize.config.database}\n`);

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
      attributes: [
        "id",
        "student_id",
        "name",
        "course",
        "level",
        "study_mode",
        "created_at",
      ],
    });

    if (students.length === 0) {
      console.log("  ⚠️  No students found");
    } else {
      console.log(`  📈 Total students: ${students.length}`);
      students.forEach((student) => {
        console.log(
          `  - ID: ${student.student_id}, Name: ${student.name}, Course: ${student.course}, Level: ${student.level}, Mode: ${student.study_mode}`
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
        "reference_id",
        "created_at",
      ],
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name"],
        },
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
          `  - ${payment.student?.name || "Unknown"}: GH₵ ${
            payment.amount
          } via ${payment.payment_method} (${payment.reference_id})`
        );
      });
      if (payments.length > 5) {
        console.log(`  ... and ${payments.length - 5} more payments`);
      }
    }
    console.log("");

    // Course distribution
    console.log("📚 Course Distribution:");
    const courseStats = await sequelize.query(
      "SELECT course, COUNT(*) as count FROM students GROUP BY course ORDER BY count DESC",
      { type: sequelize.QueryTypes.SELECT }
    );
    courseStats.forEach((stat) => {
      console.log(`  - ${stat.course}: ${stat.count} students`);
    });
    console.log("");

    // Payment method distribution
    console.log("💳 Payment Method Distribution:");
    const paymentStats = await sequelize.query(
      "SELECT payment_method, COUNT(*) as count, SUM(amount) as total FROM payments GROUP BY payment_method ORDER BY total DESC",
      { type: sequelize.QueryTypes.SELECT }
    );
    paymentStats.forEach((stat) => {
      console.log(
        `  - ${stat.payment_method}: ${stat.count} payments, GH₵ ${parseFloat(
          stat.total
        ).toLocaleString()}`
      );
    });
    console.log("");

    // Database statistics
    console.log("📊 Database Statistics:");
    console.log(
      `  - Total records: ${users.length + students.length + payments.length}`
    );
    console.log(
      `  - Database version: PostgreSQL ${await getPostgreSQLVersion()}`
    );
    console.log(
      `  - Connection pool: ${
        sequelize.config.pool?.max || "default"
      } max connections`
    );
    console.log(`  - Last updated: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("❌ PostgreSQL inspection failed:", error.message);
  } finally {
    await sequelize.close();
  }
}

async function getPostgreSQLVersion() {
  try {
    const result = await sequelize.query("SELECT version()", {
      type: sequelize.QueryTypes.SELECT,
    });
    return result[0].version.split(" ")[1];
  } catch (error) {
    return "Unknown";
  }
}

// Run inspection
inspectPostgreSQL();
