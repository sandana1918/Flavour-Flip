import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Search, Filter, Clock, Users, Leaf, Heart } from 'lucide-react';
import { searchRecipes, getLocalRecipes, getFavorites, localApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DiscoverPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
    maxReadyTime: 60
  });

  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const fetchRecipes = async () => {
    setLoading(true);
    const [spoonacularResults, localResults] = await Promise.all([
      searchRecipes(query, filters),
      getLocalRecipes()
    ]);

    // Filter local recipes based on query if needed
    const filteredLocal = localResults.filter(r =>
      !query || r.title.toLowerCase().includes(query.toLowerCase())
    );

    setRecipes([...filteredLocal, ...spoonacularResults]);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    if (user) {
      const data = await getFavorites(user.id);
      setFavorites(data);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, [user]);

  const isFavorite = (recipeId) => {
    return favorites.some(f => String(f.recipeId) === String(recipeId));
  };

  const toggleFavorite = async (e, recipe) => {
    e.preventDefault(); // Prevent navigation
    if (!user) return alert('Please login first');

    const existingFav = favorites.find(f => String(f.recipeId) === String(recipe.id));

    if (existingFav) {
      // Remove from favorites
      await localApi.delete(`/favorites/${existingFav.id}`);
      setFavorites(favorites.filter(f => f.id !== existingFav.id));
    } else {
      // Add to favorites
      const newFav = {
        userId: user.id,
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image
      };
      const response = await localApi.post('/favorites', newFav);
      setFavorites([...favorites, response.data]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-serif font-bold dark:text-earth-50">Discover New Flavours</h1>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="What are you craving? (e.g., Pasta, Vegan, Asian)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-full bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 focus:outline-none focus:ring-2 focus:ring-earth-400 shadow-lg text-lg"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-earth-400" size={24} />
          <button type="submit" className="absolute right-2 top-2 btn-primary py-2 px-6">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          <select
            className="px-4 py-2 rounded-full bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 text-sm"
            value={filters.cuisine}
            onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="Indian">Indian</option>
          </select>

          <select
            className="px-4 py-2 rounded-full bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 text-sm"
            value={filters.diet}
            onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
          >
            <option value="">Any Diet</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten Free">Gluten Free</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-800"></div>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-6"
          columnClassName="pl-6 bg-clip-padding"
        >
          {recipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mb-6"
            >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="glass-panel glass-panel-dark overflow-hidden group hover:shadow-2xl transition-all duration-300 relative">
                    <div className="relative">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, recipe)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-red-500 transition-all z-10 shadow-sm"
                      >
                        <Heart size={20} fill={isFavorite(recipe.id) ? "currentColor" : "none"} />
                      </button>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="bg-white/90 text-earth-900 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          View Recipe
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-earth-900 dark:text-earth-100 leading-tight">
                        {recipe.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-xs text-earth-600 dark:text-earth-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {recipe.readyInMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {recipe.servings}
                        </span>
                        {recipe.vegetarian && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Leaf size={14} /> Veg
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </Tilt>
            </motion.div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default DiscoverPage;
