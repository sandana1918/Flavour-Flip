import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Award, Clock, Book } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="glass-panel glass-panel-dark p-8 flex items-center gap-8">
                <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full border-4 border-earth-200 dark:border-earth-700"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-serif font-bold mb-2 text-earth-900 dark:text-earth-100">{user?.name}</h1>
                    <p className="text-earth-600 dark:text-earth-400 mb-4">{user?.email}</p>
                    <div className="flex gap-4">

                        <button onClick={logout} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Recipes Cooked", value: "12", icon: Award },
                    { label: "Time Spent", value: "45h", icon: Clock },
                    { label: "Saved Recipes", value: "28", icon: Book },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel glass-panel-dark p-6 flex items-center gap-4">
                        <div className="p-3 bg-earth-100 dark:bg-earth-800 rounded-full text-earth-800 dark:text-earth-200">
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-earth-900 dark:text-earth-100">{stat.value}</div>
                            <div className="text-sm text-earth-600 dark:text-earth-400">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
