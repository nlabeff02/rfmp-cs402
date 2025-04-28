// server/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../models/user.model');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ msg: 'User account is disabled' });
    }
    
    // Add user to request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;