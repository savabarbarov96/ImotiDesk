"use client";import React, { useState, useEffect } from "react";import { HeroParallax, fallbackProducts } from "./hero-parallax";import { supabase } from "@/integrations/supabase/client";import { getPropertyImages } from '@/utils/storageHelpers';

interface DbProperty {
  id: string;
  title: string;
  price: number;
  property_type: string;
  is_featured: boolean | null;
  is_exclusive: boolean | null;
}

export function HeroParallaxDemo() {
  const [dbProducts, setDbProducts] = useState<{ title: string; link: string; thumbnail: string; is_featured?: boolean; is_exclusive?: boolean; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        // Fetch properties from database
        const { data, error } = await supabase
          .from('imotidesk_properties')
          .select('id, title, price, property_type, is_featured, is_exclusive')
          .eq('is_published', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching properties:', error);
          setDbProducts([]);
          setLoading(false);
          return;
        }

        // Process properties and get their images
        const processed = await Promise.all(
          (data || []).map(async (property: any) => {
            let thumbnailUrl = '';
            
            // Get property images
            try {
              const images = await getPropertyImages(property.id);
              thumbnailUrl = images.length > 0 ? images[0] : `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}`; 
            } catch (err) {
              console.error(`Error fetching images for property ${property.id}:`, err);
              thumbnailUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}`;
            }

            return {
              title: property.title,
              link: `/properties/${property.id}`,
              thumbnail: thumbnailUrl,
              is_featured: property.is_featured || false,
              is_exclusive: property.is_exclusive || false,
            };
          })
        );
        
        setDbProducts(processed);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchProperties:', err);
        setDbProducts([]);
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Determine what products to use - prioritize featured properties from DB
  const productsToUse = dbProducts.length > 0 ? 
    // If we have some featured properties from DB but not 3, combine with fallback featured products
    (dbProducts.length < 3 ? 
      [...dbProducts, ...fallbackProducts.filter(p => p.is_featured).slice(0, 3 - dbProducts.length)] 
      : dbProducts.slice(0, 3)) 
    : fallbackProducts.filter(p => p.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="absolute top-0 left-0 w-full h-full">
        {!loading && <HeroParallax products={productsToUse} />}
      </div>
    </div>
  );
}

 