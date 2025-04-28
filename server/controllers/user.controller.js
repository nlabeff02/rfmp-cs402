// server/controllers/user.controller.js
const User = require('../models/user.model');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user by ID error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user (admin or user themselves)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, dietaryPreferences, allergies, role, isActive } = req.body;
    
    // Build user object
    const userFields = {};
    if (username) userFields.username = username;
    if (email) userFields.email = email;
    if (dietaryPreferences) userFields.dietaryPreferences = dietaryPreferences;
    if (allergies) userFields.allergies = allergies;
    
    // Admin-only fields
    if (req.user.role === 'admin') {
      if (role !== undefined) userFields.role = role;
      if (isActive !== undefined) userFields.isActive = isActive;
    }
    
    // Update user
    let user;
    
    if (req.user.role === 'admin' || req.user.userId === req.params.id) {
      user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: userFields },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      return res.json(user);
    } else {
      return res.status(403).json({ msg: 'Unauthorized to update this user' });
    }
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Toggle user active status (admin only)
exports.toggleUserStatus = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Toggle isActive status
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ id: user.id, isActive: user.isActive });
  } catch (err) {
    console.error('Toggle user status error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Set user role (admin only)
exports.setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }
    
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent admin from removing their own admin privileges
    if (req.user.userId === req.params.id && role !== 'admin') {
      return res.status(400).json({ msg: 'Admins cannot remove their own admin privileges' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ id: user.id, role: user.role });
  } catch (err) {
    console.error('Set user role error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};