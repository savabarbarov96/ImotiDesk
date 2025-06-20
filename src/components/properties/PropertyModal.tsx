import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin, Bed, Bath, Maximize, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePropertyMapper, useAgent } from './usePropertyMapper';
import { Property, formatPrice } from '@/data/properties';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';

interface PropertyModalProps {
  propertyId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ 
  propertyId, 
  isOpen, 
  onOpenChange 
}) => {
  const { mapSupabasePropertyToProperty } = usePropertyMapper();
  const navigate = useNavigate();
  
  // Fetch property data
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property-modal', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      
      const { data, error } = await supabase
        .from('imotidesk_properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }
      
      if (!data) throw new Error('Property not found');
      
      return await mapSupabasePropertyToProperty(data);
    },
    enabled: !!propertyId && isOpen,
  });

  // Fetch agent data
  const { data: agent } = useAgent(property?.agent?.id || null);

  const handleCallAgent = () => {
    if (agent?.phone_number) {
      window.location.href = `tel:${agent.phone_number}`;
    } else {
      toast.success("Свързваме Ви с нашия агент");
      onOpenChange(false); // Close the modal
      navigate('/about'); // Navigate to the about page
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="py-10 text-center">
            <p className="text-red-500">Failed to load property details.</p>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
        
        {property && !isLoading && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
              <DialogDescription className="flex items-center text-base mt-2">
                <MapPin className="h-4 w-4 mr-1 text-primary" />
                <span>{property.location}, {property.city}</span>
              </DialogDescription>
            </DialogHeader>

            {/* Main image */}
            <div className="relative aspect-video overflow-hidden rounded-md mt-4">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                className="object-cover w-full h-full" 
              />
              <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full font-semibold">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Property basic info */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {property.bedrooms > 0 && (
                <div className="flex flex-col items-center">
                  <Bed className="h-5 w-5 text-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Стаи</span>
                  <span className="font-medium">{property.bedrooms}-СТАЕН</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex flex-col items-center">
                  <Bath className="h-5 w-5 text-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Бани</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
              <div className="flex flex-col items-center">
                <Maximize className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Площ</span>
                <span className="font-medium">{property.area} кв.м</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Property description */}
            <div>
              <h3 className="font-medium mb-2">Описание</h3>
              <p className="text-neutral-dark text-sm">{property.description}</p>
            </div>

            <Separator className="my-4" />

            {/* Property features */}
            <div>
              <h3 className="font-medium mb-2">Характеристики</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Тип имот: {property.propertyType}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Град: {property.city}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Локация: {property.location}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Статус: {property.status}</span>
                </div>
              </div>
            </div>

            {/* Agent info */}
            {agent && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-medium mb-2">Агент</h3>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                      {agent.image_url ? (
                        <img 
                          src={agent.image_url} 
                          alt={agent.name}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {agent.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-primary">{agent.name}</p>
                      <p className="text-sm text-neutral-dark">{agent.position}</p>
                      {agent.phone_number && (
                        <p className="text-sm text-primary mt-1">{agent.phone_number}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="mr-2"
              >
                Затвори
              </Button>
              <Button 
                className="flex items-center" 
                onClick={handleCallAgent}
              >
                <Phone className="h-4 w-4 mr-2" />
                Свържи се с агент
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal; 