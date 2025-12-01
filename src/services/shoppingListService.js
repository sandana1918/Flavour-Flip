// Shopping List Service - manages ingredient check state and shopping list
const STORAGE_KEY = 'flavour-flip-shopping-list';

// Get checked state for a specific ingredient
export const getIngredientCheckState = (recipeId, ingredientIndex) => {
    const key = `recipe-${recipeId}-ingredient-${ingredientIndex}`;
    return localStorage.getItem(key) === 'true';
};

// Set checked state for a specific ingredient
export const setIngredientCheckState = (recipeId, ingredientIndex, checked) => {
    const key = `recipe-${recipeId}-ingredient-${ingredientIndex}`;
    if (checked) {
        localStorage.setItem(key, 'true');
    } else {
        localStorage.removeItem(key);
    }
    updateShoppingList();
};

// Get all shopping list data from localStorage
export const getShoppingListData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

// Save shopping list data to localStorage
export const saveShoppingListData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Add recipe ingredients to shopping list tracking
export const addRecipeToShoppingList = (recipeId, recipeTitle, ingredients) => {
    const shoppingList = getShoppingListData();
    shoppingList[recipeId] = {
        title: recipeTitle,
        ingredients: ingredients.map((ing, index) => ({
            name: ing.original || ing.name,
            checked: getIngredientCheckState(recipeId, index),
            index
        }))
    };
    saveShoppingListData(shoppingList);
};

// Get all ingredients across all recipes (checked and unchecked)
export const getShoppingListItems = () => {
    const shoppingList = getShoppingListData();
    const result = {};

    Object.keys(shoppingList).forEach(recipeId => {
        const recipe = shoppingList[recipeId];
        // Sync checked state
        const ingredients = recipe.ingredients.map(ing => ({
            ...ing,
            checked: getIngredientCheckState(recipeId, ing.index)
        }));

        if (ingredients.length > 0) {
            result[recipeId] = {
                title: recipe.title,
                ingredients: ingredients
            };
        }
    });

    return result;
};

// Get all unchecked ingredients across all recipes
export const getUncheckedIngredients = () => {
    const shoppingList = getShoppingListData();
    const unchecked = {};

    Object.keys(shoppingList).forEach(recipeId => {
        const recipe = shoppingList[recipeId];
        const uncheckedItems = recipe.ingredients.filter(ing => !ing.checked);

        if (uncheckedItems.length > 0) {
            unchecked[recipeId] = {
                title: recipe.title,
                ingredients: uncheckedItems
            };
        }
    });

    return unchecked;
};

// Update shopping list when ingredient state changes
const updateShoppingList = () => {
    const shoppingList = getShoppingListData();

    Object.keys(shoppingList).forEach(recipeId => {
        shoppingList[recipeId].ingredients = shoppingList[recipeId].ingredients.map(ing => ({
            ...ing,
            checked: getIngredientCheckState(recipeId, ing.index)
        }));
    });

    saveShoppingListData(shoppingList);
};

// Remove recipe from shopping list
export const removeRecipeFromShoppingList = (recipeId) => {
    const shoppingList = getShoppingListData();
    delete shoppingList[recipeId];
    saveShoppingListData(shoppingList);

    // Also clear localStorage keys for this recipe's ingredients
    const recipe = shoppingList[recipeId];
    if (recipe) {
        recipe.ingredients.forEach((_, index) => {
            localStorage.removeItem(`recipe-${recipeId}-ingredient-${index}`);
        });
    }
};

// Get count of unchecked items
export const getUncheckedCount = () => {
    const unchecked = getUncheckedIngredients();
    let count = 0;
    Object.values(unchecked).forEach(recipe => {
        count += recipe.ingredients.length;
    });
    return count;
};

// Clear all checked items from shopping list
export const clearCheckedItems = () => {
    updateShoppingList();
    const shoppingList = getShoppingListData();

    Object.keys(shoppingList).forEach(recipeId => {
        const recipe = shoppingList[recipeId];
        recipe.ingredients.forEach((ing) => {
            if (ing.checked) {
                localStorage.removeItem(`recipe-${recipeId}-ingredient-${ing.index}`);
            }
        });

        // Keep only unchecked items
        recipe.ingredients = recipe.ingredients.filter(ing => !ing.checked);

        // Remove recipe if no ingredients left
        if (recipe.ingredients.length === 0) {
            delete shoppingList[recipeId];
        }
    });

    saveShoppingListData(shoppingList);
};
