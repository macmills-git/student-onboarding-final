const { sequelize } = require("../config/database");
const User = require("./User");
const Student = require("./Student");
const Payment = require("./Payment");

// Define associations
User.hasMany(Student, {
  foreignKey: "registered_by",
  as: "registeredStudents",
});

Student.belongsTo(User, {
  foreignKey: "registered_by",
  as: "registeredBy",
});

Student.hasMany(Payment, {
  foreignKey: "student_id",
  as: "payments",
});

Payment.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});

User.hasMany(Payment, {
  foreignKey: "recorded_by",
  as: "recordedPayments",
});

Payment.belongsTo(User, {
  foreignKey: "recorded_by",
  as: "recordedBy",
});

module.exports = {
  sequelize,
  User,
  Student,
  Payment,
};
