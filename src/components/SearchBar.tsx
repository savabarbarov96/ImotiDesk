import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { siteContent, cities, propertyTypes } from '../data/content';
import { useAnimationSettings } from '@/lib/animations/motion';
import { useNavigate } from 'react-router-dom';
import { FilterState } from './properties/types';

interface SearchParams {
  location: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
}

const SearchBar = () => {
  const { home } = siteContent;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { shouldAnimate } = useAnimationSettings() ?? { shouldAnimate: false };

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
      bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : null,
      bathrooms: searchParams.bathrooms ? parseInt(searchParams.bathrooms) : null,
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
    if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) queryParams.append('bathrooms', filters.bathrooms.toString());
    
    // Navigate to properties page with query parameters
    console.log('Redirecting with filters:', filters);
    navigate(`/properties?${queryParams.toString()}`);
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-lg shadow-lg p-3 sm:p-4 mb-3">
      <form onSubmit={handleSubmit}>
        {/* Main search fields */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Location */}
          <div className={`flex-1 ${shouldAnimate ? 'transition-transform duration-200 active:scale-98' : ''}`}>
            <select
              name="location"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              onChange={handleChange}
              value={searchParams.location}
            >
              <option value="">{home.search.filters.location}</option>
              {cities.map((city, index) => (
                <option key={index} value={city} className="text-gray-900">
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          {/* Property Type */}
          <div className={`flex-1 ${shouldAnimate ? 'transition-transform duration-200 active:scale-98' : ''}`}>
            <select
              name="propertyType"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              onChange={handleChange}
              value={searchParams.propertyType}
            >
              <option value="">{home.search.filters.propertyType}</option>
              {propertyTypes.map((type, index) => (
                <option key={index} value={type} className="text-gray-900">
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Range */}
          <div className={`flex-1 ${shouldAnimate ? 'transition-transform duration-200 active:scale-98' : ''}`}>
            <select
              name="priceRange"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              onChange={handleChange}
              value={searchParams.priceRange}
            >
              <option value="">{home.search.filters.priceRange}</option>
              <option value="0-100000">До 100,000 лв.</option>
              <option value="100000-200000">100,000 лв. - 200,000 лв.</option>
              <option value="200000-300000">200,000 лв. - 300,000 лв.</option>
              <option value="300000-500000">300,000 лв. - 500,000 лв.</option>
              <option value="500000-1000000">500,000 лв. - 1,000,000 лв.</option>
              <option value="1000000+">Над 1,000,000 лв.</option>
            </select>
          </div>
          
          {/* Search Button */}
          <div className={`w-full sm:w-auto ${shouldAnimate ? 'transition-all duration-200 hover:scale-103 active:scale-97' : ''}`}>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-b from-[#E42B57] to-[#C41945] text-white border border-[#C41945]/20 shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#E42B57]/50 relative overflow-hidden px-4 py-2"
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{home.search.buttonText}</span>
              <span className="sm:hidden">Търси</span>
            </Button>
          </div>
        </div>
        
        {/* Advanced Search Section */}
        <div className={`overflow-hidden transition-all duration-300 ${showAdvanced ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-3">
            {/* Bedrooms */}
            <div className={`${shouldAnimate ? 'transition-transform duration-200 active:scale-98' : ''}`}>
              <select
                name="bedrooms"
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onChange={handleChange}
                value={searchParams.bedrooms}
              >
                <option value="">{home.search.filters.bedrooms}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            {/* Bathrooms */}
            <div className={`${shouldAnimate ? 'transition-transform duration-200 active:scale-98' : ''}`}>
              <select
                name="bathrooms"
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onChange={handleChange}
                value={searchParams.bathrooms}
              >
                <option value="">{home.search.filters.bathrooms}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            {/* Area */}
            <div className={`${shouldAnimate ? 'transition-transform duration-200 active:scale-98' : ''}`}>
              <select
                name="area"
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onChange={handleChange}
                value={searchParams.area}
              >
                <option value="">{home.search.filters.area}</option>
                <option value="0-50">До 50 кв.м</option>
                <option value="50-80">50 - 80 кв.м</option>
                <option value="80-120">80 - 120 кв.м</option>
                <option value="120-200">120 - 200 кв.м</option>
                <option value="200+">Над 200 кв.м</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Advanced Search Toggle */}
        <div className="mt-3">
          <button 
            type="button"
            onClick={toggleAdvanced}
            className="bg-white/80 px-3 py-1 rounded-md text-gray-800 hover:bg-white font-medium text-sm flex items-center shadow-sm hover:shadow transition-all duration-200"
          >
            {home.search.advancedSearch} 
            <span 
              className={`ml-1 transition-transform duration-300 ${showAdvanced ? 'transform rotate-180' : ''}`}
            >
              ▼
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
