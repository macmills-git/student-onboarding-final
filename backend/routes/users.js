const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get("/", async (req, res) => {
  try {
    // TODO: Add authentication middleware to check if user is admin

    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Don't return passwords
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // Don't return password
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/users - Create new user (admin only)
router.post("/", async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;

    // Basic validation
    if (!username || !password || !full_name || !role) {
      return res.status(400).json({
        error: "Missing required fields: username, password, full_name, role",
      });
    }

    // Validate role
    if (!["admin", "clerk"].includes(role)) {
      return res.status(400).json({
        error: "Role must be either 'admin' or 'clerk'",
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Create new user (password will be hashed by the model hook)
    const newUser = await User.create({
      username,
      password,
      full_name,
      role,
      permissions: role === "admin" ? {} : { register: true, view: true },
      is_active: true,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Create user error:", error);

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
        error: "Username already exists",
      });
    }

    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /api/users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...updateData } = req.body;

    // If password is being updated, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // If updating username, check for duplicates
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findOne({
        where: { username: updateData.username },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
    }

    // Validate role if provided
    if (updateData.role && !["admin", "clerk"].includes(updateData.role)) {
      return res.status(400).json({
        error: "Role must be either 'admin' or 'clerk'",
      });
    }

    // Update user
    await user.update(updateData);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update user error:", error);

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

    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /api/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deletion of the last admin user
    if (user.role === "admin") {
      const adminCount = await User.count({
        where: { role: "admin", is_active: true },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          error: "Cannot delete the last active admin user",
        });
      }
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
