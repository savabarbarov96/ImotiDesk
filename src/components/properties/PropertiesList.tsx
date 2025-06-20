import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import { Loader2 } from 'lucide-react';
import { Property } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { FilterState, SupabaseProperty } from './types';
import { usePropertyMapper } from './usePropertyMapper';
import { propertyTypes, cities } from '@/data/content';

// Helper function to validate property type for filtering
const validatePropertyTypeFilter = (type: string): string => {
  return type && propertyTypes.includes(type) ? type : '';
};

// Helper function to validate city for filtering
const validateCityFilter = (city: string): string => {
  return city && cities.includes(city) ? city : '';
};

export const PropertiesList: React.FC<{ initialFilters?: FilterState }> = ({ 
  initialFilters 
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      console.log('Initial filters changed:', initialFilters);
      
      // Validate the filter values before setting
      const validatedFilters = {
        ...initialFilters,
        propertyType: validatePropertyTypeFilter(initialFilters.propertyType),
        city: validateCityFilter(initialFilters.city),
      };
      
      setFilters(validatedFilters);
      prevInitialFiltersRef.current = initialFilters;
    }
  }, [initialFilters]);

  // Fetch properties whenever filters change
  useEffect(() => {
    console.log('Filters changed, fetching properties:', filters);
    
    // Debounce the fetch operation
    const fetchTimeout = setTimeout(() => {
      fetchProperties();
    }, 100);
    
    return () => {
      clearTimeout(fetchTimeout);
    };
  }, [JSON.stringify(filters)]); // Using JSON.stringify to only trigger when filters actually change

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching properties with filters:', filters);
      
      let query = supabase
        .from('imotidesk_properties')
        .select('*')
        .eq('is_published', true);

      // Apply filters
      if (filters.listingType && filters.listingType !== '') {
        query = query.eq('listing_type', filters.listingType);
        console.log('Applied listing type filter:', filters.listingType);
      }
      
      if (filters.propertyType && filters.propertyType !== '') {
        query = query.eq('property_type', filters.propertyType);
        console.log('Applied property type filter:', filters.propertyType);
      }
      
      if (filters.city && filters.city !== '') {
        query = query.eq('city', filters.city);
        console.log('Applied city filter:', filters.city);
      }
      
      if (filters.minPrice && filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
        console.log('Applied min price filter:', filters.minPrice);
      }
      
      if (filters.maxPrice && filters.maxPrice > 0) {
        query = query.lte('price', filters.maxPrice);
        console.log('Applied max price filter:', filters.maxPrice);
      }
      
      if (filters.bedrooms && filters.bedrooms > 0) {
        query = query.gte('bedrooms', filters.bedrooms);
        console.log('Applied bedrooms filter:', filters.bedrooms);
      }
      
      if (filters.bathrooms && filters.bathrooms > 0) {
        query = query.gte('bathrooms', filters.bathrooms);
        console.log('Applied bathrooms filter:', filters.bathrooms);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Properties fetched:', data?.length);
      
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  if (properties.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-xl mb-2">Не са намерени имоти</h3>
        <p className="text-neutral mb-4">Опитайте с различни филтри или разгледайте всички наши имоти.</p>
        <Button onClick={() => updateFilters({
          listingType: '',
          propertyType: '',
          city: '',
          minPrice: null,
          maxPrice: null,
          bedrooms: null,
          bathrooms: null
        })}>
          Изчистване на филтрите
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
