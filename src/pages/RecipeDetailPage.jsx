import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Play, Edit, Trash } from 'lucide-react';
import FlipBookViewer from '../components/ui/FlipBookViewer';
import { getRecipeDetails, localApi, deleteRecipe, getFavorites } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecipe = async () => {
            const data = await getRecipeDetails(id);
            setRecipe(data);
            setLoading(false);
        };
        fetchRecipe();
    }, [id]);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (user && recipe) {
                const favorites = await getFavorites(user.id);
                const fav = favorites.find(f => String(f.recipeId) === String(recipe.id));
                if (fav) {
                    setIsFavorite(true);
                    setFavoriteId(fav.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            }
        };
        checkFavoriteStatus();
    }, [user, recipe]);

    const toggleFavorite = async () => {
        if (!user) return alert('Please login first');

        try {
            if (isFavorite) {
                // Remove from favorites
                await localApi.delete(`/favorites/${favoriteId}`);
                setIsFavorite(false);
                setFavoriteId(null);
                // alert('Removed from cookbook'); // Optional: toast notification would be better
            } else {
                // Add to favorites
                const response = await localApi.post('/favorites', {
                    userId: user.id,
                    recipeId: recipe.id,
                    title: recipe.title,
                    image: recipe.image
                });
                setIsFavorite(true);
                setFavoriteId(response.data.id);
                // alert('Added to cookbook!');
            }
        } catch (error) {
            console.error('Error updating cookbook', error);
        }
    };

    if (loading) return <div className="flex justify-center py-20">Loading...</div>;
    if (!recipe) return <div className="text-center py-20">Recipe not found</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <Link to="/discover" className="flex items-center gap-2 text-earth-600 hover:text-earth-800 dark:text-earth-400">
                    <ArrowLeft size={20} /> Back to Discover
                </Link>
                <div className="flex gap-4">
                    {user && String(recipe.userId) === String(user.id) && (
                        <>
                            <Link to={`/edit-recipe/${recipe.id}`}>
                                <button className="p-3 rounded-full bg-white dark:bg-earth-800 shadow-md hover:shadow-lg transition-all text-earth-600 dark:text-earth-300">
                                    <Edit size={20} />
                                </button>
                            </Link>
                            <button
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this recipe?')) {
                                        await deleteRecipe(recipe.id);
                                        navigate('/cookbook');
                                    }
                                }}
                                className="p-3 rounded-full bg-white dark:bg-earth-800 shadow-md hover:shadow-lg transition-all text-red-500"
                            >
                                <Trash size={20} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={toggleFavorite}
                        className={`p-3 rounded-full shadow-md hover:shadow-lg transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-earth-800 text-earth-400'}`}
                        title={isFavorite ? "Remove from Cookbook" : "Add to Cookbook"}
                    >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <Link to={`/cooking-mode/${id}`}>
                        <button className="btn-primary flex items-center gap-2">
                            <Play size={18} /> Start Cooking
                        </button>
                    </Link>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <FlipBookViewer recipe={recipe} />
            </motion.div>
        </div>
    );
};

export default RecipeDetailPage;
