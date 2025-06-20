import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import PropertyCard from './PropertyCard';
import { siteContent } from '../data/content';
import { useFeaturedProperties } from '@/hooks/use-properties';
import { usePropertyMapper } from '@/components/properties/usePropertyMapper';
import { Property } from '@/data/properties';

const FeaturedProperties = () => {
  const { home } = siteContent;
  const { data: featuredPropertiesData, isLoading, error } = useFeaturedProperties();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const { mapSupabasePropertyToProperty } = usePropertyMapper();
  
  useEffect(() => {
    const mapProperties = async () => {
      if (featuredPropertiesData) {
        const mappedProperties = await Promise.all(
          featuredPropertiesData.map(property => mapSupabasePropertyToProperty(property))
        );
        setFeaturedProperties(mappedProperties);
      }
    };
    
    mapProperties();
  }, [featuredPropertiesData, mapSupabasePropertyToProperty]);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-blue-700">{home.featured.title}</h2>
            <p className="text-lg text-neutral">{home.featured.subtitle}</p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="mt-4 md:mt-0 hover:bg-blue-50 border-blue-300">
              {home.featured.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-red-500">Грешка при зареждане на имотите</p>
          </div>
        ) : featuredProperties && featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">В момента няма препоръчани имоти</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
