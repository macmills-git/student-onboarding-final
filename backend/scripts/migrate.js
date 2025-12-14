// Load environment variables first
require("dotenv").config();

const { sequelize, User } = require("../models");
const { logger } = require("../config/database");
const bcrypt = require("bcryptjs");

const migrate = async () => {
  try {
    logger.info("🔄 Starting database migration...");

    // Sync all models (create tables)
    await sequelize.sync({ force: false, alter: true });
    logger.info("✅ Database tables synchronized");

    // Check if admin user exists
    const adminExists = await User.findOne({ where: { username: "admin" } });

    if (!adminExists) {
      // Create default admin user
      const adminUser = await User.create({
        username: "admin",
        password: "Admin123!", // Will be hashed by the model hook
        full_name: "System Administrator",
        role: "admin",
        is_active: true,
      });

      logger.info("✅ Default admin user created");
      logger.info("   Username: admin");
      logger.info("   Password: Admin123!");
      logger.info(
        "   ⚠️  Please change the default password after first login!"
      );
    }

    // Check if clerk user exists
    const clerkExists = await User.findOne({ where: { username: "clerk" } });

    if (!clerkExists) {
      // Create default clerk user
      const clerkUser = await User.create({
        username: "clerk",
        password: "Clerk123!", // Will be hashed by the model hook
        full_name: "System Clerk",
        role: "clerk",
        is_active: true,
      });

      logger.info("✅ Default clerk user created");
      logger.info("   Username: clerk");
      logger.info("   Password: Clerk123!");
      logger.info(
        "   ⚠️  Please change the default password after first login!"
      );
    }

    logger.info("🎉 Migration completed successfully!");
  } catch (error) {
    logger.error("❌ Migration failed:", error);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = migrate;
