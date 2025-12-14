const { body, param, query, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Login validation
const validateLogin = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// Student validation
const validateStudent = [
  body("student_id")
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Student ID must be between 8 and 20 characters")
    .isAlphanumeric()
    .withMessage("Student ID must contain only letters and numbers"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name must contain only letters, spaces, hyphens, and apostrophes"
    ),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
  body("nationality")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nationality must be between 2 and 50 characters"),
  body("phone_number")
    .optional()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{10,20}$/)
    .withMessage("Phone number must be valid (10-20 digits)"),
  body("course")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Course must be between 2 and 100 characters"),
  body("level")
    .isIn(["100", "200", "300", "400", "Graduate", "Postgraduate"])
    .withMessage("Level must be 100, 200, 300, 400, Graduate, or Postgraduate"),
  body("study_mode")
    .optional()
    .isIn(["regular", "distance", "sandwich"])
    .withMessage("Study mode must be regular, distance, or sandwich"),
  body("residential_status")
    .optional()
    .isIn(["resident", "non-resident"])
    .withMessage("Residential status must be resident or non-resident"),
  handleValidationErrors,
];

// Payment validation
const validatePayment = [
  body("student_id")
    .isInt({ min: 1 })
    .withMessage("Student ID must be a positive integer"),
  body("amount")
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage("Amount must be between 0.01 and 999,999.99"),
  body("payment_method")
    .isIn(["cash", "momo", "bank_transfer", "card", "cheque"])
    .withMessage(
      "Payment method must be cash, momo, bank_transfer, card, or cheque"
    ),
  body("reference_id")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Reference ID must be between 1 and 100 characters"),
  body("operator")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Operator must be between 1 and 50 characters"),
  body("payment_date")
    .optional()
    .isISO8601()
    .withMessage("Payment date must be a valid ISO 8601 date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must not exceed 1000 characters"),
  handleValidationErrors,
];

// User validation
const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body("full_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Full name must contain only letters, spaces, hyphens, and apostrophes"
    ),
  body("role")
    .isIn(["admin", "clerk"])
    .withMessage("Role must be admin or clerk"),
  handleValidationErrors,
];

// ID parameter validation
const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sort")
    .optional()
    .matches(/^[a-zA-Z_]+:(asc|desc)$/)
    .withMessage('Sort must be in format "field:asc" or "field:desc"'),
  handleValidationErrors,
];

module.exports = {
  validateLogin,
  validateStudent,
  validatePayment,
  validateUser,
  validateId,
  validatePagination,
  handleValidationErrors,
};
