import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isCookingMode = location.pathname.includes('/cooking-mode');

  if (isCookingMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-earth-900 transition-colors duration-300">
      <Navbar />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
