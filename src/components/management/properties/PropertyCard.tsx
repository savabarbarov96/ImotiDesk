import React, { useEffect, useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff,
  ChevronDown,
  Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/hooks/use-properties';
import { TeamMember } from '@/integrations/supabase/types';
import { formatPrice } from '@/data/properties';
import { supabase } from '@/integrations/supabase/client';
import { getPropertyImages } from '@/utils/storageHelpers';

interface PropertyCardProps {
  property: Property;
  teamMembers: TeamMember[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onToggleFeatured: (property: Property) => void;
  onTogglePublished: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  teamMembers,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished
}) => {
  const [propertyImage, setPropertyImage] = useState<string | null>(null);
  
  // Get the correct image URL directly from storage
  useEffect(() => {
    const loadImage = async () => {
      if (property.id) {
        try {
          const images = await getPropertyImages(property.id);
          if (images && images.length > 0) {
            setPropertyImage(images[0]);
          } else if (property.images && property.images.length > 0) {
            // Fallback to the property's images array
            setPropertyImage(property.images[0]);
          }
        } catch (error) {
          console.error('Error loading property image:', error);
          // Fallback to the property's images array
          if (property.images && property.images.length > 0) {
            setPropertyImage(property.images[0]);
          }
        }
      }
    };
    
    loadImage();
  }, [property.id, property.images]);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-3 border-b space-y-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2">
            {property.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(property)}>
                <Edit size={14} className="mr-2" />
                Редактирай
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFeatured(property)}>
                <Star size={14} className="mr-2" fill={property.is_featured ? "currentColor" : "none"} />
                {property.is_featured ? "Премахни от препоръчани" : "Добави в препоръчани"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePublished(property)}>
                {property.is_published ? (
                  <>
                    <EyeOff size={14} className="mr-2" />
                    Скрий имота
                  </>
                ) : (
                  <>
                    <Eye size={14} className="mr-2" />
                    Публикувай имота
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(property)} className="text-red-600">
                <Trash2 size={14} className="mr-2" />
                Изтрий
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex flex-wrap gap-1.5">
          <Badge variant={property.is_published ? "default" : "outline"} className="text-xs">
            {property.is_published ? "Публикуван" : "Скрит"}
          </Badge>
          {property.is_featured && (
            <Badge variant="secondary" className="text-xs">
              <Star size={10} className="mr-1" />
              Препоръчан
            </Badge>
          )}
          {property.is_exclusive && (
            <Badge variant="destructive" className="text-xs">
              Ексклузивен
            </Badge>
          )}
          <Badge variant="outline" className="capitalize text-xs">
            {property.listing_type === 'sale' ? 'Продажба' : 'Наем'}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-3 space-y-3">
        {(propertyImage || (property.images && property.images.length > 0)) && (
          <div className="aspect-[4/3] overflow-hidden rounded-md">
            <img 
              src={propertyImage || property.images![0]} 
              alt={property.title}
              className="h-full w-full object-cover" 
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded-md space-y-2">
            <h3 className="font-medium text-gray-700 text-xs uppercase">Основни данни</h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Цена:</span>
                <span className="font-medium">{formatPrice(property.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Тип:</span>
                <span>{property.property_type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Локация:</span>
                <span>{property.city}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-md space-y-2">
            <h3 className="font-medium text-gray-700 text-xs uppercase">Детайли</h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Площ:</span>
                <span>{property.area} м²</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Стаи:</span>
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Бани:</span>
                <span>{property.bathrooms}</span>
              </div>
            </div>
          </div>
        </div>
        
        {property.agent_id && (
          <div className="bg-blue-50 p-2 rounded-md">
            <h3 className="font-medium text-gray-700 text-xs uppercase mb-1">Отговорен агент</h3>
            <div className="text-sm">
              {teamMembers.find(m => m.id === property.agent_id)?.name || 'Неизвестен агент'}
            </div>
          </div>
        )}
        
        {property.virtual_tour_url && (
          <a
            href={property.virtual_tour_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 w-full justify-center text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            <Youtube className="h-4 w-4 mr-1.5" />
            Виртуална обиколка
          </a>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-3 px-3 border-t mt-auto">
        <div className="text-xs text-muted-foreground">
          Създаден на: {new Date(property.created_at || '').toLocaleDateString('bg-BG')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard; 