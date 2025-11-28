import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { localApi, deleteRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Grid, Edit, Trash, RefreshCw } from 'lucide-react';

const CookbookPage = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [view, setView] = useState('shelf'); // 'grid' or 'shelf'
    const [loading, setLoading] = useState(false);

    const fetchCookbook = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [favResponse, myRecipesResponse] = await Promise.all([
                localApi.get(`/favorites?userId=${user.id}`),
                localApi.get(`/recipes?userId=${user.id}`)
            ]);

            // Normalize data structure
            const myRecipes = myRecipesResponse.data.map(r => ({
                ...r,
                isLocal: true
            }));

            // Map favorites and check if they reference local recipes
            const favorites = favResponse.data.map(f => {
                const localRecipe = myRecipes.find(r => String(r.id) === String(f.recipeId));
                if (localRecipe) {
                    // This favorite references a local recipe, use the local recipe data
                    return {
                        ...localRecipe,
                        favoriteId: f.id // Keep favorite ID for potential removal
                    };
                }
                return {
                    ...f,
                    id: f.recipeId, // Use recipeId as main id for navigation
                    isFavorite: true
                };
            });

            // Filter out local recipes that are already in favorites to avoid duplicates
            const localRecipeIds = new Set(myRecipes.map(r => String(r.id)));
            const nonLocalFavorites = favorites.filter(f => !f.isLocal || !localRecipeIds.has(String(f.id)));

            setFavorites([...myRecipes, ...nonLocalFavorites]);
        } catch (error) {
            console.error('Error fetching cookbook:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCookbook();
    }, [user]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-serif font-bold dark:text-earth-50">My Cookbook</h1>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={fetchCookbook}
                        disabled={loading}
                        className="p-2 rounded-full bg-earth-200 dark:bg-earth-800 hover:bg-earth-300 dark:hover:bg-earth-700 transition-colors disabled:opacity-50"
                        title="Refresh cookbook"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex bg-earth-200 dark:bg-earth-800 rounded-full p-1">
                        <button
                            onClick={() => setView('shelf')}
                            className={`p-2 rounded-full transition-all ${view === 'shelf' ? 'bg-white dark:bg-earth-600 shadow-sm' : ''}`}
                        >
                            <BookOpen size={20} />
                        </button>
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-full transition-all ${view === 'grid' ? 'bg-white dark:bg-earth-600 shadow-sm' : ''}`}
                        >
                            <Grid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {view === 'shelf' ? (
                <div className="relative min-h-[450px] bg-[#3e2b22] p-8 rounded-lg shadow-2xl flex items-end gap-2 overflow-x-auto perspective-1000">
                    {/* Bookshelf Wood Texture & Depth */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#2a1d17] shadow-[0_-5px_10px_rgba(0,0,0,0.5)] z-0" />

                    {/* Back Shadow */}
                    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

                    {favorites.map((recipe, i) => {
                        // Varied Spine Colors (Earthy & Rich)
                        const spineColors = [
                            'bg-[#4E342E]', // Dark Wood
                            'bg-[#33691E]', // Deep Olive
                            'bg-[#8D6E63]', // Warm Taupe
                            'bg-[#BF360C]', // Deep Terracotta
                            'bg-[#37474F]', // Slate Charcoal
                            'bg-[#880E4F]', // Deep Maroon
                            'bg-[#1A237E]', // Midnight Blue
                            'bg-[#5D4037]', // Cocoa
                        ];
                        const randomColor = spineColors[i % spineColors.length];

                        return (
                            <motion.div
                                key={recipe.id}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative group w-14 h-72 hover:w-56 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer z-10 hover:z-20 hover:-translate-y-4"
                            >
                                <Link to={`/recipe/${recipe.id}`}>
                                    {/* Spine */}
                                    <div className={`absolute inset-0 ${randomColor} rounded-l-md border-l-2 border-white/10 flex flex-col items-center justify-center group-hover:opacity-0 transition-opacity p-1 overflow-hidden shadow-lg`}>
                                        {/* Gold Accents */}
                                        <div className="absolute top-4 w-full h-[1px] bg-yellow-500/30" />
                                        <div className="absolute bottom-4 w-full h-[1px] bg-yellow-500/30" />

                                        <span
                                            className="text-yellow-100/90 font-serif tracking-widest truncate w-full text-center text-xs font-semibold drop-shadow-md"
                                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', maxHeight: '85%' }}
                                        >
                                            {recipe.title}
                                        </span>
                                    </div>

                                    {/* Cover (Visible on Hover) */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-md shadow-2xl bg-earth-900">
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10 text-white">
                                            <h3 className="font-serif text-lg leading-tight line-clamp-2">{recipe.title}</h3>
                                        </div>
                                    </div>
                                </Link>
                                {/* Action Buttons for Local Recipes */}
                                {recipe.isLocal && (
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                        <Link
                                            to={`/edit-recipe/${recipe.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button className="p-2 rounded-full bg-white/90 hover:bg-white text-earth-600 shadow-sm transition-colors">
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (window.confirm(`Delete "${recipe.title}"?`)) {
                                                    try {
                                                        const success = await deleteRecipe(recipe.id);
                                                        if (success) {
                                                            // Refresh list
                                                            const newFavorites = favorites.filter(f => f.id !== recipe.id);
                                                            setFavorites(newFavorites);
                                                        } else {
                                                            alert('Failed to delete recipe. Check console for details.');
                                                        }
                                                    } catch (error) {
                                                        console.error('Delete error:', error);
                                                        alert('Error deleting recipe. Please try again.');
                                                    }
                                                }
                                            }}
                                            className="p-2 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm transition-colors"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}

                    {favorites.length === 0 && (
                        <div className="text-white/50 w-full text-center pb-10 z-10">
                            Your shelf is empty. Go discover some recipes!
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {favorites.map((recipe) => (
                        <div key={recipe.id} className="relative group">
                            <Link to={`/recipe/${recipe.id}`}>
                                <div className="glass-panel glass-panel-dark overflow-hidden hover:shadow-xl transition-all">
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold truncate dark:text-earth-100">{recipe.title}</h3>
                                    </div>
                                </div>
                            </Link>
                            {recipe.isLocal && (
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/edit-recipe/${recipe.id}`}>
                                        <button className="p-2 rounded-full bg-white/90 hover:bg-white text-earth-600 shadow-sm transition-colors">
                                            <Edit size={16} />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (window.confirm(`Delete "${recipe.title}"?`)) {
                                                try {
                                                    const success = await deleteRecipe(recipe.id);
                                                    if (success) {
                                                        // Refresh list
                                                        const newFavorites = favorites.filter(f => f.id !== recipe.id);
                                                        setFavorites(newFavorites);
                                                    } else {
                                                        alert('Failed to delete recipe. Check browser console for details.');
                                                    }
                                                } catch (error) {
                                                    console.error('Delete error:', error);
                                                    alert('Error deleting recipe. Please try again.');
                                                }
                                            }
                                        }}
                                        className="p-2 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm transition-colors"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CookbookPage;
