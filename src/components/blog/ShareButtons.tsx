
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const fullUrl = `${window.location.origin}${url}`;

  const handleShare = (platform: string) => {
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, copy to clipboard instead
        navigator.clipboard.writeText(fullUrl);
        toast({
          title: "Копирано в клипборда!",
          description: "Сега можете да споделите в Instagram.",
        });
        return;
      case 'tiktok':
        // TikTok doesn't have a direct share URL, copy to clipboard instead
        navigator.clipboard.writeText(fullUrl);
        toast({
          title: "Копирано в клипборда!",
          description: "Сега можете да споделите в TikTok.",
        });
        return;
      case 'viber':
        shareUrl = `viber://forward?text=${encodeURIComponent(title + ' ' + fullUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-neutral-dark">Споделете:</span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="sm" 
        className="rounded-full"
        onClick={() => handleShare('instagram')}
      >
        <Instagram className="h-4 w-4" />
        <span className="sr-only">Instagram</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => handleShare('tiktok')}
      >
        {/* Custom TikTok icon since it's not available in lucide-react */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
          <path d="M16 8v8"/>
          <path d="M12 16v-8"/>
          <path d="M18 8a4 4 0 0 0-4-4"/>
          <path d="M16 4h-4"/>
          <path d="M16 8a4 4 0 0 1 4 4v1"/>
        </svg>
        <span className="sr-only">TikTok</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => handleShare('viber')}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="h-4 w-4"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.4 0.8C9.1 0.9 6.5 1.7 4.8 3C3.1 4.3 2.1 6.1 1.6 8.2C1.1 10.3 1 12.5 1.3 14.2C1.6 15.9 2.1 17.2 3 18.5C3.9 19.8 4.9 20.7 5.9 21.3C6.4 21.6 6.5 21.6 6.6 21.5C6.7 21.4 6.7 21.4 6.5 21C6.2 20.5 5.9 19.7 5.8 19.1C5.7 18.5 5.7 18.4 5.5 18.3C5 17.8 4.6 17.3 4.3 16.6C3.8 15.5 3.7 13.8 4 12C4.3 10.2 5 8.7 6 7.5C7.3 6 9.2 5 11.5 4.6C13.8 4.2 16.1 4.5 17.7 5.4C19.5 6.3 20.9 7.9 21.7 9.8C22.1 10.8 22.2 11.5 22.3 13.1C22.3 14.4 22.3 14.8 22.2 15.4C22 16.1 21.8 16.8 21.5 17.3C21.2 18 20.9 18.4 20.3 18.9C19.8 19.3 19.2 19.5 18.7 19.4C18.2 19.3 17.9 19.1 17.6 18.7C17.3 18.3 17.2 18 17.1 17.1L17 16.2L16.9 13.4C16.8 10.8 16.8 10.6 16.6 10.3C16.5 10.1 16.3 9.9 16.1 9.8C15.5 9.5 14.7 9.8 14.4 10.4C14.3 10.7 14.3 11 14.3 13.1C14.3 16.2 14.3 16.6 14.6 17.5C15 19 16.1 20.1 17.6 20.5C18.4 20.7 19.5 20.6 20.3 20.2C21.4 19.7 22.2 18.9 22.9 17.6C23.5 16.5 23.8 15.5 23.9 13.8C23.9 11.6 23.6 10.2 22.7 8.6C22.1 7.5 21.5 6.8 20.5 6C19 4.9 17.2 4.2 15.2 4C14.1 3.9 12.4 3.9 11.9 3.9C11.7 3.9 11.6 3.8 11.4 3.5C11.3 3.2 11.3 3.1 11.4 2.9C11.5 2.7 11.9 2.3 12.2 2.1C12.6 1.8 13.2 1.6 14 1.5C14.8 1.4 15.5 1.4 16.2 1.5L17 1.6L17.1 1.5C17.3 1.3 17.1 1 16.7 0.8C15.7 0.2 14 0 11.9 0.4C11.7 0.5 11.6 0.5 11.4 0.6C11.2 0.7 11.4 0.8 11.4 0.8ZM8.9 6.9C8.7 7 8.6 7.1 8.6 7.3C8.5 7.5 8.6 7.7 8.8 7.8C8.9 7.9 9 7.9 9.2 7.8C9.9 7.6 10.6 7.5 11.3 7.5C12.2 7.5 12.9 7.6 13.8 8C14.4 8.2 15 8.5 15.6 8.9C16 9.1 16.6 9.6 16.9 9.9C17.7 10.8 18.2 11.9 18.4 13.1C18.5 13.7 18.5 14.6 18.4 15.2C18.4 15.4 18.4 15.6 18.5 15.7C18.6 16 19 16 19.2 15.8C19.3 15.7 19.4 15.6 19.4 15.4C19.8 13.3 19.5 11.5 18.5 9.7C17.9 8.6 17.1 7.8 16 7C15.5 6.7 15.1 6.5 14.6 6.3C13.3 5.8 12.1 5.6 10.7 5.6C10.2 5.6 10 5.6 9.5 5.7C9.3 5.7 9.1 5.8 8.9 5.9C8.6 6 8.9 6.9 8.9 6.9ZM11 9.5C10 9.9 9.3 10.7 9 11.8C8.9 12.3 8.9 13.2 9 13.7C9.2 14.6 9.7 15.3 10.6 15.8C10.9 16 10.9 16 11.3 16C11.7 16 11.7 16 12 15.8C12.8 15.3 13.3 14.5 13.5 13.5C13.6 13 13.6 12.4 13.5 11.9C13.2 10.7 12.4 9.9 11.1 9.5C10.9 9.5 10.1 9.5 11 9.5ZM11.7 11.4C12.1 11.6 12.4 12 12.5 12.4C12.6 12.8 12.6 13.4 12.4 13.8C12.2 14.3 11.8 14.7 11.3 14.8C11.1 14.8 11.1 14.8 10.9 14.8C10.5 14.6 10.2 14.3 10 13.8C9.8 13.2 9.8 12.5 10.1 12C10.4 11.5 11.1 11.2 11.7 11.4ZM8 10.1C7.9 10.2 7.8 10.3 7.8 10.5C7.8 10.7 7.8 10.8 7.9 10.8C8.1 11 8.4 11 8.6 10.9C8.8 10.8 8.9 10.6 8.9 10.4C8.9 10.2 8.8 10.1 8.6 10C8.4 9.9 8.2 9.9 8 10.1ZM13.5 10.1C13.4 10.2 13.3 10.3 13.3 10.5C13.3 10.8 13.5 11 13.8 11C14.1 11 14.3 10.8 14.3 10.5C14.3 10.2 14.1 10 13.8 10C13.6 10 13.5 10.1 13.5 10.1ZM6.8 11.3C6.6 11.4 6.5 11.7 6.6 11.9C6.6 12 6.7 12 6.9 12.1C7 12.2 7.3 12.1 7.4 12C7.6 11.9 7.7 11.6 7.6 11.4C7.5 11.1 7.1 11.1 6.8 11.3ZM14.7 11.3C14.5 11.4 14.4 11.6 14.4 11.9C14.5 12.1 14.6 12.1 14.9 12.1C15.1 12.1 15.2 12.1 15.3 12C15.4 11.9 15.5 11.6 15.4 11.4C15.3 11.1 14.9 11.1 14.7 11.3ZM6 12.7C5.8 12.9 5.8 13.1 5.9 13.3C6 13.5 6.2 13.6 6.4 13.6C6.6 13.5 6.8 13.3 6.8 13.1C6.8 12.7 6.4 12.5 6 12.7ZM15.6 12.7C15.3 12.9 15.3 13.3 15.6 13.5C15.9 13.7 16.3 13.5 16.3 13.2C16.3 12.8 15.9 12.5 15.6 12.7Z" />
        </svg>
        <span className="sr-only">Viber</span>
      </Button>
    </div>
  );
}
