import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUncheckedIngredients, setIngredientCheckState, clearCheckedItems } from '../services/shoppingListService';

const ShoppingListPage = () => {
    const [shoppingList, setShoppingList] = useState({});

    useEffect(() => {
        loadShoppingList();
    }, []); // Only load on mount

    const loadShoppingList = () => {
        // Load ONLY unchecked ingredients initially
        const unchecked = getUncheckedIngredients();
        setShoppingList(unchecked);
    };

    const handleToggleIngredient = (recipeId, ingredientIndex, currentChecked) => {
        // 1. Update localStorage/Service
        setIngredientCheckState(recipeId, ingredientIndex, !currentChecked);

        // 2. Update local state to reflect change without reloading from source
        // This keeps the item visible (but crossed out) until page reload
        setShoppingList(prev => {
            const newState = { ...prev };
            if (newState[recipeId]) {
                newState[recipeId] = {
                    ...newState[recipeId],
                    ingredients: newState[recipeId].ingredients.map(ing =>
                        ing.index === ingredientIndex
                            ? { ...ing, checked: !currentChecked }
                            : ing
                    )
                };
            }
            return newState;
        });
    };

    const handleClearChecked = () => {
        if (window.confirm('Remove all checked items from your shopping list?')) {
            clearCheckedItems();
            // Reload to remove cleared items
            loadShoppingList();
        }
    };

    const getTotalItems = () => {
        return Object.values(shoppingList).reduce((total, recipe) => {
            // Count only unchecked items for the "to buy" count
            return total + recipe.ingredients.filter(i => !i.checked).length;
        }, 0);
    };

    const isEmpty = Object.keys(shoppingList).length === 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-earth-100 dark:bg-earth-800 rounded-xl">
                            <ShoppingCart size={32} className="text-earth-600 dark:text-earth-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-earth-900 dark:text-earth-100">
                                Shopping List
                            </h1>
                            <p className="text-earth-600 dark:text-earth-400">
                                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} to buy
                            </p>
                        </div>
                    </div>

                    {!isEmpty && (
                        <button
                            onClick={handleClearChecked}
                            className="flex items-center gap-2 px-4 py-2 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 rounded-lg hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors"
                        >
                            <Trash2 size={18} />
                            Clear Checked
                        </button>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {isEmpty ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="w-24 h-24 bg-earth-100 dark:bg-earth-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-earth-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-earth-900 dark:text-earth-100 mb-3">
                        Your shopping list is empty!
                    </h2>
                    <p className="text-earth-600 dark:text-earth-400 mb-8">
                        Open a recipe and uncheck ingredients to add them here.
                    </p>
                    <Link to="/discover">
                        <button className="btn-primary">
                            Discover Recipes
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(shoppingList).map(([recipeId, recipe]) => (
                        <motion.div
                            key={recipeId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-earth-800 rounded-xl shadow-md border border-earth-200 dark:border-earth-700 overflow-hidden"
                        >
                            {/* Recipe Header */}
                            <div className="p-5 bg-earth-50 dark:bg-earth-900/50 border-b border-earth-200 dark:border-earth-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-earth-900 dark:text-earth-100">
                                        {recipe.title}
                                    </h3>
                                    <Link to={`/recipe/${recipeId}`}>
                                        <button className="flex items-center gap-1 text-sm text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 transition-colors">
                                            View Recipe
                                            <ChevronRight size={16} />
                                        </button>
                                    </Link>
                                </div>
                                <p className="text-sm text-earth-600 dark:text-earth-400 mt-1">
                                    {recipe.ingredients.filter(i => !i.checked).length} ingredient{recipe.ingredients.filter(i => !i.checked).length !== 1 ? 's' : ''} needed
                                </p>
                            </div>

                            {/* Ingredients List */}
                            <div className="p-5">
                                <div className="space-y-2">
                                    {recipe.ingredients.map((ingredient) => (
                                        <label
                                            key={ingredient.index}
                                            className={`flex items-start gap-3 p-3 rounded-lg hover:bg-earth-50 dark:hover:bg-earth-700/50 cursor-pointer transition-colors ${ingredient.checked ? 'opacity-50' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={ingredient.checked || false}
                                                onChange={() => handleToggleIngredient(recipeId, ingredient.index, ingredient.checked)}
                                                className="mt-1 w-5 h-5 rounded border-2 border-earth-300 text-earth-700 focus:ring-2 focus:ring-earth-500 cursor-pointer"
                                            />
                                            <span className={`text-sm flex-1 transition-all ${ingredient.checked ? 'line-through text-earth-400 dark:text-earth-500' : 'text-earth-700 dark:text-earth-300'}`}>
                                                {ingredient.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tip */}
            {!isEmpty && (
                <div className="mt-8 p-4 bg-earth-100 dark:bg-earth-800 rounded-xl border border-earth-200 dark:border-earth-700">
                    <p className="text-sm text-earth-600 dark:text-earth-400 text-center">
                        💡 <strong>Tip:</strong> Check off items as you add them to your cart. Checked items can be cleared using the button above.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShoppingListPage;
