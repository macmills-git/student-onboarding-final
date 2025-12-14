const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 20],
        isAlphanumeric: true,
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [5, 100],
      },
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [2, 50],
      },
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [10, 20],
      },
    },
    course: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    level: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [["100", "200", "300", "400", "Graduate", "Postgraduate"]],
      },
    },
    study_mode: {
      type: DataTypes.ENUM("regular", "distance", "sandwich"),
      allowNull: true,
      defaultValue: "regular",
    },
    residential_status: {
      type: DataTypes.ENUM("resident", "non-resident"),
      allowNull: true,
      defaultValue: "non-resident",
    },
    registered_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "students",
    indexes: [
      {
        fields: ["student_id"],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["course"],
      },
      {
        fields: ["level"],
      },
      {
        fields: ["registered_by"],
      },
    ],
  }
);

module.exports = Student;
