import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import BlurText from './react-bits-style/BlurText';
import { Link } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_API_URL;

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleExploreProperties = async () => {
    setIsLoading(true);

    try {
      // Make a null/empty call to fetch all properties
      const res = await fetch(`${BACKEND_API_URL}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // Empty payload to get all properties
      });

      const data = await res.json();
      navigate('/results', { state: { properties: data } });
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      <section className="relative h-screen flex items-center justify-center px-4">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.6] saturate-[1.2]"
        >
          <source
            src="https://res.cloudinary.com/dnfqbyhxr/video/upload/v1752704263/shekvetili-georgia-2020-aerial-front-view-of-paragraph-resort-spa-hotel-exterior-at-night-free-video_1_mglffg.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 z-10" />

        {/* Content */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-14 shadow-xl">
            <h1 className="text-white mb-6">
              <BlurText
                text="Discover High-Return Real Estate Deals"
                delay={100}
                animateBy="words"
                direction="top"
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight"
              />
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-light">
              Discover properties that match your lifestyle across the most desirable locations.
            </p>

            {/* SearchBox (Desktop Only) */}
            <div className="hidden md:block w-full max-w-2xl mx-auto mb-10">
              <SearchBox />
            </div>

            {/* Mobile Button to open search */}
            <div className="md:hidden mb-8">
              <Link
                to="/search"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow hover:bg-blue-700 transition"
              >
                Search Properties
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <button 
                className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-300/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                onClick={handleExploreProperties}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Explore Properties'
                )}
              </button>
              <button className="px-13 py-3 text-base font-semibold border border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                Watch Video
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center animate-bounce">
            <div className="w-1 h-2 bg-white mt-1 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
