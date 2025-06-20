import React from 'react';
import { MapPin, Bed, Maximize } from 'lucide-react';
import { Property, formatPrice } from '../data/properties';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

const PropertyCardNew: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link to={`/properties/${property.id}`} className="block group">
      <div className="bg-white overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl h-full">
        {/* Property image - with larger aspect ratio */}
        <div className="relative aspect-[5/3] overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error('Image failed to load for property:', property.id, 'URL:', property.imageUrl);
              // Try to use a placeholder image
              e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Listing type badge */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium backdrop-blur-sm shadow-sm rounded-full ${
              property.listing_type === 'rent' ? 'bg-gray-600/60 text-white border border-gray-500/40' : 'bg-white/70 text-gray-700 border border-gray-300/40'
            }`}>
              {property.listing_type === 'rent' ? 'Отдава под наем' : 'Продава'}
            </span>
            {(property.featured || property.is_featured) && (
              <span className="bg-slate-600/60 backdrop-blur-sm text-white px-2.5 py-1 text-xs font-medium shadow-sm border border-slate-500/40 rounded-full">
                Препоръчан
              </span>
            )}
            {(property.exclusive || property.is_exclusive) && (
              <span className="bg-stone-600/60 backdrop-blur-sm text-white px-2.5 py-1 text-xs font-medium shadow-sm border border-stone-500/40 rounded-full">
                Ексклузивен
              </span>
            )}
          </div>
          
          {/* Property type badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/80 backdrop-blur-sm text-black px-3 py-1.5 text-sm font-medium rounded">
              {property.propertyType}
            </span>
          </div>
          
          {/* Price tag - prominent in the lower right corner */}
          <div className="absolute bottom-4 right-4 bg-gray-200 backdrop-blur-md text-gray-900 px-4 py-2 rounded-xl text-xl font-bold shadow-lg">
            {formatPrice(property.price)}
            {property.listing_type === 'rent' && <span className="text-xs ml-1 font-normal text-gray-700">/месец</span>}
          </div>
        </div>

        {/* Property details - minimal clean design with more padding */}
        <div className="p-6">
          {/* Main information - location and rooms */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-neutral-600">
              <MapPin className="h-5 w-5 mr-2 text-black" strokeWidth={2} />
              <span className="font-medium text-base">{property.location}, {property.city}</span>
            </div>
            
            {property.bedrooms > 0 && (
              <div className="flex items-center text-neutral-600">
                <Bed className="h-5 w-5 mr-2 text-black" strokeWidth={2} />
                <span className="text-base">{property.bedrooms}-СТАЕН</span>
              </div>
            )}
          </div>
          
          {/* Area information */}
          <div className="flex items-center text-neutral-600 mt-3">
            <Maximize className="h-5 w-5 mr-2 text-black" strokeWidth={2} />
            <span className="text-base">{property.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCardNew; 