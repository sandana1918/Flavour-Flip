import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getRecipeDetails } from '../services/api';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const CookingModePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const { width, height } = useWindowSize();
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            const data = await getRecipeDetails(id);
            setRecipe(data);
        };
        fetchRecipe();
    }, [id]);

    if (!recipe) return <div className="bg-earth-50 text-earth-900 h-screen flex items-center justify-center">Loading...</div>;

    const steps = recipe.analyzedInstructions[0]?.steps || [];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setCompleted(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-earth-50 text-earth-900 z-50 flex flex-col">
            {completed && <Confetti width={width} height={height} />}

            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-1 bg-earth-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-earth-700"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="ml-6 p-2 hover:bg-earth-200/50 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {completed ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-24 h-24 bg-sage-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={48} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold mb-4">Bon Appétit!</h1>
                            <p className="text-earth-600 mb-8">You've completed this recipe.</p>
                            <button onClick={() => navigate('/discover')} className="px-8 py-3 bg-earth-800 text-white rounded-full font-bold hover:bg-earth-700 transition-colors shadow-lg">
                                Discover More
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentStep}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="max-w-2xl text-center"
                        >
                            <span className="inline-block px-4 py-1 bg-earth-200 rounded-full text-sm mb-6 text-earth-800 font-medium">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
                                {steps[currentStep].step}
                            </h2>

                            {/* Ingredients for this step */}
                            {steps[currentStep].ingredients?.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-3">
                                    {steps[currentStep].ingredients.map(ing => (
                                        <span key={ing.id} className="px-3 py-1 bg-white border border-earth-300 rounded-full text-sm text-earth-700 shadow-sm">
                                            {ing.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            {!completed && (
                <div className="p-8 flex justify-between items-center max-w-4xl mx-auto w-full">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="p-4 rounded-full bg-earth-200 hover:bg-earth-300 disabled:opacity-30 transition-colors shadow-md"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-8 py-4 bg-earth-800 hover:bg-earth-700 text-white rounded-full font-bold text-lg transition-colors flex items-center gap-2 shadow-lg"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'} <ChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CookingModePage;
