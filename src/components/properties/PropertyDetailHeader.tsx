import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Share2, Printer, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property, formatPrice } from '@/data/properties';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { useAgent } from './usePropertyMapper';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PropertyDetailHeaderProps {
  property: Property;
  isAgent: boolean;
}

const PropertyDetailHeader: React.FC<PropertyDetailHeaderProps> = ({ 
  property, 
  isAgent 
}) => {
  // Fetch agent data
  const { data: agent } = useAgent(property.agent?.id || null);
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Вижте този имот: ${property.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Линкът е копиран в клипборда');
    }
  };
  
  const handlePrintClick = () => {
    window.print();
  };

  const formatPricePerSqm = (price: number, area: number) => {
    if (!area) return null;
    const pricePerSqm = price / area;
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(pricePerSqm)
      .replace('EUR', '€');
  };

  return (
    <div className="relative bg-gray-50 border-b border-gray-100 pt-4 pb-4 md:sticky md:top-0 md:z-10">
      <div className="w-full">
        {/* Back button - always at top */}
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild className="w-fit hover:bg-gray-100">
            <Link to="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Обратно към имоти</span>
            </Link>
          </Button>
        </div>
        
        {/* Main content - responsive layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          {/* Left side: Property title and location */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3 break-words">
              {property.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1 text-gray-600 flex-shrink-0" />
              <span className="text-sm md:text-base break-words">
                {property.location}, {property.city}
              </span>
            </div>
            
            {/* Property badges - mobile friendly */}
            <div className="flex flex-wrap gap-2 mb-4 lg:mb-0">
              <Badge variant="outline" className="bg-gray-100 border-gray-300">
                {property.propertyType}
              </Badge>
              {property.bedrooms > 0 && (
                <Badge variant="outline" className="bg-gray-100 border-gray-300">
                  {property.bedrooms} {property.bedrooms === 1 ? 'стая' : 'стаи'}
                </Badge>
              )}
              {property.area && (
                <Badge variant="outline" className="bg-gray-100 border-gray-300">
                  {property.area} м²
                </Badge>
              )}
            </div>
          </div>
          
          {/* Right side: Price and actions */}
          <div className="flex flex-col lg:items-end gap-4">
            {/* Action buttons */}
            <div className="flex gap-2 justify-start lg:justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                onClick={handleShareClick}
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Споделяне</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                onClick={handlePrintClick}
              >
                <Printer className="h-4 w-4 mr-2 sm:mr-2" />
                <span className="hidden sm:inline">Принтиране</span>
              </Button>
            </div>
            
            {/* Price section */}
            <div className="flex flex-col lg:items-end">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 lg:flex-col lg:items-end">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                </span>
                <Badge variant="outline" className="bg-gray-100 w-fit">
                  {property.listing_type === 'rent' ? 'Под наем' : 'Продажба'}
                </Badge>
              </div>
              
              {property.area && (
                <div className="flex items-center mt-1 text-gray-500 text-sm">
                  <Tag className="h-3 w-3 mr-1 text-gray-600" />
                  <span>{formatPricePerSqm(property.price, property.area)}/м²</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Agent edit button - only shown to agents */}
        {isAgent && (
          <div className="mt-4 flex justify-start lg:justify-end">
            <Button variant="outline" size="sm" className="text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900">
              <Edit className="h-4 w-4 mr-2" />
              <span>Редактиране на имота</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
