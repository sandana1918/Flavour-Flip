import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Twitter, Facebook, Mail, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-earth-900 border-t border-earth-200 dark:border-earth-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-12 md:px-8">
                    {/* Brand Section */}
                    <div className="space-y-4 max-w-md">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-earth-800 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <ChefHat size={24} />
                            </div>
                            <span className="text-2xl font-serif font-bold text-earth-900 dark:text-earth-50">
                                FlavourFlip
                            </span>
                        </Link>
                        <p className="text-earth-600 dark:text-earth-400 text-sm leading-relaxed">
                            Turn ingredients into art. Discover, create, and share your culinary masterpieces with the world.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:ml-auto">
                        <h3 className="font-bold text-earth-900 dark:text-earth-100 mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-earth-600 dark:text-earth-400">
                            <li>
                                <Link to="/" className="hover:text-earth-800 dark:hover:text-earth-200 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/discover" className="hover:text-earth-800 dark:hover:text-earth-200 transition-colors">Discover Recipes</Link>
                            </li>
                            <li>
                                <Link to="/cookbook" className="hover:text-earth-800 dark:hover:text-earth-200 transition-colors">My Cookbook</Link>
                            </li>
                            <li>
                                <Link to="/add-recipe" className="hover:text-earth-800 dark:hover:text-earth-200 transition-colors">Add Recipe</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-earth-200 dark:border-earth-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-earth-500 dark:text-earth-400">
                    <p>© 2024 FlavourFlip. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-current" />
                        <span>for food lovers.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
