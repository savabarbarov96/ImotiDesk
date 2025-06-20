import React, { useState } from 'react';
import { Plus, RefreshCw, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/hooks/use-properties';
import { TeamMember } from '@/integrations/supabase/types';
import PropertyCard from './PropertyCard';
import { fixPropertyImagesInTempFolders } from '@/utils/storageHelpers';
import { toast } from '@/hooks/use-toast';

interface PropertyGridProps {
  properties: Property[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: Error | null;
  onCreateClick: () => void;
  onEditClick: (property: Property) => void;
  onDeleteClick: (property: Property) => void;
  onToggleFeatured: (property: Property) => void;
  onTogglePublished: (property: Property) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  teamMembers,
  isLoading,
  error,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onToggleFeatured,
  onTogglePublished
}) => {
  const [isFixingImages, setIsFixingImages] = useState(false);

  const handleFixImages = async () => {
    setIsFixingImages(true);
    try {
      await fixPropertyImagesInTempFolders();
      toast({
        title: 'Изображенията са поправени',
        description: 'Всички изображения в временни папки са преместени в правилните места.',
      });
      // Refresh the page to see the changes
      window.location.reload();
    } catch (error) {
      console.error('Error fixing images:', error);
      toast({
        title: 'Грешка при поправянето',
        description: 'Възникна грешка при преместването на изображенията.',
        variant: 'destructive'
      });
    } finally {
      setIsFixingImages(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Грешка при зареждане на имотите: {error.message}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Все още нямате добавени имоти</p>
        <Button 
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Добавете първия имот</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Всички имоти ({properties.length})</h2>
        <Button
          onClick={handleFixImages}
          disabled={isFixingImages}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isFixingImages ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wrench className="w-4 h-4" />
          )}
          {isFixingImages ? 'Поправя изображения...' : 'Поправи изображения'}
        </Button>
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Добави имот</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            teamMembers={teamMembers}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
            onToggleFeatured={onToggleFeatured}
            onTogglePublished={onTogglePublished}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid; 