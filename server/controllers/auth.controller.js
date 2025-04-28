// server/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, dietaryPreferences, allergies } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      dietaryPreferences,
      allergies
    });

    // Save user to database
    await user.save();

    // Create JWT token
    const payload = {
      userId: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ msg: 'Account is disabled' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      userId: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};