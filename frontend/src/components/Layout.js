import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
