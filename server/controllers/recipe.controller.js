// server/controllers/recipe.controller.js
const Recipe = require('../models/recipe.model');
const edamamService = require('../services/edamam.service');

// Search recipes from Edamam API
exports.searchRecipes = async (req, res) => {
  try {
    const { query, ...filters } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }
    
    const results = await edamamService.searchRecipes(query, filters);
    res.json(results);
  } catch (err) {
    console.error('Search recipes error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    // Try to find recipe in our database first
    let recipe = await Recipe.findOne({ edamamId: req.params.id });
    
    if (!recipe) {
      // If not in database, fetch from API
      const apiResult = await edamamService.getRecipeById(req.params.id);
      
      if (!apiResult || !apiResult.recipe) {
        return res.status(404).json({ msg: 'Recipe not found' });
      }
      
      // Return the recipe from API
      return res.json(apiResult);
    }
    
    // Return the recipe from database
    res.json(recipe);
  } catch (err) {
    console.error('Get recipe error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Save recipe to user's favorites
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeData } = req.body;
    
    if (!recipeData || !recipeData.uri) {
      return res.status(400).json({ msg: 'Recipe data is required' });
    }
    
    // Extract ID from URI
    const edamamId = recipeData.uri.split('#recipe_')[1];
    
    // Check if recipe already exists in database
    let recipe = await Recipe.findOne({ edamamId });
    
    if (!recipe) {
      // Create new recipe if not exists
      recipe = new Recipe({
        edamamId,
        label: recipeData.label,
        image: recipeData.image,
        source: recipeData.source,
        url: recipeData.url,
        yield: recipeData.yield,
        calories: recipeData.calories,
        totalTime: recipeData.totalTime,
        ingredientLines: recipeData.ingredientLines,
        dietLabels: recipeData.dietLabels,
        healthLabels: recipeData.healthLabels,
        cautions: recipeData.cautions,
        nutrients: recipeData.totalNutrients,
        cuisineType: recipeData.cuisineType,
        mealType: recipeData.mealType,
        dishType: recipeData.dishType,
        savedBy: [req.user.userId]
      });
      
      await recipe.save();
    } else {
      // Add user to savedBy if not already there
      if (!recipe.savedBy.includes(req.user.userId)) {
        recipe.savedBy.push(req.user.userId);
        await recipe.save();
      }
    }
    
    res.json(recipe);
  } catch (err) {
    console.error('Save recipe error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Unsave recipe from user's favorites
exports.unsaveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ edamamId: req.params.id });
    
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    
    // Remove user from savedBy
    recipe.savedBy = recipe.savedBy.filter(
      userId => userId.toString() !== req.user.userId
    );
    
    await recipe.save();
    
    res.json({ msg: 'Recipe removed from favorites' });
  } catch (err) {
    console.error('Unsave recipe error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's saved recipes
exports.getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ savedBy: req.user.userId });
    res.json(recipes);
  } catch (err) {
    console.error('Get saved recipes error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};