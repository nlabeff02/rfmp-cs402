// server/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// @route   GET api/users
// @desc    Get all users
// @access  Admin
router.get('/', auth, checkRole('admin'), userController.getAllUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Admin
router.get('/:id', auth, checkRole('admin'), userController.getUserById);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', auth, userController.updateUser);

// @route   PATCH api/users/:id/status
// @desc    Toggle user active status
// @access  Admin
router.patch('/:id/status', auth, checkRole('admin'), userController.toggleUserStatus);

// @route   PATCH api/users/:id/role
// @desc    Set user role
// @access  Admin
router.patch('/:id/role', auth, checkRole('admin'), userController.setUserRole);

module.exports = router;