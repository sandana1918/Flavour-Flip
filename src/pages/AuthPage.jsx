import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ChefHat } from 'lucide-react';

const AuthPage = ({ type }) => {
    const isLogin = type === 'login';
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            result = await signup(formData);
        }

        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="flex w-full max-w-4xl bg-white dark:bg-earth-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Animation */}
                <div className="hidden md:flex w-1/2 bg-earth-800 text-white p-12 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <ChefHat size={48} className="mb-6" />
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            {isLogin ? "Welcome Back!" : "Join the Kitchen"}
                        </h2>
                        <p className="text-earth-200 text-lg">
                            {isLogin
                                ? "Your recipes are waiting. Let's get cooking."
                                : "Start your culinary journey with FlavourFlip today."}
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-earth-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-earth-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-12">
                    <h3 className="text-2xl font-bold mb-8 text-earth-900 dark:text-earth-100">
                        {isLogin ? "Sign In" : "Create Account"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700 focus:ring-2 focus:ring-earth-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700 focus:ring-2 focus:ring-earth-500 outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-earth-900 border border-earth-200 dark:border-earth-700 focus:ring-2 focus:ring-earth-500 outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button type="submit" className="btn-primary w-full py-4 rounded-xl text-lg">
                            {isLogin ? "Login" : "Sign Up"}
                        </button>

                        <div className="mt-6 text-center text-sm text-earth-600 dark:text-earth-400">
                            {isLogin ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/signup')}
                                        className="font-bold text-earth-800 dark:text-earth-200 hover:underline"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="font-bold text-earth-800 dark:text-earth-200 hover:underline"
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
