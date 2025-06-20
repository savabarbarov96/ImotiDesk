import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyCardNew from '@/components/PropertyCardNew';
import { Loader2, ArrowUpDown } from 'lucide-react';
import { Property } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { FilterState, SupabaseProperty } from './types';
import { usePropertyMapper } from './usePropertyMapper';
import { propertyTypes, cities } from '@/data/content';
import PropertiesPaginationNew from './PropertiesPaginationNew';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to validate property type for filtering
const validatePropertyTypeFilter = (type: string): string => {
  return type && propertyTypes.includes(type) ? type : '';
};

// Helper function to validate city for filtering
const validateCityFilter = (city: string): string => {
  return city && cities.includes(city) ? city : '';
};

// Number of properties to display per page
const PROPERTIES_PER_PAGE = 9;

// Sort options
type SortOption = {
  label: string;
  column: string;
  direction: 'asc' | 'desc';
};

const sortOptions: SortOption[] = [
  { label: 'Най-нови', column: 'created_at', direction: 'desc' },
  { label: 'Най-стари', column: 'created_at', direction: 'asc' },
  { label: 'Цена (възходящо)', column: 'price', direction: 'asc' },
  { label: 'Цена (низходящо)', column: 'price', direction: 'desc' },
  { label: 'Площ (възходящо)', column: 'area', direction: 'asc' },
  { label: 'Площ (низходящо)', column: 'area', direction: 'desc' },
];

export const PropertiesListNew: React.FC<{ initialFilters?: FilterState }> = ({ 
  initialFilters 
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    listingType: '',
    propertyType: '',
    city: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null
  });
  const prevInitialFiltersRef = useRef<FilterState | undefined>(initialFilters);

  const { mapSupabasePropertyToProperty } = usePropertyMapper();

  // Update filters when initialFilters change
  useEffect(() => {
    // Only update if initialFilters actually changed
    if (initialFilters && 
        JSON.stringify(initialFilters) !== JSON.stringify(prevInitialFiltersRef.current)) {
      // Validate the filter values before setting
      const validatedFilters = {
        ...initialFilters,
        propertyType: validatePropertyTypeFilter(initialFilters.propertyType),
        city: validateCityFilter(initialFilters.city),
      };
      
      setFilters(validatedFilters);
      setCurrentPage(1); // Reset to first page when filters change
      prevInitialFiltersRef.current = initialFilters;
    }
  }, [initialFilters]);

  // Fetch properties whenever filters, sort or page changes
  useEffect(() => {
    // Debounce the fetch operation
    const fetchTimeout = setTimeout(() => {
      fetchProperties();
    }, 100);
    
    return () => {
      clearTimeout(fetchTimeout);
    };
  }, [JSON.stringify(filters), currentPage, sortBy]); 

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Build the query with filters
      let queryBuilder = supabase
        .from('imotidesk_properties')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      // Apply filters
      if (filters.listingType && filters.listingType !== '') {
        queryBuilder = queryBuilder.eq('listing_type', filters.listingType);
      }
      
      if (filters.propertyType && filters.propertyType !== '') {
        queryBuilder = queryBuilder.eq('property_type', filters.propertyType);
      }
      
      if (filters.city && filters.city !== '') {
        queryBuilder = queryBuilder.eq('city', filters.city);
      }
      
      if (filters.minPrice && filters.minPrice > 0) {
        queryBuilder = queryBuilder.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice && filters.maxPrice > 0) {
        queryBuilder = queryBuilder.lte('price', filters.maxPrice);
      }
      
      if (filters.bedrooms && filters.bedrooms > 0) {
        queryBuilder = queryBuilder.gte('bedrooms', filters.bedrooms);
      }
      
      if (filters.bathrooms && filters.bathrooms > 0) {
        queryBuilder = queryBuilder.gte('bathrooms', filters.bathrooms);
      }

      // First, get the total count
      const countQuery = queryBuilder;
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        throw countError;
      }
      
      setTotalCount(count || 0);
      
      // Then fetch the paginated data
      const from = (currentPage - 1) * PROPERTIES_PER_PAGE;
      const to = from + PROPERTIES_PER_PAGE - 1;
      
      const { data, error } = await queryBuilder
        .order(sortBy.column, { ascending: sortBy.direction === 'asc' })
        .range(from, to);

      if (error) {
        throw error;
      }
      
      // Map Supabase properties to the format expected by PropertyCard
      const formattedProperties = await Promise.all(
        (data || []).map(mapSupabasePropertyToProperty)
      );

      setProperties(formattedProperties);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: FilterState) => {
    // Validate the filter values before setting
    const validatedFilters = {
      ...newFilters,
      propertyType: validatePropertyTypeFilter(newFilters.propertyType),
      city: validateCityFilter(newFilters.city),
    };
    
    setFilters(validatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string) => {
    const selected = sortOptions.find(option => `${option.column}-${option.direction}` === value);
    if (selected) {
      setSortBy(selected);
      setCurrentPage(1); // Reset to first page when sort changes
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 text-black">Зареждане...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  if (properties.length === 0 && !loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-xl mb-2">Не са намерени имоти</h3>
        <p className="text-neutral mb-4">Опитайте с различни филтри или разгледайте всички наши имоти.</p>
        <Button 
          onClick={() => updateFilters({
            listingType: '',
            propertyType: '',
            city: '',
            minPrice: null,
            maxPrice: null,
            bedrooms: null,
            bathrooms: null
          })}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Изчистване на филтрите
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / PROPERTIES_PER_PAGE);

  return (
    <div>
      {/* Results count and sorting options */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-700">
            Намерени <span className="font-semibold text-black">{totalCount}</span> имота
          </p>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Сортирай по:</span>
          <Select
            value={`${sortBy.column}-${sortBy.direction}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="Сортирай по" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem 
                  key={`${option.column}-${option.direction}`} 
                  value={`${option.column}-${option.direction}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Properties grid - changed to 3 columns max */}
      <motion.div 
        key={`properties-${currentPage}-${JSON.stringify(filters)}-${sortBy.column}-${sortBy.direction}`}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${loading ? 'opacity-60' : ''}`}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 30,
                scale: 0.95
              },
              visible: { 
                opacity: 1, 
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }
            }}
          >
            <PropertyCardNew property={property} />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-6">
          <div className="h-6 w-6 text-black">Зареждане...</div>
        </div>
      )}
      
      {/* Pagination */}
      <PropertiesPaginationNew
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalResults={totalCount}
        resultsPerPage={PROPERTIES_PER_PAGE}
      />
    </div>
  );
};

export default PropertiesListNew; 