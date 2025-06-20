
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AspectRatio } from './ui/aspect-ratio';
import { Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface ImageGalleryProps {
  bucketName: string;
  folderPath: string;
  className?: string;
  aspectRatio?: number;
  onSelect?: (url: string) => void;
  selectable?: boolean;
  deletable?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  bucketName,
  folderPath,
  className = "",
  aspectRatio = 16 / 9,
  onSelect,
  selectable = false,
  deletable = false,
}) => {
  const [images, setImages] = useState<{ name: string; url: string; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchImages();
  }, [bucketName, folderPath]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folderPath, {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        throw error;
      }

      // Filter for image files only
      const imageFiles = data ? data.filter(item => 
        !item.id.endsWith('/') && 
        (item.metadata?.mimetype?.startsWith('image/') || 
         item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      ) : [];

      // Get URLs for each image
      const imagesWithUrls = imageFiles.map(file => {
        const { data: { publicUrl } } = supabase
          .storage
          .from(bucketName)
          .getPublicUrl(folderPath + file.name);

        return {
          name: file.name,
          url: publicUrl,
          path: folderPath + file.name
        };
      });

      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Грешка при зареждането на изображенията');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (path: string) => {
    try {
      if (!user) {
        toast.error('Трябва да сте влезли в профила си за да изтриете изображения');
        return;
      }

      setDeleting(path);
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        throw error;
      }

      setImages(images.filter(img => img.path !== path));
      toast.success('Изображението е изтрито успешно');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Грешка при изтриването на изображението');
    } finally {
      setDeleting(null);
    }
  };

  const handleSelect = (url: string) => {
    if (selectable && onSelect) {
      onSelect(url);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-48 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`bg-muted/20 rounded-md p-4 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">Няма намерени изображения</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {images.map((image) => (
        <div 
          key={image.path} 
          className={`relative group overflow-hidden rounded-md border ${selectable ? 'cursor-pointer' : ''}`}
        >
          <AspectRatio ratio={aspectRatio}>
            <img
              src={image.url}
              alt={image.name}
              className={`object-cover w-full h-full transition-transform duration-300 ${selectable ? 'group-hover:scale-105' : ''}`}
              onClick={() => handleSelect(image.url)}
            />
          </AspectRatio>
          
          {deletable && user && (
            <button
              className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image.path);
              }}
              disabled={!!deleting}
            >
              {deleting === image.path ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <X className="h-4 w-4 text-white" />
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
