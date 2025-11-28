import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import CookbookPage from './pages/CookbookPage';
import AddRecipePage from './pages/AddRecipePage';
import CookingModePage from './pages/CookingModePage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                    <Route path="/login" element={<AuthPage type="login" />} />
                    <Route path="/signup" element={<AuthPage type="signup" />} />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/cookbook" element={
                        <ProtectedRoute>
                            <CookbookPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/add-recipe" element={
                        <ProtectedRoute>
                            <AddRecipePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/edit-recipe/:id" element={
                        <ProtectedRoute>
                            <AddRecipePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/cooking-mode/:id" element={<CookingModePage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
