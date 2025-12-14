// Reset user account lockout
require("dotenv").config();

const { User } = require("./models");
const { logger } = require("./config/database");

async function resetLockout() {
  try {
    logger.info("🔓 Resetting user account lockouts...");

    // Reset lockout for all users
    const result = await User.update(
      {
        login_attempts: 0,
        locked_until: null,
      },
      {
        where: {},
      }
    );

    logger.info(`✅ Reset lockout for ${result[0]} users`);

    // List all users to verify
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "full_name",
        "login_attempts",
        "locked_until",
        "is_active",
      ],
    });

    logger.info("👥 Current user status:");
    users.forEach((user) => {
      logger.info(
        `  - ${user.username}: attempts=${user.login_attempts}, locked=${
          user.locked_until ? "YES" : "NO"
        }, active=${user.is_active}`
      );
    });

    logger.info("🎉 Account lockout reset completed!");
  } catch (error) {
    logger.error("❌ Failed to reset lockout:", error);
  } finally {
    process.exit(0);
  }
}

// Run the reset
resetLockout();
