const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validateLogin } = require("../middleware/validation");
const { authLimiter } = require("../middleware/security");
const { authenticateToken } = require("../middleware/auth");
const { logger } = require("../config/database");

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// POST /api/auth/login
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in database
    const user = await User.findOne({
      where: {
        username: username.toLowerCase(),
        is_active: true,
      },
    });

    if (!user) {
      logger.warn(
        `Login attempt with invalid username: ${username} from IP: ${req.ip}`
      );
      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      logger.warn(
        `Login attempt on locked account: ${username} from IP: ${req.ip}`
      );
      return res.status(401).json({
        error:
          "Account is temporarily locked due to too many failed login attempts",
        code: "ACCOUNT_LOCKED",
      });
    }

    // Verify password
    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      logger.warn(
        `Failed login attempt for user: ${username} from IP: ${req.ip}`
      );

      // Increment login attempts
      await user.incrementLoginAttempts();

      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    logger.info(`Successful login for user: ${username} from IP: ${req.ip}`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: user.toJSON(),
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      code: "LOGIN_ERROR",
    });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        error: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    // Get user from database
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: "Invalid refresh token - user not found or inactive",
        code: "USER_NOT_FOUND",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.json({
      success: true,
      data: {
        accessToken,
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      },
    });
  } catch (error) {
    logger.error("Token refresh error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        error: "Invalid or expired refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    res.status(500).json({
      error: "Token refresh failed",
      code: "REFRESH_ERROR",
    });
  }
});

// POST /api/auth/logout
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // In a production app, you might want to:
    // 1. Blacklist the token
    // 2. Clear refresh tokens from database
    // 3. Log the logout event

    logger.info(`User logged out: ${req.user.username} from IP: ${req.ip}`);

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      code: "LOGOUT_ERROR",
    });
  }
});

// GET /api/auth/me - Get current user info
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    logger.error("Get user info error:", error);
    res.status(500).json({
      error: "Failed to get user information",
      code: "USER_INFO_ERROR",
    });
  }
});

module.exports = router;
