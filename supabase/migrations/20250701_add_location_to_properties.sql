-- Add location columns to properties table
ALTER TABLE public.properties
ADD COLUMN latitude DECIMAL DEFAULT NULL,
ADD COLUMN longitude DECIMAL DEFAULT NULL;

-- Add comment to describe the latitude field
COMMENT ON COLUMN public.properties.latitude IS 'Latitude coordinate of the property location';

-- Add comment to describe the longitude field
COMMENT ON COLUMN public.properties.longitude IS 'Longitude coordinate of the property location'; 