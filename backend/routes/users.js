const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock users data (to be replaced with database)
let mockUsers = [
  {
    id: '1',
    username: 'admin',
    full_name: 'System Administrator',
    role: 'admin',
    permissions: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    username: 'clerk',
    full_name: 'System Clerk',
    role: 'clerk',
    permissions: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// GET /api/users - Get all users (admin only)
router.get('/', (req, res) => {
  try {
    // TODO: Add authentication middleware to check if user is admin
    
    // Return users without passwords
    const usersWithoutPasswords = mockUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: usersWithoutPasswords,
      count: usersWithoutPasswords.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;

    // Basic validation
    if (!username || !password || !full_name || !role) {
      return res.status(400).json({ 
        error: 'Missing required fields: username, password, full_name, role' 
      });
    }

    // Check if username already exists
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      username,
      password: hashedPassword,
      full_name,
      role,
      permissions: {},
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...updateData } = req.body;

    // If password is being updated, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Return user without password
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    mockUsers.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;