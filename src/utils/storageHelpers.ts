import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads files to Supabase storage
 */
export async function uploadFilesToStorage(
  bucketName: string, 
  folderPath: string, 
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folderPath}${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    urls.push(publicUrl);
  }

  return urls;
}

/**
 * Gets all images from a specific folder in storage
 */
export async function getImagesFromFolder(
  bucketName: string, 
  folderPath: string
): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath, {
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('Error fetching images:', error);
    return [];
  }

  // Filter for image files only
  const imageFiles = data ? data.filter(item => 
    !item.id.endsWith('/') && 
    (item.metadata?.mimetype?.startsWith('image/') || 
     item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
  ) : [];

  // Get URLs for each image
  const urls = imageFiles.map(file => {
    const filePath = folderPath.endsWith('/') ? folderPath + file.name : folderPath + '/' + file.name;
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return urls;
}

/**
 * Gets all property images for a specific property
 */
export async function getPropertyImages(propertyId: string): Promise<string[]> {
  console.log(`Getting images for property ${propertyId}...`);
  
  // First check the database for stored image URLs
  try {
    const { data: property, error: dbError } = await supabase
      .from('imotidesk_properties')
      .select('images')
      .eq('id', propertyId)
      .single();
    
    if (!dbError && property && property.images && Array.isArray(property.images) && property.images.length > 0) {
      console.log(`Found ${property.images.length} images in database for property ${propertyId}:`, property.images);
      
      // Verify that the URLs are still valid by checking if they're accessible
      const validImages = property.images.filter(url => {
        try {
          new URL(url);
          return true;
        } catch {
          console.warn(`Invalid URL found in database: ${url}`);
          return false;
        }
      });
      
      if (validImages.length > 0) {
        console.log(`Returning ${validImages.length} valid images from database for property ${propertyId}`);
        return validImages;
      }
    }
  } catch (error) {
    console.error('Error fetching images from database:', error);
  }
  
  // If no images found in database, try the storage structure (fallback)
  console.log(`No images found in database for property ${propertyId}, trying storage...`);
  
  // First try the new structure (trendimo bucket with property_media folder)
  const newFolderPath = `property_media/${propertyId}/`;
  console.log(`Trying new structure: trendimo bucket, folder: ${newFolderPath}`);
  let images = await getImagesFromFolder('trendimo', newFolderPath);
  console.log(`Found ${images.length} images in new structure:`, images);
  
  // If no images found in new structure, try the old structure (property_images bucket)
  if (images.length === 0) {
    console.log(`No images in new structure, trying old structure: property_images bucket`);
    images = await getImagesFromFolder('property_images', '');
    console.log(`Found ${images.length} images in old structure before filtering:`, images);
    // Filter images that might belong to this property (if they contain the property ID in filename)
    images = images.filter(url => url.includes(propertyId));
    console.log(`Found ${images.length} images in old structure after filtering:`, images);
  }
  
  // Ensure URLs are properly formatted and accessible
  const validImages = images.filter(url => {
    try {
      new URL(url);
      return true;
    } catch {
      console.warn(`Invalid URL found: ${url}`);
      return false;
    }
  });
  
  console.log(`Final valid images for property ${propertyId}:`, validImages);
  return validImages;
}

/**
 * Deletes a file from storage
 */
export async function deleteFileFromStorage(
  bucketName: string,
  filePath: string
): Promise<boolean> {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
}

/**
 * Moves images from temporary folder to final property folder
 */
export async function movePropertyImages(
  temporaryId: string,
  propertyId: string
): Promise<string[]> {
  const tempFolderPath = `property_media/${temporaryId}/`;
  const finalFolderPath = `property_media/${propertyId}/`;
  
  try {
    // Get all files from temporary folder
    const { data: files, error: listError } = await supabase.storage
      .from('trendimo')
      .list(tempFolderPath);

    if (listError) {
      console.error('Error listing temporary files:', listError);
      return [];
    }

    if (!files || files.length === 0) {
      return [];
    }

    const newUrls: string[] = [];

    // Move each file to the final folder
    for (const file of files) {
      if (file.name && !file.name.endsWith('/')) {
        const oldPath = `${tempFolderPath}${file.name}`;
        const newPath = `${finalFolderPath}${file.name}`;

        // Copy file to new location
        const { error: moveError } = await supabase.storage
          .from('trendimo')
          .move(oldPath, newPath);

        if (moveError) {
          console.error('Error moving file:', moveError);
          continue;
        }

        // Get the new public URL
        const { data: { publicUrl } } = supabase.storage
          .from('trendimo')
          .getPublicUrl(newPath);

        newUrls.push(publicUrl);
      }
    }

    return newUrls;
  } catch (error) {
    console.error('Error moving property images:', error);
    return [];
  }
}

/**
 * Fixes existing properties that have images in temporary folders
 * by moving them to proper property folders and updating the database
 */
export async function fixPropertyImagesInTempFolders(): Promise<void> {
  console.log('Starting to fix properties with images in temp folders...');
  
  try {
    // Get all properties that have images with temp folder paths
    const { data: properties, error: fetchError } = await supabase
      .from('imotidesk_properties')
      .select('id, title, images')
      .not('images', 'is', null);

    if (fetchError) {
      console.error('Error fetching properties:', fetchError);
      return;
    }

    if (!properties || properties.length === 0) {
      console.log('No properties found with images');
      return;
    }

    console.log(`Found ${properties.length} properties with images, checking for temp folders...`);

    for (const property of properties) {
      if (!property.images || !Array.isArray(property.images) || property.images.length === 0) {
        continue;
      }

      // Check if any images are in temp folders
      const tempImages = property.images.filter(url => 
        typeof url === 'string' && url.includes('/temp_')
      );

      if (tempImages.length === 0) {
        console.log(`Property ${property.id} (${property.title}) - images are already in correct location`);
        continue;
      }

      console.log(`Property ${property.id} (${property.title}) - found ${tempImages.length} images in temp folders`);

      // Extract temp folder ID from the first temp image
      const tempImage = tempImages[0];
      const tempFolderMatch = tempImage.match(/property_media\/(temp_[^\/]+)\//);
      
      if (!tempFolderMatch) {
        console.log(`Could not extract temp folder ID from ${tempImage}`);
        continue;
      }

      const tempFolderId = tempFolderMatch[1];
      console.log(`Moving images from temp folder ${tempFolderId} to property folder ${property.id}`);

      try {
        // Move images from temp folder to property folder
        const movedImageUrls = await movePropertyImages(tempFolderId, property.id);
        
        if (movedImageUrls.length > 0) {
          // Update the property with the new image URLs
          const { error: updateError } = await supabase
            .from('imotidesk_properties')
            .update({ images: movedImageUrls })
            .eq('id', property.id);

          if (updateError) {
            console.error(`Error updating property ${property.id}:`, updateError);
          } else {
            console.log(`Successfully moved ${movedImageUrls.length} images for property ${property.id}`);
          }
        } else {
          console.log(`No images were moved for property ${property.id}`);
        }
      } catch (moveError) {
        console.error(`Error moving images for property ${property.id}:`, moveError);
      }
    }

    console.log('Finished fixing properties with images in temp folders');
  } catch (error) {
    console.error('Error in fixPropertyImagesInTempFolders:', error);
  }
}
