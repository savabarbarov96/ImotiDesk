
import React from 'react';
import { siteContent } from '../data/content';
import SearchBar from './SearchBar';
import HeroCarousel from './HeroCarousel';

const Hero = () => {
  const { home } = siteContent;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-[600px] md:h-[700px] flex items-center overflow-hidden">
      {/* Background carousel */}
      <HeroCarousel />

      {/* Hero content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-2xl mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-play drop-shadow-lg animate-fade-in">
            {home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-play drop-shadow-md animate-fade-in">
            {home.hero.subtitle}
          </p>

          <div className="glass-effect p-4 rounded-xl animate-fade-in">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
