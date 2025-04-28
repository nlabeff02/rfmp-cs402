// server/services/edamam.service.js
const axios = require('axios');

class EdamamService {
  constructor() {
    this.apiUrl = 'https://api.edamam.com/api/recipes/v2';
    this.appId = process.env.EDAMAM_APP_ID || 'your_app_id';
    this.appKey = process.env.EDAMAM_APP_KEY || 'your_app_key';
    this.type = 'public';
  }

  // Search for recipes based on query and filters
  async searchRecipes(query, filters = {}) {
    try {
      const params = {
        type: this.type,
        q: query,
        app_id: this.appId,
        app_key: this.appKey,
        ...filters
      };

      const response = await axios.get(this.apiUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  // Get a recipe by ID
  async getRecipeById(id) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`, {
        params: {
          type: this.type,
          app_id: this.appId,
          app_key: this.appKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recipe by ID:', error);
      throw error;
    }
  }

  // Get recipes by URI
  async getRecipesByUri(uris) {
    try {
      const response = await axios.get(`${this.apiUrl}/by-uri`, {
        params: {
          type: this.type,
          app_id: this.appId,
          app_key: this.appKey,
          uri: uris
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recipes by URI:', error);
      throw error;
    }
  }
}

module.exports = new EdamamService();