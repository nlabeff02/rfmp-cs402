// server/models/recipe.model.js
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  edamamId: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  source: {
    type: String
  },
  url: {
    type: String
  },
  yield: {
    type: Number
  },
  calories: {
    type: Number
  },
  totalTime: {
    type: Number
  },
  ingredientLines: {
    type: [String],
    required: true
  },
  dietLabels: {
    type: [String]
  },
  healthLabels: {
    type: [String]
  },
  cautions: {
    type: [String]
  },
  nutrients: {
    type: Object
  },
  cuisineType: {
    type: [String]
  },
  mealType: {
    type: [String]
  },
  dishType: {
    type: [String]
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);