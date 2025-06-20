import React from 'react';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Property, formatPrice } from '../data/properties';
import { useIntersectionObserver } from '@/lib/animations/intersection-observer';
import { MotionImage } from '@/components/ui/motion';
import { Link } from 'react-router-dom';
import { useAgent } from '@/components/properties/usePropertyMapper';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  // Fetch agent data
  const { data: agent } = useAgent(property.agent?.id || null);

  // Explicitly cast the ref to allow it to work with both element types
  const safeRef = (node: HTMLDivElement | null) => {
    if (node) ref.current = node;
  };

  return (
    <Link to={`/properties/${property.id}`}>
      <div 
        ref={safeRef}
        className={`bg-gradient-to-b from-white to-gray-50 backdrop-blur-sm rounded-2xl overflow-hidden 
          shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] 
          border border-gray-100/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15),0_10px_10px_-5px_rgba(0,0,0,0.04)] 
          transition-all duration-500 hover:-translate-y-1 
          ${property.featured ? 'ring-offset-2 ring-offset-white/5' : ''}
          h-full`}
      >
        {/* Property image */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <MotionImage
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error('Image failed to load for property:', property.id, 'URL:', property.imageUrl);
              // Try to use a placeholder image
              e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80";
            }}
          />
          {/* Tags container */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {property.featured && (
              <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center border border-white/30">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
                Препоръчан
              </div>
            )}
            {(property.exclusive || property.is_exclusive) && (
              <div className="bg-red-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center border border-red-500/30">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white"></span>
                Ексклузивен
              </div>
            )}
          </div>
          {property.featured && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#E42B57]/10 to-transparent opacity-60 mix-blend-overlay"></div>
          )}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#E42B57] px-3 py-1.5 rounded-full font-semibold shadow-lg">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Property details */}
        <div className="p-5">
          <h3 
            className={`text-xl font-semibold mb-2.5 hover:text-[#E42B57] transition-colors transition-opacity duration-300 ${isIntersecting ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.1s' }}
          >
            {property.title}
          </h3>
          
          <div 
            className={`flex items-center text-neutral mb-2.5 transition-opacity duration-300 ${isIntersecting ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <MapPin className="h-4 w-4 mr-1.5 text-[#E42B57]/80" />
            <span>{property.location}, {property.city}</span>
          </div>

          <p 
            className={`text-neutral-dark mb-5 line-clamp-2 transition-opacity duration-300 ${isIntersecting ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.3s' }}
          >
            {property.description}
          </p>

          {/* Property features */}
          <div className={`grid grid-cols-3 gap-3 bg-gray-50/80 p-3 rounded-xl transition-opacity duration-300 ${isIntersecting ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.4s' }}
          >
            {property.bedrooms > 0 && (
              <div className="flex items-center text-sm">
                <Bed className="h-4 w-4 mr-1.5 text-primary" />
                <span>{property.bedrooms}-СТАЕН</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center text-sm">
                <Bath className="h-4 w-4 mr-1.5 text-primary" />
                <span>{property.bathrooms} Бани</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Maximize className="h-4 w-4 mr-1.5 text-primary" />
              <span>{property.area} m²</span>
            </div>
          </div>
          
          {/* Agent badge (if available) */}
          {agent && (
            <div 
              className={`mt-4 flex items-center border-t border-gray-100 pt-4 transition-opacity duration-300 ${isIntersecting ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '0.5s' }}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                {agent.image_url ? (
                  <img 
                    src={agent.image_url} 
                    alt={agent.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-2.5 text-xs">
                <p className="font-semibold text-primary">{agent.name}</p>
                <p className="text-neutral">{agent.position}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
