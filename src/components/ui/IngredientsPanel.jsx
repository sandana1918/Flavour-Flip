import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { getIngredientCheckState, setIngredientCheckState, addRecipeToShoppingList } from '../../services/shoppingListService';

const IngredientsPanel = ({ recipe }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [checkedState, setCheckedState] = useState({});

    useEffect(() => {
        if (recipe?.extendedIngredients) {
            // Initialize checked state from localStorage
            const initialState = {};
            recipe.extendedIngredients.forEach((_, index) => {
                initialState[index] = getIngredientCheckState(recipe.id, index);
            });
            setCheckedState(initialState);

            // Add recipe to shopping list tracking
            addRecipeToShoppingList(recipe.id, recipe.title, recipe.extendedIngredients);
        }
    }, [recipe]);

    const handleToggle = (index) => {
        const newChecked = !checkedState[index];
        setCheckedState(prev => ({ ...prev, [index]: newChecked }));
        setIngredientCheckState(recipe.id, index, newChecked);
    };

    if (!recipe?.extendedIngredients) return null;

    const uncheckedCount = Object.values(checkedState).filter(checked => !checked).length;

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-earth-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-earth-200 dark:border-earth-700"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-earth-100 dark:bg-earth-700 rounded-lg">
                        <ShoppingCart size={20} className="text-earth-600 dark:text-earth-300" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-earth-900 dark:text-earth-100">Ingredients</h3>
                        <p className="text-sm text-earth-600 dark:text-earth-400">
                            {uncheckedCount} item{uncheckedCount !== 1 ? 's' : ''} needed
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-earth-500 dark:text-earth-400">
                        {isOpen ? 'Hide' : 'Show'}
                    </span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 p-5 bg-white dark:bg-earth-800 rounded-xl shadow-md border border-earth-200 dark:border-earth-700">
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {recipe.extendedIngredients.map((ingredient, index) => (
                                    <label
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-earth-50 dark:hover:bg-earth-700/50 cursor-pointer transition-colors group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checkedState[index] || false}
                                            onChange={() => handleToggle(index)}
                                            className="mt-1 w-5 h-5 rounded border-2 border-earth-300 text-earth-700 focus:ring-2 focus:ring-earth-500 cursor-pointer"
                                        />
                                        <span
                                            className={`text-sm flex-1 transition-all ${checkedState[index]
                                                    ? 'line-through text-earth-400 dark:text-earth-500'
                                                    : 'text-earth-700 dark:text-earth-300'
                                                }`}
                                        >
                                            {ingredient.original}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {uncheckedCount > 0 && (
                                <div className="mt-4 pt-4 border-t border-earth-200 dark:border-earth-700">
                                    <p className="text-xs text-earth-500 dark:text-earth-400 text-center">
                                        💡 Unchecked items are automatically added to your Shopping List
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IngredientsPanel;
