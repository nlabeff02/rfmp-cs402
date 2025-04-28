// server/middleware/role.middleware.js
const User = require('../models/user.model');

// Role-based authorization middleware
const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      if (user.role !== role) {
        return res.status(403).json({ msg: 'Access denied, insufficient privileges' });
      }
      
      next();
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };
};

module.exports = {
  checkRole
};