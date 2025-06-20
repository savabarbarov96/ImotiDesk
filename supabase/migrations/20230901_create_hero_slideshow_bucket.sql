-- Migration to add hero_slideshow directory to the trendimo storage bucket
-- This just ensures the trendimo bucket exists if it doesn't already
DO $$
BEGIN
  -- Check if the 'trendimo' bucket already exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'trendimo'
  ) THEN
    -- Create the trendimo bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('trendimo', 'trendimo', true);
  END IF;
END $$; 