// server/routes/mealplan.routes.js
const express = require('express');
const router = express.Router();
const mealplanController = require('../controllers/mealplan.controller');
const auth = require('../middleware/auth.middleware');

// @route   POST api/mealplans
// @desc    Create a meal plan
// @access  Private
router.post('/', auth, mealplanController.createMealPlan);

// @route   GET api/mealplans/current
// @desc    Get current meal plan
// @access  Private
router.get('/current', auth, mealplanController.getCurrentMealPlan);

// @route   GET api/mealplans
// @desc    Get all meal plans for a user
// @access  Private
router.get('/', auth, mealplanController.getAllMealPlans);

// @route   GET api/mealplans/:id
// @desc    Get meal plan by ID
// @access  Private
router.get('/:id', auth, mealplanController.getMealPlanById);

// @route   PUT api/mealplans/:id
// @desc    Update meal plan
// @access  Private
router.put('/:id', auth, mealplanController.updateMealPlan);

// @route   DELETE api/mealplans/:id
// @desc    Delete meal plan
// @access  Private
router.delete('/:id', auth, mealplanController.deleteMealPlan);

module.exports = router;