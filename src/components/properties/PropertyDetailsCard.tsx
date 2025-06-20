import React from 'react';
import { Bed, Bath, Maximize, Video, Home, CheckCircle, Building } from 'lucide-react';
import { Property } from '@/data/properties';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PropertyDetailsCardProps {
  property: Property;
}

// Helper function to extract YouTube video ID from various YouTube URL formats
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Regular expression to extract video ID from different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ property }) => {
  // Extract YouTube video ID if a virtual tour URL is available
  const videoId = property.virtual_tour_url ? getYouTubeVideoId(property.virtual_tour_url) : null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Детайли за имота</h2>
      </CardHeader>
      <CardContent>
        {/* Virtual Tour */}
        {videoId && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Video className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="font-medium">Виртуална обиколка</h3>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}`} 
                title="Виртуална обиколка"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <Separator className="my-6" />
          </div>
        )}

        {/* Consolidated Characteristics with Icons */}
        <div>
          <h3 className="font-medium mb-4">Характеристики</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
              <Home className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <span className="font-medium text-gray-900">Тип имот</span>
                <p className="text-gray-600 text-sm">{property.propertyType}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
              <Building className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">Град</span>
                <p className="text-gray-600 text-sm">{property.city}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
              <CheckCircle className="h-5 w-5 mr-3 text-emerald-600" />
              <div>
                <span className="font-medium text-gray-900">Статус</span>
                <p className="text-gray-600 text-sm">{property.status === 'available' ? 'Наличен' : 'Продаден'}</p>
              </div>
            </div>
            
            {property.bedrooms > 0 && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <Bed className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <span className="font-medium text-gray-900">Стаи</span>
                  <p className="text-gray-600 text-sm">{property.bedrooms}</p>
                </div>
              </div>
            )}
            
            {property.bathrooms > 0 && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <Bath className="h-5 w-5 mr-3 text-cyan-600" />
                <div>
                  <span className="font-medium text-gray-900">Бани</span>
                  <p className="text-gray-600 text-sm">{property.bathrooms}</p>
                </div>
              </div>
            )}
            
            {property.area && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <Maximize className="h-5 w-5 mr-3 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Площ</span>
                  <p className="text-gray-600 text-sm">{property.area} м²</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Description */}
        <div>
          <h3 className="font-medium mb-2">Описание</h3>
          <p className="text-neutral-dark whitespace-pre-line">
            {property.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsCard;
