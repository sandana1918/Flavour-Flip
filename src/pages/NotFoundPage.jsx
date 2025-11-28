import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-earth-100 dark:bg-earth-800 p-8 rounded-full mb-6 animate-bounce">
                <ChefHat size={64} className="text-earth-600 dark:text-earth-300" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4 dark:text-earth-50">Oops! Kitchen's Closed.</h1>
            <p className="text-earth-600 dark:text-earth-400 mb-8 max-w-md">
                The recipe you're looking for seems to have been eaten. Let's get you back to safety.
            </p>
            <Link to="/">
                <button className="btn-primary">Return to Kitchen</button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
