const express = require("express");
const { Student, Payment, User } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

// GET /api/analytics/dashboard - Get dashboard statistics
router.get("/dashboard", async (req, res) => {
  try {
    // Get total counts
    const totalStudents = await Student.count();
    const totalPayments = (await Payment.sum("amount")) || 0;
    const activeUsers = await User.count({ where: { is_active: true } });

    // Calculate today's stats
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayPayments = await Payment.findAll({
      where: {
        created_at: {
          [Op.gte]: todayStart,
        },
      },
    });

    const todayRevenue = todayPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount),
      0
    );

    const todayStudents = await Student.count({
      where: {
        created_at: {
          [Op.gte]: todayStart,
        },
      },
    });

    // Calculate weekly stats
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekPayments = await Payment.findAll({
      where: {
        created_at: {
          [Op.gte]: weekStart,
        },
      },
    });

    const weekRevenue = weekPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount),
      0
    );

    const weekStudents = await Student.count({
      where: {
        created_at: {
          [Op.gte]: weekStart,
        },
      },
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalRevenue: totalPayments,
        activeUsers,
        todayStats: {
          students: todayStudents,
          revenue: todayRevenue,
          payments: todayPayments.length,
        },
        weekStats: {
          students: weekStudents,
          revenue: weekRevenue,
          payments: weekPayments.length,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard analytics" });
  }
});

// GET /api/analytics/users - Get user performance analytics
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_active: true },
    });

    const userAnalytics = await Promise.all(
      users.map(async (user) => {
        // Calculate user-specific stats
        const userPayments = await Payment.findAll({
          where: { recorded_by: user.id },
        });

        const userStudents = await Student.findAll({
          where: { registered_by: user.id },
        });

        const today = new Date();
        const todayStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayPayments = userPayments.filter(
          (payment) => new Date(payment.created_at) >= todayStart
        );

        const todayStudents = userStudents.filter(
          (student) => new Date(student.created_at) >= todayStart
        );

        const weekStudents = userStudents.filter(
          (student) => new Date(student.created_at) >= weekStart
        );

        return {
          user_id: user.id,
          full_name: user.full_name,
          role: user.role,
          totalRevenue: userPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount),
            0
          ),
          totalStudents: userStudents.length,
          registeredToday: todayStudents.length,
          revenueToday: todayPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount),
            0
          ),
          registeredThisWeek: weekStudents.length,
        };
      })
    );

    res.json({
      success: true,
      data: userAnalytics,
    });
  } catch (error) {
    console.error("User analytics error:", error);
    res.status(500).json({ error: "Failed to fetch user analytics" });
  }
});

// GET /api/analytics/students - Get student statistics
router.get("/students", async (req, res) => {
  try {
    const totalStudents = await Student.count();

    // Course distribution
    const courseStats = {};
    const courseData = await Student.findAll({
      attributes: ["course"],
      group: ["course"],
      raw: true,
    });

    for (const item of courseData) {
      const count = await Student.count({ where: { course: item.course } });
      courseStats[item.course] = count;
    }

    // Level distribution
    const levelStats = {};
    const levelData = await Student.findAll({
      attributes: ["level"],
      group: ["level"],
      raw: true,
    });

    for (const item of levelData) {
      const count = await Student.count({ where: { level: item.level } });
      levelStats[item.level] = count;
    }

    // Study mode distribution
    const studyModeStats = {};
    const studyModeData = await Student.findAll({
      attributes: ["study_mode"],
      group: ["study_mode"],
      raw: true,
    });

    for (const item of studyModeData) {
      const count = await Student.count({
        where: { study_mode: item.study_mode },
      });
      studyModeStats[item.study_mode] = count;
    }

    // Recent registrations
    const recentStudents = await Student.findAll({
      order: [["created_at", "DESC"]],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        courseStats,
        levelStats,
        studyModeStats,
        recentStudents,
      },
    });
  } catch (error) {
    console.error("Student analytics error:", error);
    res.status(500).json({ error: "Failed to fetch student analytics" });
  }
});

module.exports = router;
