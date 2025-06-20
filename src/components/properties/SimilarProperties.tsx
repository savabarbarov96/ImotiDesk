
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProperty } from '@/components/properties/types';
import { usePropertyMapper } from '@/components/properties/usePropertyMapper';
import { Property } from '@/data/properties';
import { Loader2 } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SimilarPropertiesProps {
  currentPropertyId: number;
  location: string;
  city: string;
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({ 
  currentPropertyId, 
  location,
  city 
}) => {
  const { mapSupabasePropertyToProperty } = usePropertyMapper();
  const [properties, setProperties] = useState<Property[]>([]);

  // Fetch similar properties
  const { data: similarPropertiesData, isLoading } = useQuery({
    queryKey: ['similarProperties', location, city, currentPropertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imotidesk_properties')
        .select('*')
        .eq('city', city)
        .limit(10);
      
      if (error) throw error;
      return data as SupabaseProperty[];
    },
  });

  useEffect(() => {
    if (similarPropertiesData) {
      const loadProperties = async () => {
        try {
          // Process and filter out current property
          const propertyPromises = similarPropertiesData
            .filter(prop => prop.id !== currentPropertyId.toString())
            .map(prop => mapSupabasePropertyToProperty(prop));
          
          const mappedProperties = await Promise.all(propertyPromises);
          setProperties(mappedProperties.slice(0, 6)); // Show maximum 6 similar properties
        } catch (error) {
          console.error('Error mapping similar properties:', error);
        }
      };
      
      loadProperties();
    }
  }, [similarPropertiesData, currentPropertyId, mapSupabasePropertyToProperty]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No similar properties found in this area.</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {properties.map((property) => (
          <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3 p-2">
            <PropertyCard property={property} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
};

export default SimilarProperties;
