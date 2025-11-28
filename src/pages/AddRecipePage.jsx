import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Save } from 'lucide-react';
import { localApi, getRecipeDetails, updateRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const AddRecipePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [step, setStep] = useState(1);
    const [recipe, setRecipe] = useState({
        title: '',
        image: '',
        readyInMinutes: 30,
        servings: 2,
        ingredients: [],
        steps: []
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchRecipe = async () => {
                const data = await getRecipeDetails(id);
                if (data) {
                    // Extract ingredients from either format
                    let ingredients = data.ingredients || [];
                    if (data.extendedIngredients && data.extendedIngredients.length > 0) {
                        ingredients = data.extendedIngredients.map(ing =>
                            typeof ing === 'string' ? ing : ing.original || ing
                        );
                    }

                    // Extract steps from either format
                    let steps = data.steps || [];
                    if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
                        steps = data.analyzedInstructions[0].steps.map(s =>
                            typeof s === 'string' ? s : s.step || s
                        );
                    }

                    setRecipe({
                        id: data.id,
                        title: data.title || '',
                        image: data.image || '',
                        readyInMinutes: data.readyInMinutes || 30,
                        servings: data.servings || 2,
                        ingredients: ingredients,
                        steps: steps
                    });
                }
            };
            fetchRecipe();
        }
    }, [id, isEditMode]);

    const handleSave = async () => {
        try {
            // Create clean recipe object with only the fields we need
            const cleanRecipe = {
                title: recipe.title,
                image: recipe.image,
                readyInMinutes: recipe.readyInMinutes,
                servings: recipe.servings,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                userId: user.id
            };

            if (isEditMode) {
                await updateRecipe(recipe.id, cleanRecipe);
            } else {
                await localApi.post('/recipes', {
                    ...cleanRecipe,
                    id: Date.now() // Simple ID generation
                });
            }
            navigate('/cookbook');
        } catch (error) {
            console.error('Error saving recipe', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-serif font-bold dark:text-earth-50">
                    {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
                </h1>
                <div className="flex gap-2">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className={`w-3 h-3 rounded-full ${step >= s ? 'bg-earth-800' : 'bg-earth-200'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="glass-panel glass-panel-dark p-8">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-earth-100">Basic Info</h2>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-earth-300">Recipe Title</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-lg bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700"
                                value={recipe.title}
                                onChange={e => setRecipe({ ...recipe, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-earth-300">Image URL</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-lg bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700"
                                value={recipe.image}
                                onChange={e => setRecipe({ ...recipe, image: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2 dark:text-earth-300">Cook Time (mins)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 rounded-lg bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700"
                                    value={recipe.readyInMinutes}
                                    onChange={e => setRecipe({ ...recipe, readyInMinutes: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2 dark:text-earth-300">Servings</label>
                                <input
                                    type="number"
                                    className="w-full p-3 rounded-lg bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700"
                                    value={recipe.servings}
                                    onChange={e => setRecipe({ ...recipe, servings: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="btn-primary w-full">Next: Ingredients</button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-earth-100">Ingredients</h2>
                        <div className="space-y-3">
                            {recipe.ingredients.map((ing, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        className="flex-1 p-2 rounded bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700"
                                        value={ing}
                                        onChange={e => {
                                            const newIngs = [...recipe.ingredients];
                                            newIngs[i] = e.target.value;
                                            setRecipe({ ...recipe, ingredients: newIngs });
                                        }}
                                    />
                                    <button onClick={() => {
                                        const newIngs = recipe.ingredients.filter((_, idx) => idx !== i);
                                        setRecipe({ ...recipe, ingredients: newIngs });
                                    }} className="text-red-500"><Trash size={18} /></button>
                                </div>
                            ))}
                            <button
                                onClick={() => setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] })}
                                className="flex items-center gap-2 text-earth-600 hover:text-earth-800"
                            >
                                <Plus size={18} /> Add Ingredient
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                            <button onClick={() => setStep(3)} className="btn-primary flex-1">Next: Steps</button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-earth-100">Instructions</h2>
                        <div className="space-y-3">
                            {recipe.steps.map((step, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-bold text-earth-400 py-2">{i + 1}.</span>
                                    <textarea
                                        className="flex-1 p-2 rounded bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700"
                                        value={step}
                                        onChange={e => {
                                            const newSteps = [...recipe.steps];
                                            newSteps[i] = e.target.value;
                                            setRecipe({ ...recipe, steps: newSteps });
                                        }}
                                    />
                                    <button onClick={() => {
                                        const newSteps = recipe.steps.filter((_, idx) => idx !== i);
                                        setRecipe({ ...recipe, steps: newSteps });
                                    }} className="text-red-500"><Trash size={18} /></button>
                                </div>
                            ))}
                            <button
                                onClick={() => setRecipe({ ...recipe, steps: [...recipe.steps, ''] })}
                                className="flex items-center gap-2 text-earth-600 hover:text-earth-800"
                            >
                                <Plus size={18} /> Add Step
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <Save size={18} /> Save Recipe
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AddRecipePage;
