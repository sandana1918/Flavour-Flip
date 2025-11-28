import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ArrowRight, ChefHat, Flame, Clock } from 'lucide-react';
import HeroScene from '../components/3d/HeroScene';
import { getTrendingRecipes } from '../services/api';

const LandingPage = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const recipes = await getTrendingRecipes();
      setTrending(recipes);
    };
    fetchTrending();
  }, []);

  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6 z-10"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-earth-100 dark:bg-earth-800 text-earth-800 dark:text-earth-200 text-sm font-medium mb-4">
            ✨ Reimagining Recipe Discovery
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-earth-900 dark:text-earth-50">
            Turn Ingredients Into <span className="text-earth-600 italic">Art on a Plate.</span>
          </h1>
          <p className="text-lg text-earth-600 dark:text-earth-300 max-w-lg">
            Discover, flip, and cook interactive recipes like never before. 
            Experience the future of cooking with 3D interactions.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/discover">
              <button className="btn-primary flex items-center gap-2">
                Get Started <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/discover">
              <button className="btn-secondary">
                Explore Recipes
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full"
        >
          <HeroScene />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-10">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 dark:text-earth-50">How FlavourFlip Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ChefHat, title: "Discover", desc: "Find recipes from around the world with smart filters." },
            { icon: BookOpen, title: "Flip", desc: "Interactive 3D flip-books for an immersive reading experience." },
            { icon: Flame, title: "Cook", desc: "Step-by-step cooking mode with hands-free navigation." }
          ].map((item, index) => (
            <Tilt key={index} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} className="h-full">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="glass-panel glass-panel-dark p-8 h-full flex flex-col items-center text-center gap-4 hover:border-earth-400 transition-colors"
              >
                <div className="p-4 bg-earth-100 dark:bg-earth-800 rounded-full text-earth-700 dark:text-earth-200">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold dark:text-earth-100">{item.title}</h3>
                <p className="text-earth-600 dark:text-earth-400">{item.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Trending Carousel */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold dark:text-earth-50">Trending Now</h2>
          <Link to="/discover" className="text-earth-600 hover:text-earth-800 dark:text-earth-400 font-medium flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto pb-8 -mx-4 px-4 flex gap-6 scrollbar-hide snap-x">
          {trending.length > 0 ? trending.map((recipe, i) => (
            <motion.div 
              key={recipe.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] md:min-w-[320px] snap-center"
            >
              <Link to={`/recipe/${recipe.id}`}>
                <div className="glass-panel glass-panel-dark overflow-hidden group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 dark:text-earth-100">{recipe.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-earth-600 dark:text-earth-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> {recipe.readyInMinutes}m</span>
                      <span className="flex items-center gap-1"><Flame size={14} /> {Math.round(recipe.healthScore)} HS</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) : (
            <div className="w-full text-center py-10 text-earth-500">Loading trending recipes...</div>
          )}
        </div>
      </section>
    </div>
  );
};

// Helper component for icon
const BookOpen = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

export default LandingPage;
