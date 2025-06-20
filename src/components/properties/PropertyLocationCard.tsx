import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PropertyMap from '@/components/properties/PropertyMap';

interface PropertyLocationCardProps {
  address: string;
  location: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
}

const PropertyLocationCard: React.FC<PropertyLocationCardProps> = ({ 
  address, 
  location, 
  city,
  latitude,
  longitude
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Локация</h2>
      </CardHeader>
      <CardContent>
        <PropertyMap 
          address={address} 
          location={location} 
          city={city} 
          latitude={latitude}
          longitude={longitude}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyLocationCard;
