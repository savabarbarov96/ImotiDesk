import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProperty } from '@/components/properties/types';
import { usePropertyMapper } from '@/components/properties/usePropertyMapper';
import { useAuth } from '@/hooks/use-auth';
import { Property } from '@/data/properties';
import { trackPropertyView } from '@/hooks/use-analytics';

// Components
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PropertyCarousel } from '@/components/properties/PropertyCarousel';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

// Refactored components
import PropertyDetailHeader from '@/components/properties/PropertyDetailHeader';
import PropertyDetailsCard from '@/components/properties/PropertyDetailsCard';
import PropertyLocationCard from '@/components/properties/PropertyLocationCard';
import PropertyInquirySidebar from '@/components/properties/PropertyInquirySidebar';
import PropertySimilarListings from '@/components/properties/PropertySimilarListings';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { mapSupabasePropertyToProperty } = usePropertyMapper();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const [viewTracked, setViewTracked] = useState(false);
  
  // Fetch property data
  const { data: propertyData, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error('Property ID is required');
      
      const { data, error } = await supabase
        .from('imotidesk_properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Property not found');
      
      return data as SupabaseProperty;
    },
  });

  // Track property view
  useEffect(() => {
    const recordView = async () => {
      if (id && !viewTracked && !isLoading && !isPropertyLoading) {
        try {
          await trackPropertyView(id);
          setViewTracked(true);
        } catch (error) {
          console.error('Error tracking property view:', error);
        }
      }
    };

    recordView();
  }, [id, viewTracked, isLoading, isPropertyLoading]);

  // Fetch user role if user is logged in
  useEffect(() => {
    if (user?.id) {
      const fetchUserRole = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserRole(data.role);
        }
      };
      
      fetchUserRole();
    }
  }, [user]);
  
  // Map Supabase property to our application's Property type
  useEffect(() => {
    if (propertyData) {
      const loadProperty = async () => {
        try {
          setIsPropertyLoading(true);
          const mappedProperty = await mapSupabasePropertyToProperty(propertyData);
          setProperty(mappedProperty);
        } catch (error) {
          console.error('Error mapping property:', error);
          toast.error('Не можахме да заредим данните за имота');
        } finally {
          setIsPropertyLoading(false);
        }
      };
      
      loadProperty();
    }
  }, [propertyData, mapSupabasePropertyToProperty]);
  
  if (isLoading || isPropertyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
      </div>
    );
  }
  
  if (error && !isPropertyLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Грешка при зареждане на имота</h1>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : 'Не можахме да намерим данни за този имот'}
        </p>
        <Button asChild className="bg-gray-800 hover:bg-gray-900">
          <Link to="/properties"><ArrowLeft size={16} /> Обратно към имотите</Link>
        </Button>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
      </div>
    );
  }
  
  const isAgent = userRole === 'agent';
  
  // Format phone number for links
  const formatPhoneForLink = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/[^0-9+]/g, '');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Sticky header with back button and actions */}
        <PropertyDetailHeader property={property} isAgent={isAgent} />
        
        {/* Main content area with image gallery and unified details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Left column with property details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced image carousel */}
            <Card className="p-0 overflow-hidden shadow-sm border border-gray-200">
              {property && <PropertyCarousel images={property.images} />}
            </Card>
            
            {/* Unified property information sections */}
            <div className="space-y-8">
              {/* Property Details Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                  Детайли за имота
                </h2>
                <PropertyDetailsCard property={property} />
              </div>
              

              
              {/* Location Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                  Локация
                </h2>
                <PropertyLocationCard 
                  address={property.address} 
                  location={property.location} 
                  city={property.city} 
                  latitude={property.latitude}
                  longitude={property.longitude}
                />
              </div>
            </div>
          </div>
          
          {/* Right column with inquiry form */}
          <div>
            <PropertyInquirySidebar 
              propertyId={property.id.toString()}
              propertyTitle={property.title} 
              agent={property.agent}
              formatPhoneForLink={formatPhoneForLink}
            />
          </div>
        </div>
        
        {/* Similar Properties section */}
        <div className="mt-16 bg-gray-100 py-10 px-6 rounded-xl border border-gray-200">
          <PropertySimilarListings 
            propertyId={parseInt(property.id.toString())} 
            location={property.location}
            city={property.city}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
