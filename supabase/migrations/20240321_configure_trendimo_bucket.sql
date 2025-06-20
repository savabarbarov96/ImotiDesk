-- Configure trendimo storage bucket with proper settings
DO $$
BEGIN
  -- Update the trendimo bucket settings
  UPDATE storage.buckets
  SET public = true,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      file_size_limit = 5242880 -- 5MB in bytes
  WHERE name = 'trendimo';
END $$; 