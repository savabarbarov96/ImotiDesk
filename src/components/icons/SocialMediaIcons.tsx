import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

// Custom TikTok icon since it's not available in lucide-react
export const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialMediaIconProps {
  platform: 'facebook' | 'instagram' | 'tiktok';
  url?: string;
  className?: string;
}

export const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({ platform, url, className = "w-5 h-5" }) => {
  const iconMap = {
    facebook: <Facebook className={className} />,
    instagram: <Instagram className={className} />,
    tiktok: <TikTokIcon />
  };

  const icon = iconMap[platform];

  if (!url) {
    return <span className={`${className} text-gray-400`}>{icon}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} text-gray-600 hover:text-blue-600 transition-colors`}
      title={`${platform.charAt(0).toUpperCase() + platform.slice(1)} профил`}
    >
      {icon}
    </a>
  );
};

interface SocialMediaLinksProps {
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  className?: string;
}

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  className = "flex space-x-2"
}) => {
  const hasAnySocial = facebookUrl || instagramUrl || tiktokUrl;

  if (!hasAnySocial) {
    return (
      <span className="text-xs text-muted-foreground italic">
        Няма социални мрежи
      </span>
    );
  }

  return (
    <div className={className}>
      {facebookUrl && (
        <SocialMediaIcon platform="facebook" url={facebookUrl} />
      )}
      {instagramUrl && (
        <SocialMediaIcon platform="instagram" url={instagramUrl} />
      )}
      {tiktokUrl && (
        <SocialMediaIcon platform="tiktok" url={tiktokUrl} />
      )}
    </div>
  );
}; 