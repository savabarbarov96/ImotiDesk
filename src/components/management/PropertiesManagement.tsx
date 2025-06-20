import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/auth/use-user';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  useProperties, 
  useUpdateProperty, 
  useDeleteProperty,
  useTogglePropertyFeatured,
  useTogglePropertyPublished,
  type Property, 
  type PropertyFormData
} from '@/hooks/use-properties';
import { TeamMember } from '@/integrations/supabase/types';
import PropertyGrid from './properties/PropertyGrid';
import PropertyDialog from './properties/PropertyDialog';
import DeleteConfirmationDialog from './properties/DeleteConfirmationDialog';
import { propertyTypes } from '@/data/content';

const PropertiesManagement = () => {
  const { toast } = useToast();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { data: properties, isLoading, error } = useProperties(user?.id, user?.role);

  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const toggleFeatured = useTogglePropertyFeatured();
  const togglePublished = useTogglePropertyPublished();


  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    title: '',
    description: '',
    price: 0,
    address: '',
    city: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    property_type: propertyTypes[0],
    listing_type: 'sale',
    is_featured: false,
    is_published: true,
    is_exclusive: false,
    images: [],
    agent_id: '',
    virtual_tour_url: '',
    latitude: null,
    longitude: null
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [tempId] = useState<string>(`temp_${Date.now()}`);

  // Fetch team members (agents)
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoadingTeamMembers(true);
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        setTeamMembers(data || []);
      } catch (err) {
        console.error('Error fetching team members:', err);
        toast({
          title: 'Грешка при зареждане на екипа',
          description: 'Не можахме да заредим списъка с агенти.',
          variant: 'destructive'
        });
      } finally {
        setLoadingTeamMembers(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numericValue = value === '' ? 0 : parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numericValue) ? 0 : numericValue
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  // Handle direct value changes (like location)
  const handleValueChange = (name: string, value: string | number | boolean | null) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      address: '',
      city: '',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      property_type: propertyTypes[0],
      listing_type: 'sale',
      is_featured: false,
      is_published: true,
      is_exclusive: false,
      images: [],
      agent_id: '',
      virtual_tour_url: '',
      latitude: null,
      longitude: null
    });
    setUploadedImages([]);
  };



  // Close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentProperty(null);
    resetForm();
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentProperty(null);
  };

  // Navigate to edit page
  const handleEditClick = (property: Property) => {
    navigate(`/management/edit-property/${property.id}`);
  };

  // Open delete dialog
  const handleDeleteClick = (property: Property) => {
    setCurrentProperty(property);
    setIsDeleteDialogOpen(true);
  };

  // Handle image upload
  const handleImageUpload = (urls: string[], files: File[]) => {
    setUploadedImages([...uploadedImages, ...urls]);
    setFormData(prev => ({
      ...prev,
      images: [...uploadedImages, ...urls]
    }));
  };

  // Handle image delete
  const handleImageDelete = async (url: string) => {
    try {
      // Remove the image from the uploadedImages array
      const updatedImages = uploadedImages.filter(image => image !== url);
      setUploadedImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));

      // If we're editing a property, update it in the database
      if (currentProperty) {
        await updateProperty.mutateAsync({
          id: currentProperty.id,
          property: {
            images: updatedImages
          }
        });

        // Extract the filename from the URL
        const filename = url.split('/').pop();
        if (filename) {
          // Delete the file from storage
          const { error: deleteError } = await supabase.storage
            .from('trendimo')
            .remove([`property_media/${currentProperty.id}/${filename}`]);

          if (deleteError) {
            throw deleteError;
          }
        }

        toast({
          title: "Снимката е изтрита успешно!",
          description: "Промените бяха запазени.",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Грешка при изтриване на снимката",
        description: error instanceof Error ? error.message : "Неочаквана грешка",
        variant: "destructive",
      });
    }
  };



  // Handle update property
  const handleUpdateProperty = () => {
    if (!currentProperty) return;
    
    updateProperty.mutate({
      id: currentProperty.id,
      property: formData
    }, {
      onSuccess: () => {
        toast({
          title: "Имотът е обновен успешно!",
          description: "Промените бяха запазени.",
        });
        setIsEditDialogOpen(false);
        setCurrentProperty(null);
        resetForm();
      },
      onError: (error) => {
        toast({
          title: "Грешка при обновяване на имота",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Handle delete property
  const handleDeleteProperty = () => {
    if (!currentProperty) return;
    
    deleteProperty.mutate(currentProperty.id, {
      onSuccess: () => {
        toast({
          title: "Имотът е изтрит успешно!",
          description: "Имотът беше премахнат от системата.",
        });
        setIsDeleteDialogOpen(false);
        setCurrentProperty(null);
      },
      onError: (error) => {
        toast({
          title: "Грешка при изтриване на имота",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Toggle featured status
  const handleToggleFeatured = (property: Property) => {
    const newFeaturedStatus = !(property.is_featured || false);
    toggleFeatured.mutate({
      id: property.id,
      isFeatured: newFeaturedStatus
    }, {
      onSuccess: () => {
        toast({
          title: newFeaturedStatus
            ? "Имотът е отбелязан като препоръчан" 
            : "Имотът вече не е препоръчан",
          description: newFeaturedStatus
            ? "Имотът ще се показва в секцията 'Препоръчани имоти'." 
            : "Имотът няма да се показва в секцията 'Препоръчани имоти'.",
        });
      },
      onError: (error) => {
        toast({
          title: "Грешка при промяна на статуса",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Toggle published status
  const handleTogglePublished = (property: Property) => {
    togglePublished.mutate({
      id: property.id,
      isPublished: !(property.is_published || false)
    }, {
      onSuccess: () => {
        toast({
          title: property.is_published 
            ? "Имотът е скрит" 
            : "Имотът е публикуван",
          description: property.is_published 
            ? "Имотът вече не е видим за потребителите." 
            : "Имотът вече е видим за потребителите.",
        });
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Всички имоти</h2>
      </div>

      <PropertyGrid
        properties={properties || []}
        teamMembers={teamMembers}
        isLoading={isLoading}
        error={error}
        onCreateClick={() => navigate('/management/add-property')}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onToggleFeatured={handleToggleFeatured}
        onTogglePublished={handleTogglePublished}
      />



      {/* Edit Property Dialog */}
      <PropertyDialog
        isOpen={isEditDialogOpen}
        title="Редактиране на имот"
        description="Актуализирайте информацията за имота. Кликнете върху 'Запази', когато сте готови."
        formData={formData}
        uploadedImages={uploadedImages}
        teamMembers={teamMembers}
        loadingTeamMembers={loadingTeamMembers}
        temporaryId={tempId}
        isEditing={true}
        currentProperty={currentProperty}
        isPending={updateProperty.isPending}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateProperty}
        onInputChange={handleInputChange}
        onCheckboxChange={(name, value) => {
          // For latitude and longitude, handle them as numeric values
          if (name === 'latitude' || name === 'longitude') {
            handleValueChange(name, value as unknown as number);
          } else {
            handleCheckboxChange(name, value as boolean);
          }
        }}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        property={currentProperty}
        isOpen={isDeleteDialogOpen}
        isPending={deleteProperty.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProperty}
      />
    </div>
  );
};

export default PropertiesManagement; 