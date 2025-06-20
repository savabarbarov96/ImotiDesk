import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { siteContent, cities, propertyTypes } from '../data/content';
import { useNavigate } from 'react-router-dom';
import { FilterState } from './properties/types';
import { motion } from 'framer-motion';

interface SearchParams {
  location: string;
  propertyType: string;
  priceRange: string;
}

const DesktopSearchBar = () => {
  const { home } = siteContent;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    propertyType: '',
    priceRange: '',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the search bar after a delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert search params to filter state format
    const filters: FilterState = {
      city: searchParams.location,
      propertyType: searchParams.propertyType,
      listingType: '',
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
    };
    
    // Handle price range
    if (searchParams.priceRange) {
      const [min, max] = searchParams.priceRange.split('-');
      filters.minPrice = min ? parseInt(min) : null;
      filters.maxPrice = max && max !== '+' ? parseInt(max) : null;
    }
    
    // Create query string
    const queryParams = new URLSearchParams();
    
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (filters.listingType) queryParams.append('listingType', filters.listingType);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    
    // Navigate to properties page with query parameters
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <motion.div
      className="fixed bottom-8 left-0 right-0 z-50 hidden md:block px-8"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/40 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              {/* Location */}
              <div className="relative">
                <select
                  name="location"
                  className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E42B57] focus:border-[#E42B57] text-base transition-all duration-200 hover:border-gray-300 appearance-none"
                  onChange={handleChange}
                  value={searchParams.location}
                >
                  <option value="">Местоположение</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city} className="text-gray-900">
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Property Type */}
              <div className="relative">
                <select
                  name="propertyType"
                  className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E42B57] focus:border-[#E42B57] text-base transition-all duration-200 hover:border-gray-300 appearance-none"
                  onChange={handleChange}
                  value={searchParams.propertyType}
                >
                  <option value="">Тип имот</option>
                  {propertyTypes.map((type, index) => (
                    <option key={index} value={type} className="text-gray-900">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Price Range */}
              <div className="relative">
                <select
                  name="priceRange"
                  className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E42B57] focus:border-[#E42B57] text-base transition-all duration-200 hover:border-gray-300 appearance-none"
                  onChange={handleChange}
                  value={searchParams.priceRange}
                >
                  <option value="">Ценови диапазон</option>
                  <option value="0-50000">До 50,000 €</option>
                  <option value="50000-100000">50,000 € - 100,000 €</option>
                  <option value="100000-150000">100,000 € - 150,000 €</option>
                  <option value="150000-250000">150,000 € - 250,000 €</option>
                  <option value="250000-500000">250,000 € - 500,000 €</option>
                  <option value="500000+">Над 500,000 €</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Search Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E42B57] to-[#C41945] hover:from-[#C41945] hover:to-[#A01739] text-white border-0 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-[#E42B57]/50 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="mr-2 h-4 w-4" />
                Търсене
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default DesktopSearchBar; 