import axios from 'axios';

const SPOONACULAR_API_KEY = 'e583f54bad374eea9a169a538d1553e4';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const LOCAL_BASE_URL = 'http://localhost:3001';

export const spoonacularApi = axios.create({
  baseURL: SPOONACULAR_BASE_URL,
  params: {
    apiKey: SPOONACULAR_API_KEY,
  },
});

export const localApi = axios.create({
  baseURL: LOCAL_BASE_URL,
});

export const getTrendingRecipes = async () => {
  try {
    const response = await spoonacularApi.get('/random', {
      params: { number: 10 }
    });
    return response.data.recipes;
  } catch (error) {
    console.error("Error fetching trending recipes", error);
    return [];
  }
};

export const searchRecipes = async (query, filters = {}) => {
  try {
    const response = await spoonacularApi.get('/complexSearch', {
      params: {
        query,
        addRecipeInformation: true,
        number: 20,
        ...filters
      }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching recipes", error);
    return [];
  }
};

export const getRecipeDetails = async (id) => {
  try {
    // Try local first
    try {
      // Fetch all recipes to avoid type coercion issues with json-server query params
      const localResponse = await localApi.get('/recipes');
      const localRecipe = localResponse.data.find(r => String(r.id) === String(id));

      if (localRecipe) {
        const data = localRecipe;
        // Normalize local data to match Spoonacular format
        return {
          ...data,
          analyzedInstructions: [{
            steps: (data.steps || []).map((step, i) => ({
              number: i + 1,
              step: typeof step === 'string' ? step : step.step,
              ingredients: []
            }))
          }],
          extendedIngredients: (data.ingredients || []).map(ing => ({
            original: typeof ing === 'string' ? ing : ing.original
          })),
          summary: data.summary || "A delicious homemade recipe."
        };
      }
    } catch (e) {
      console.log("Local fetch failed, trying Spoonacular", e);
    }

    const response = await spoonacularApi.get(`/${id}/information`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe details", error);
    return null;
  }
};

export const getLocalRecipes = async () => {
  try {
    const response = await localApi.get('/recipes');
    return response.data;
  } catch (error) {
    console.error("Error fetching local recipes", error);
    return [];
  }
};

export const deleteRecipe = async (id) => {
  try {
    console.log(`[DELETE] Attempting to delete recipe with ID: ${id} (type: ${typeof id})`);

    // First delete any favorites associated with this recipe
    try {
      const favoritesResponse = await localApi.get(`/favorites?recipeId=${id}`);
      const favoritesToDelete = favoritesResponse.data;
      console.log(`[DELETE] Found ${favoritesToDelete.length} favorites to delete`);
      await Promise.all(favoritesToDelete.map(fav => localApi.delete(`/favorites/${fav.id}`)));
    } catch (e) {
      console.error("[DELETE] Error deleting associated favorites:", e.message);
    }

    // Then delete the recipe itself
    console.log(`[DELETE] Deleting recipe from /recipes/${id}`);
    const response = await localApi.delete(`/recipes/${id}`);
    console.log(`[DELETE] Successfully deleted recipe`, response.data);
    return true;
  } catch (error) {
    console.error("[DELETE] Error deleting recipe:", {
      id,
      idType: typeof id,
      url: `/recipes/${id}`,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // If recipe doesn't exist (404), treat it as successful deletion
    if (error.response?.status === 404) {
      console.log("[DELETE] Recipe already deleted (404), treating as success");
      return true;
    }

    return false;
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await localApi.put(`/recipes/${id}`, recipeData);
    return response.data;
  } catch (error) {
    console.error("Error updating recipe", error);
    return null;
  }
};

export const getFavorites = async (userId) => {
  try {
    const response = await localApi.get(`/favorites?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites", error);
    return [];
  }
};
