const { Sequelize } = require("sequelize");
const winston = require("winston");

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

let sequelize;

if (process.env.DB_DIALECT === "sqlite") {
  // SQLite configuration for development
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    logging:
      process.env.NODE_ENV === "development"
        ? (msg) => logger.debug(msg)
        : false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  });
} else {
  // PostgreSQL configuration for production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging:
        process.env.NODE_ENV === "development"
          ? (msg) => logger.debug(msg)
          : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully");
    return true;
  } catch (error) {
    logger.error("❌ Unable to connect to database:", error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  logger,
};
