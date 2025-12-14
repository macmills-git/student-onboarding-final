const express = require("express");
const { Payment, Student } = require("../models");
const router = express.Router();

// GET /api/payments - Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name", "student_id"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Format the response to include student_name for compatibility
    const formattedPayments = payments.map((payment) => ({
      ...payment.toJSON(),
      student_name: payment.student?.name || "Unknown Student",
    }));

    res.json({
      success: true,
      data: formattedPayments,
      count: formattedPayments.length,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// GET /api/payments/:id - Get single payment
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name", "student_id"],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Format the response to include student_name for compatibility
    const formattedPayment = {
      ...payment.toJSON(),
      student_name: payment.student?.name || "Unknown Student",
    };

    res.json({
      success: true,
      data: formattedPayment,
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

// POST /api/payments - Create new payment
router.post("/", async (req, res) => {
  try {
    const { student_id, amount, payment_method, reference_id, operator } =
      req.body;

    // Basic validation
    if (!student_id || !amount || !payment_method || !reference_id) {
      return res.status(400).json({
        error:
          "Missing required fields: student_id, amount, payment_method, reference_id",
      });
    }

    // Validate amount
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive number",
      });
    }

    // Check if student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if reference_id already exists
    const existingPayment = await Payment.findOne({
      where: { reference_id },
    });

    if (existingPayment) {
      return res.status(409).json({ error: "Reference ID already exists" });
    }

    // Create new payment
    const newPayment = await Payment.create({
      student_id,
      amount: parseFloat(amount),
      payment_method,
      reference_id,
      operator: operator || null,
      recorded_by: req.user?.id || "1", // Get from JWT token or default to admin
      payment_date: new Date().toISOString(),
    });

    // Fetch the payment with student details
    const paymentWithStudent = await Payment.findByPk(newPayment.id, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name", "student_id"],
        },
      ],
    });

    // Format the response
    const formattedPayment = {
      ...paymentWithStudent.toJSON(),
      student_name: paymentWithStudent.student?.name || "Unknown Student",
    };

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: formattedPayment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

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

    res.status(500).json({ error: "Failed to record payment" });
  }
});

// PUT /api/payments/:id - Update payment
router.put("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // If updating student_id, check if student exists
    if (req.body.student_id && req.body.student_id !== payment.student_id) {
      const student = await Student.findByPk(req.body.student_id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
    }

    // If updating reference_id, check for duplicates
    if (
      req.body.reference_id &&
      req.body.reference_id !== payment.reference_id
    ) {
      const existingPayment = await Payment.findOne({
        where: { reference_id: req.body.reference_id },
      });

      if (existingPayment) {
        return res.status(409).json({ error: "Reference ID already exists" });
      }
    }

    // Validate amount if provided
    if (
      req.body.amount &&
      (isNaN(req.body.amount) || parseFloat(req.body.amount) <= 0)
    ) {
      return res.status(400).json({
        error: "Amount must be a positive number",
      });
    }

    // Update payment
    await payment.update(req.body);

    // Fetch updated payment with student details
    const updatedPayment = await Payment.findByPk(payment.id, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name", "student_id"],
        },
      ],
    });

    // Format the response
    const formattedPayment = {
      ...updatedPayment.toJSON(),
      student_name: updatedPayment.student?.name || "Unknown Student",
    };

    res.json({
      success: true,
      message: "Payment updated successfully",
      data: formattedPayment,
    });
  } catch (error) {
    console.error("Update payment error:", error);

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

    res.status(500).json({ error: "Failed to update payment" });
  }
});

// DELETE /api/payments/:id - Delete payment
router.delete("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    await payment.destroy();

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

module.exports = router;
