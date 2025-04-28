// server/routes/recipe.routes.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const auth = require('../middleware/auth.middleware');

// @route   GET api/recipes/search
// @desc    Search recipes from Edamam API
// @access  Private
router.get('/search', auth, recipeController.searchRecipes);

// @route   GET api/recipes/:id
// @desc    Get recipe by ID
// @access  Private
router.get('/:id', auth, recipeController.getRecipeById);

// @route   POST api/recipes/save
// @desc    Save recipe to favorites
// @access  Private
router.post('/save', auth, recipeController.saveRecipe);

// @route   DELETE api/recipes/:id
// @desc    Remove recipe from favorites
// @access  Private
router.delete('/:id', auth, recipeController.unsaveRecipe);

// @route   GET api/recipes/user/saved
// @desc    Get user's saved recipes
// @access  Private
router.get('/user/saved', auth, recipeController.getSavedRecipes);

module.exports = router;