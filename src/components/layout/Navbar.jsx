import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Search, BookOpen, User, Menu, X, Sun, Moon, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: Search },
    { name: 'My Cookbook', path: '/cookbook', icon: BookOpen },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel glass-panel-dark px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-earth-800 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
            <ChefHat size={24} />
          </div>
          <span className="text-xl font-serif font-bold text-earth-900 dark:text-earth-50">
            FlavourFlip
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === link.path
                ? 'text-earth-800 dark:text-earth-300'
                : 'text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200'
                }`}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors text-earth-700 dark:text-earth-300"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/add-recipe">
                <button className="flex items-center gap-2 px-4 py-2 bg-earth-100 dark:bg-earth-800 text-earth-900 dark:text-earth-100 rounded-full text-sm font-medium hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors">
                  <PlusCircle size={16} />
                  Add Recipe
                </button>
              </Link>
              <div className="relative group">
                <Link to="/profile">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-earth-200 dark:border-earth-700"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="btn-secondary text-sm px-6 py-2">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary text-sm px-6 py-2">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-earth-800 dark:text-earth-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 glass-panel glass-panel-dark p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-earth-800 dark:text-earth-200 py-2"
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-earth-200 dark:bg-earth-700 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-earth-600 dark:text-earth-400">Theme</span>
              <button onClick={toggleTheme} className="p-2">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            {!user && (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="btn-secondary w-full">Login</button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <button className="btn-primary w-full">Sign Up</button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
