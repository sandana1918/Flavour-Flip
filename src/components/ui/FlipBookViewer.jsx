import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Clock, Users, Flame, CheckCircle } from 'lucide-react';

const Page = forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-cream dark:bg-earth-800 h-full shadow-inner border-r border-earth-200 dark:border-earth-700 overflow-hidden" ref={ref}>
      <div className="h-full p-8 md:p-12 relative">
        {props.children}
        <div className="absolute bottom-4 right-4 text-xs text-earth-400">
          {props.number}
        </div>
      </div>
    </div>
  );
});

const CoverPage = forwardRef(({ title, image, time, servings }, ref) => (
  <div className="demoPage bg-earth-800 text-white h-full shadow-2xl" ref={ref}>
    <div className="h-full flex flex-col relative overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="relative z-10 p-10 flex flex-col justify-end h-full bg-gradient-to-t from-black/80 to-transparent">
        <h1 className="text-4xl font-serif font-bold mb-4">{title}</h1>
        <div className="flex gap-6 text-sm font-medium">
          <span className="flex items-center gap-2"><Clock size={16} /> {time} mins</span>
          <span className="flex items-center gap-2"><Users size={16} /> {servings} servings</span>
        </div>
      </div>
    </div>
  </div>
));

const FlipBookViewer = ({ recipe }) => {
  return (
    <div className="flex justify-center items-center py-10 h-[600px] md:h-[700px]">
      <HTMLFlipBook 
        width={450} 
        height={600} 
        showCover={true}
        maxShadowOpacity={0.5}
        className="shadow-2xl"
      >
        {/* Cover */}
        <CoverPage 
          title={recipe.title} 
          image={recipe.image}
          time={recipe.readyInMinutes}
          servings={recipe.servings}
        />

        {/* Overview */}
        <Page number={1}>
          <h2 className="text-2xl font-serif font-bold mb-6 text-earth-900 dark:text-earth-100">Overview</h2>
          <p className="text-earth-700 dark:text-earth-300 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-earth-100 dark:bg-earth-700 rounded-xl">
              <span className="block text-xs text-earth-500 uppercase tracking-wider">Health Score</span>
              <span className="text-xl font-bold text-earth-800 dark:text-earth-100">{recipe.healthScore}</span>
            </div>
            <div className="p-4 bg-earth-100 dark:bg-earth-700 rounded-xl">
              <span className="block text-xs text-earth-500 uppercase tracking-wider">Price/Serving</span>
              <span className="text-xl font-bold text-earth-800 dark:text-earth-100">${(recipe.pricePerServing / 100).toFixed(2)}</span>
            </div>
          </div>
        </Page>

        {/* Ingredients */}
        <Page number={2}>
          <h2 className="text-2xl font-serif font-bold mb-6 text-earth-900 dark:text-earth-100">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.extendedIngredients?.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 text-earth-700 dark:text-earth-300">
                <div className="mt-1 min-w-[16px]">
                  <div className="w-4 h-4 rounded-full border border-earth-400" />
                </div>
                <span className="text-sm">{ing.original}</span>
              </li>
            ))}
          </ul>
        </Page>

        {/* Steps Pages - Split into multiple pages if needed */}
        {recipe.analyzedInstructions?.[0]?.steps.reduce((acc, step, i) => {
          const pageIndex = Math.floor(i / 4); // 4 steps per page
          if (!acc[pageIndex]) acc[pageIndex] = [];
          acc[pageIndex].push(step);
          return acc;
        }, []).map((stepsGroup, pageIdx) => (
          <Page key={`steps-${pageIdx}`} number={3 + pageIdx}>
            <h2 className="text-2xl font-serif font-bold mb-6 text-earth-900 dark:text-earth-100">
              Instructions {pageIdx > 0 && `(Cont.)`}
            </h2>
            <div className="space-y-6">
              {stepsGroup.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-earth-200 dark:bg-earth-700 rounded-full flex items-center justify-center font-bold text-earth-800 dark:text-earth-200 text-sm">
                    {step.number}
                  </div>
                  <p className="text-sm text-earth-700 dark:text-earth-300 leading-relaxed">
                    {step.step}
                  </p>
                </div>
              ))}
            </div>
          </Page>
        ))}

        {/* End Page */}
        <Page number="End">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-earth-100 dark:bg-earth-700 rounded-full flex items-center justify-center mb-6 text-earth-600">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-earth-900 dark:text-earth-100">Ready to Cook?</h3>
            <p className="text-earth-600 dark:text-earth-400 mb-8">
              Enter Cooking Mode for a hands-free experience.
            </p>
          </div>
        </Page>
      </HTMLFlipBook>
    </div>
  );
};

export default FlipBookViewer;
