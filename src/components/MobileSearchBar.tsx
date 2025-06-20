import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { siteContent, cities, propertyTypes } from '../data/content';
import { useNavigate } from 'react-router-dom';
import { FilterState } from './properties/types';

interface SearchParams {
  location: string;
  propertyType: string;
  priceRange: string;
}

const MobileSearchBar = () => {
  const { home } = siteContent;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    propertyType: '',
    priceRange: '',
  });

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
    <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl p-3 sm:p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {/* Location */}
          <div>
            <select
              name="location"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#E42B57] text-sm sm:text-base"
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
          </div>
          
          {/* Property Type */}
          <div>
            <select
              name="propertyType"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#E42B57] text-sm sm:text-base"
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
          </div>
          
          {/* Price Range */}
          <div>
            <select
              name="priceRange"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#E42B57] text-sm sm:text-base"
              onChange={handleChange}
              value={searchParams.priceRange}
            >
              <option value="">Ценови диапазон</option>
              <option value="0-100000">До 100,000 лв.</option>
              <option value="100000-200000">100,000 лв. - 200,000 лв.</option>
              <option value="200000-300000">200,000 лв. - 300,000 лв.</option>
              <option value="300000-500000">300,000 лв. - 500,000 лв.</option>
              <option value="500000-1000000">500,000 лв. - 1,000,000 лв.</option>
              <option value="1000000+">Над 1,000,000 лв.</option>
            </select>
          </div>
          
          {/* Search Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-b from-[#E42B57] to-[#C41945] text-white border border-[#C41945]/20 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-[#E42B57]/50 relative overflow-hidden px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold"
          >
            <Search className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Търсене
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MobileSearchBar; 