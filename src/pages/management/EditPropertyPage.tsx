import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Save, Upload, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/hooks/auth/use-user';
import { useUpdateProperty, type PropertyFormData, type Property } from '@/hooks/use-properties';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/integrations/supabase/types';
import { cities, propertyTypes, sofiaSubDistricts } from '@/data/content';
import MapPicker from '@/components/management/properties/MapPicker';
import ImageUploader from '@/components/ImageUploader';

const EditPropertyPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user } = useUser();
  const updateProperty = useUpdateProperty();

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    title: '',
    description: '',
    price: 0,
    address: '',
    city: '',
    sub_district: '',
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setIsLoadingProperty(true);
      try {
        const { data, error } = await supabase
          .from('imotidesk_properties')
          .select('*, agent:team_members(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const propertyData = data as Property;
        setProperty(propertyData);
        
        // Set form data
        setFormData({
          title: propertyData.title,
          description: propertyData.description || '',
          price: propertyData.price,
          address: propertyData.address,
          city: propertyData.city,
          sub_district: propertyData.sub_district || '',
          bedrooms: propertyData.bedrooms || 0,
          bathrooms: propertyData.bathrooms || 0,
          area: propertyData.area || 0,
          property_type: propertyData.property_type,
          listing_type: propertyData.listing_type,
          is_featured: propertyData.is_featured || false,
          is_published: propertyData.is_published || true,
          is_exclusive: propertyData.is_exclusive || false,
          images: propertyData.images || [],
          agent_id: propertyData.agent_id || '',
          virtual_tour_url: propertyData.virtual_tour_url || '',
          latitude: propertyData.latitude,
          longitude: propertyData.longitude
        });
        setUploadedImages(propertyData.images || []);
      } catch (err) {
        console.error('Error fetching property:', err);
        toast({
          title: 'Грешка при зареждане',
          description: 'Не можахме да заредим данните за имота.',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  // Generate dynamic title based on selections
  const generateTitle = (city: string, subDistrict: string, propertyType: string) => {
    let title = '';
    
    if (propertyType) {
      title += propertyType;
    }
    
    if (city) {
      title += title ? ` в ${city}` : city;
    }
    
    if (subDistrict && city === 'София') {
      title += `, ${subDistrict}`;
    }
    
    return title;
  };

  // Update title when city, sub_district, or property_type changes
  useEffect(() => {
    const newTitle = generateTitle(
      formData.city || '',
      formData.sub_district || '',
      formData.property_type || ''
    );
    
    if (newTitle && newTitle !== formData.title) {
      setFormData(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  }, [formData.city, formData.sub_district, formData.property_type]);

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
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (urls: string[], files: File[]) => {
    console.log('Images uploaded:', urls); // Debug log
    console.log('Files uploaded:', files); // Debug log
    console.log('Current uploaded images:', uploadedImages); // Debug log
    
    if (!urls || urls.length === 0) {
      console.error('No URLs received from image upload');
      toast({
        title: 'Грешка при качване',
        description: 'Не получихме URL адреси за качените снимки.',
        variant: 'destructive'
      });
      return;
    }
    
    const newImages = [...uploadedImages, ...urls];
    console.log('New images array:', newImages); // Debug log
    setUploadedImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    toast({
      title: 'Успешно качване',
      description: `${urls.length} снимка${urls.length > 1 ? 'и' : ''} бяха качени успешно.`,
    });
  };

  // Handle image deletion
  const handleImageDelete = async (url: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `property_media/${id}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('trendimo')
        .remove([filePath]);
      
      if (error) {
        console.error('Error deleting from storage:', error);
        // Continue with local removal even if storage deletion fails
      }

      const updatedImages = uploadedImages.filter(img => img !== url);
      setUploadedImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));
      
      toast({
        title: 'Снимката беше изтрита',
        description: 'Снимката беше премахната успешно.',
      });
    } catch (err) {
      console.error('Error deleting image:', err);
      toast({
        title: 'Грешка при изтриване',
        description: 'Не можахме да изтрием снимката.',
        variant: 'destructive'
      });
    }
  };

  // Handle location selection
  const handleLocationChange = (latitude: number, longitude: number) => {
    setFormData(prev => ({
      ...prev,
      latitude,
      longitude
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.address || !formData.city || !formData.property_type) {
      toast({
        title: 'Моля попълнете всички задължителни полета',
        variant: 'destructive'
      });
      return;
    }

    if (!id) {
      toast({
        title: 'Грешка',
        description: 'Не можем да намерим ID на имота.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data with proper null handling for UUID fields
      const propertyData = {
        ...formData,
        images: uploadedImages,
        // Convert empty string to null for UUID fields
        agent_id: formData.agent_id && formData.agent_id.trim() !== '' ? formData.agent_id : null,
      };

      await updateProperty.mutateAsync({ 
        id, 
        property: propertyData as Partial<PropertyFormData> 
      });

      toast({
        title: 'Успешно обновяване',
        description: 'Имотът беше обновен успешно.',
      });

      navigate('/management?section=properties');
    } catch (err) {
      console.error('Error updating property:', err);
      toast({
        title: 'Грешка при обновяване',
        description: 'Възникна грешка при обновяването на имота.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSofia = formData.city === 'София';

  if (isLoadingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Зареждане на имота...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Имотът не беше намерен</h1>
          <Button onClick={() => navigate('/management?section=properties')}>
            Назад към имоти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Редактиране на имот | Automation Aid</title>
      </Helmet>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/management?section=properties')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад към имоти
              </Button>
              <div className="border-l border-gray-300 h-6" />
              <h1 className="text-xl font-semibold text-gray-900">Редактиране на имот</h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Запазване...' : 'Запази промените'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основна информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Заглавие *</Label>
                    <Input
                      id="title"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Заглавието се генерира автоматично"
                      className="bg-gray-50"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Заглавието се генерира автоматично въз основа на избрания град, район и вид имот
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Подробно описание на имота"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="property_type">Вид на имота *</Label>
                      <Select
                        value={formData.property_type || ''}
                        onValueChange={(value) => handleInputChange('property_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Изберете вид имот" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="listing_type">Тип обява *</Label>
                      <Select
                        value={formData.listing_type || 'sale'}
                        onValueChange={(value) => handleInputChange('listing_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">Продажба</SelectItem>
                          <SelectItem value="rent">Наем</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price">Цена (лв.) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Местоположение</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Адрес *</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Пълен адрес на имота"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Град *</Label>
                      <Select
                        value={formData.city || ''}
                        onValueChange={(value) => {
                          handleInputChange('city', value);
                          // Reset sub_district when city changes
                          if (value !== 'София') {
                            handleInputChange('sub_district', '');
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Изберете град" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {isSofia && (
                      <div>
                        <Label htmlFor="sub_district">Под район</Label>
                        <Select
                          value={formData.sub_district || ''}
                          onValueChange={(value) => handleInputChange('sub_district', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете под район" />
                          </SelectTrigger>
                          <SelectContent>
                            {sofiaSubDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Местоположение на картата
                    </Label>
                    <div className="mt-2">
                      <MapPicker
                        latitude={formData.latitude}
                        longitude={formData.longitude}
                        onChange={handleLocationChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Характеристики</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="area">Площ (кв.м)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area || ''}
                        onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bedrooms">Спални</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms || ''}
                        onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Бани</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms || ''}
                        onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Снимки на имота</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    bucketName="trendimo"
                    folderPath={`property_media/${id}/`}
                    onUploadComplete={handleImageUpload}
                    maxFiles={10}
                    watermarkPath="/assets/trendimo-white.png"
                    watermarkOptions={{
                      opacity: 0.4,
                      widthPercentage: 60
                    }}
                  />
                  {uploadedImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Качени снимки ({uploadedImages.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Property ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                console.error('Image failed to load:', url);
                                e.currentTarget.src = '/assets/placeholder-image.png';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleImageDelete(url)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки на обявата</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="agent_id">Отговорен агент</Label>
                    <Select
                      value={formData.agent_id || ''}
                      onValueChange={(value) => handleInputChange('agent_id', value)}
                      disabled={loadingTeamMembers}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Изберете агент" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="virtual_tour_url">Виртуална разходка (URL)</Label>
                    <Input
                      id="virtual_tour_url"
                      type="url"
                      value={formData.virtual_tour_url || ''}
                      onChange={(e) => handleInputChange('virtual_tour_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_featured"
                        checked={formData.is_featured || false}
                        onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                      />
                      <Label htmlFor="is_featured">Препоръчан имот</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_exclusive"
                        checked={formData.is_exclusive || false}
                        onCheckedChange={(checked) => handleInputChange('is_exclusive', checked)}
                      />
                      <Label htmlFor="is_exclusive">Ексклузивен имот</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_published"
                        checked={formData.is_published ?? true}
                        onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                      />
                      <Label htmlFor="is_published">Публикуван</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Запазване...' : 'Запази промените'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/management?section=properties')}
                  >
                    Отказ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage; 