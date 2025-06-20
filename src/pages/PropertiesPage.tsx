import React, { useState, useEffect } from 'react';
import { PropertiesListNew } from '@/components/properties/PropertiesListNew';
import PropertyFilterNew from '@/components/PropertyFilterNew';
import PropertySellForm from '@/components/PropertySellForm';
import { FilterState } from '@/components/properties/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize filters directly from URL search params on initial load
    const queryParams = new URLSearchParams(location.search);
    return {
      listingType: queryParams.get('listingType') || '',
      propertyType: queryParams.get('propertyType') || '',
      city: queryParams.get('city') || '',
      minPrice: queryParams.get('minPrice') ? parseInt(queryParams.get('minPrice')!) : null,
      maxPrice: queryParams.get('maxPrice') ? parseInt(queryParams.get('maxPrice')!) : null,
      bedrooms: queryParams.get('bedrooms') ? parseInt(queryParams.get('bedrooms')!) : null,
      bathrooms: queryParams.get('bathrooms') ? parseInt(queryParams.get('bathrooms')!) : null
    };
  });
  const [showFilters, setShowFilters] = useState(false);

  // Update filters when location.search changes (e.g., from direct URL navigation or handleFilterChange)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters: FilterState = {
      listingType: queryParams.get('listingType') || '',
      propertyType: queryParams.get('propertyType') || '',
      city: queryParams.get('city') || '',
      minPrice: queryParams.get('minPrice') ? parseInt(queryParams.get('minPrice')!) : null,
      maxPrice: queryParams.get('maxPrice') ? parseInt(queryParams.get('maxPrice')!) : null,
      bedrooms: queryParams.get('bedrooms') ? parseInt(queryParams.get('bedrooms')!) : null,
      bathrooms: queryParams.get('bathrooms') ? parseInt(queryParams.get('bathrooms')!) : null
    };
    
    // Only set if they are actually different to avoid potential loops
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
        setFilters(newFilters);
    }
  }, [location.search]); // Removed filters dependency

  const handleFilterChange = (changedFilters: FilterState) => {
    const queryParams = new URLSearchParams();
    if (changedFilters.city) queryParams.append('city', changedFilters.city);
    if (changedFilters.propertyType) queryParams.append('propertyType', changedFilters.propertyType);
    if (changedFilters.listingType) queryParams.append('listingType', changedFilters.listingType);
    if (changedFilters.minPrice) queryParams.append('minPrice', changedFilters.minPrice.toString());
    if (changedFilters.maxPrice) queryParams.append('maxPrice', changedFilters.maxPrice.toString());
    if (changedFilters.bedrooms) queryParams.append('bedrooms', changedFilters.bedrooms.toString());
    if (changedFilters.bathrooms) queryParams.append('bathrooms', changedFilters.bathrooms.toString());
    
    // Navigate, which will trigger the useEffect above due to location.search changing.
    navigate(`/properties?${queryParams.toString()}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Note: Navbar is now handled by the App component */}
      
      {/* Full width design */}
      <div className="w-full px-4 md:px-8 py-4">
        {/* Header with filter toggle for mobile */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-black">Нашите Имоти</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')} 
                className="hover:bg-gray-100 p-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Начало
              </Button>
              <span className="mx-2">/</span>
              <span>Имоти</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2 border-black text-black"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Филтри
          </Button>
        </div>

        {/* Mobile filters (shown/hidden) */}
        <div className={`md:hidden mb-6 ${showFilters ? 'block' : 'hidden'}`}>
          <PropertyFilterNew onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>

        {/* Main content area with responsive layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar with filters - hidden on mobile */}
          <div className="hidden md:block md:w-80 lg:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <PropertyFilterNew onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>
          </div>

          {/* Right area with property listings - full width */}
          <div className="flex-grow">
            <PropertiesListNew initialFilters={filters} />
          </div>
        </div>

        {/* Sell Your Property Form - redesigned with black accents */}
        <div className="mt-16 mb-8 bg-white rounded-lg p-8 shadow-md border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
                Искате да продадете имот?
              </h2>
              <p className="text-lg mb-6 text-neutral-700">
                Нашите експерти ще ви помогнат да постигнете най-добрата цена за вашия имот. Попълнете формата 
                и ще се свържем с вас за безплатна консултация.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Професионална оценка</h3>
                    <p className="text-neutral-600">Получете реалистична оценка на вашия имот</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Бързи резултати</h3>
                    <p className="text-neutral-600">Продайте бързо с нашата мрежа от купувачи</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Без скрити такси</h3>
                    <p className="text-neutral-600">Прозрачни условия и честни комисионни</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <PropertySellForm />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertiesPage;
