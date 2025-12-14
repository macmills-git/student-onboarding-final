const express = require("express");
const { Student } = require("../models");
const router = express.Router();

// GET /api/students - Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// GET /api/students/:id - Get single student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// POST /api/students - Create new student
router.post("/", async (req, res) => {
  try {
    const {
      student_id,
      name,
      email,
      gender,
      nationality,
      phone_number,
      course,
      level,
      study_mode,
      residential_status,
    } = req.body;

    // Basic validation
    if (!student_id || !name || !email || !course || !level) {
      return res.status(400).json({
        error:
          "Missing required fields: student_id, name, email, course, level",
      });
    }

    // Check if student_id already exists
    const existingStudent = await Student.findOne({
      where: { student_id },
    });

    if (existingStudent) {
      return res.status(409).json({ error: "Student ID already exists" });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Create new student
    const newStudent = await Student.create({
      student_id,
      name,
      email,
      gender,
      nationality,
      phone_number,
      course,
      level,
      study_mode,
      residential_status,
      registered_by: req.user?.id || "1", // Get from JWT token or default to admin
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (error) {
    console.error("Create student error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Duplicate entry",
        field: error.errors[0]?.path,
      });
    }

    res.status(500).json({ error: "Failed to create student" });
  }
});

// PUT /api/students/:id - Update student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // If updating student_id or email, check for duplicates
    if (req.body.student_id && req.body.student_id !== student.student_id) {
      const existingStudent = await Student.findOne({
        where: { student_id: req.body.student_id },
      });

      if (existingStudent) {
        return res.status(409).json({ error: "Student ID already exists" });
      }
    }

    if (req.body.email && req.body.email !== student.email) {
      const existingEmail = await Student.findOne({
        where: { email: req.body.email },
      });

      if (existingEmail) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    // Update student
    await student.update(req.body);

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    res.status(500).json({ error: "Failed to update student" });
  }
});

// DELETE /api/students/:id - Delete student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.destroy();

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

module.exports = router;
