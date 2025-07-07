import React, { useEffect, useState } from 'react';
import Header from './Header';
import Navbar from './Navbar';

const HEADER_HEIGHT = 44; // px
const NAVBAR_HEIGHT = 56; // px

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY < HEADER_HEIGHT); // Hide header after 44px scroll
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* Header */}
      <div
        className={`transition-all duration-500 fixed top-0 left-0 w-full z-50 ${
          showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{ height: HEADER_HEIGHT }}
      >
        <Header />
      </div>

      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          showHeader ? `mt-[${HEADER_HEIGHT}px]` : ''
        }`}
        style={{ top: showHeader ? HEADER_HEIGHT : 0, height: NAVBAR_HEIGHT }}
      >
        <Navbar />
      </div>

      {/* Main Content */}
      <main style={{ paddingTop: showHeader ? HEADER_HEIGHT + NAVBAR_HEIGHT : NAVBAR_HEIGHT }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
