// server/controllers/mealplan.controller.js
const MealPlan = require('../models/mealplan.model');
const Recipe = require('../models/recipe.model');

// Create a meal plan
exports.createMealPlan = async (req, res) => {
  try {
    const { startDate, endDate, days } = req.body;
    
    if (!startDate || !endDate || !days) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    
    // Create new meal plan
    const mealPlan = new MealPlan({
      user: req.user.userId,
      startDate,
      endDate,
      days
    });
    
    await mealPlan.save();
    
    // Populate recipe details
    const populatedMealPlan = await MealPlan.findById(mealPlan._id)
      .populate('days.meals.recipe');
    
    res.status(201).json(populatedMealPlan);
  } catch (err) {
    console.error('Create meal plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's current meal plan
exports.getCurrentMealPlan = async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Find meal plan that includes current date
    const mealPlan = await MealPlan.findOne({
      user: req.user.userId,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).populate('days.meals.recipe');
    
    if (!mealPlan) {
      return res.status(404).json({ msg: 'No active meal plan found' });
    }
    
    res.json(mealPlan);
  } catch (err) {
    console.error('Get current meal plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all meal plans for a user
exports.getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.userId })
      .sort({ startDate: -1 })
      .populate('days.meals.recipe');
    
    res.json(mealPlans);
  } catch (err) {
    console.error('Get all meal plans error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get meal plan by ID
exports.getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate('days.meals.recipe');
    
    if (!mealPlan) {
      return res.status(404).json({ msg: 'Meal plan not found' });
    }
    
    // Check if meal plan belongs to user
    if (mealPlan.user.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Not authorized to access this meal plan' });
    }
    
    res.json(mealPlan);
  } catch (err) {
    console.error('Get meal plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update meal plan
exports.updateMealPlan = async (req, res) => {
  try {
    const { startDate, endDate, days } = req.body;
    
    // Find meal plan
    let mealPlan = await MealPlan.findById(req.params.id);
    
    if (!mealPlan) {
      return res.status(404).json({ msg: 'Meal plan not found' });
    }
    
    // Check if meal plan belongs to user
    if (mealPlan.user.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Not authorized to update this meal plan' });
    }
    
    // Update fields
    if (startDate) mealPlan.startDate = startDate;
    if (endDate) mealPlan.endDate = endDate;
    if (days) mealPlan.days = days;
    
    mealPlan.updatedAt = Date.now();
    
    await mealPlan.save();
    
    // Populate recipe details
    const updatedMealPlan = await MealPlan.findById(mealPlan._id)
      .populate('days.meals.recipe');
    
    res.json(updatedMealPlan);
  } catch (err) {
    console.error('Update meal plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete meal plan
exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    
    if (!mealPlan) {
      return res.status(404).json({ msg: 'Meal plan not found' });
    }
    
    // Check if meal plan belongs to user
    if (mealPlan.user.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Not authorized to delete this meal plan' });
    }
    
    await mealPlan.remove();
    
    res.json({ msg: 'Meal plan removed' });
  } catch (err) {
    console.error('Delete meal plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};