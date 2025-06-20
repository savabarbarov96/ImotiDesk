import { Property } from '@/data/properties';

// Define the Supabase Property type based on the database schema
export interface SupabaseProperty {
  id: string;
  title: string;
  description: string | null;
  price: number;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string;
  city: string;
  property_type: string;
  listing_type: string;
  is_featured: boolean | null;
  is_published: boolean | null;
  is_exclusive?: boolean | null;
  created_at: string | null;
  agent_id: string | null;
  virtual_tour_url: string | null;
  latitude: number | null;
  longitude: number | null;
  owner_id?: string | null;
  images?: string[] | null;
}

// Define the filter state
export interface FilterState {
  listingType: string;
  propertyType: string;
  city: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
}

export interface PropertiesListProps {
  initialFilters?: FilterState;
}
