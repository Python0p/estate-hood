import React from 'react';
import SearchBox from './SearchBox';
import BlurText from './react-bits-style/BlurText';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="relative">
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
            src="src/assets/background.mp4"
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
                text="Find Your Dream Home Today"
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
              <button className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-300/30 transition-all duration-300 hover:-translate-y-1">
                Explore Properties
              </button>
              <button className="px-8 py-3 text-base font-semibold border border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
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
