const express = require("express");
const router = express.Router();

// GET /api/health - Health check endpoint
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
      },
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      error: "Health check failed",
    });
  }
});

module.exports = router;
