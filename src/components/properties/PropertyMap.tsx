import React, { useEffect, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2 } from 'lucide-react';

// Add window type declaration for maplibregl
declare global {
  interface Window {
    maplibregl: any;
  }
}

interface PropertyMapProps {
  address: string;
  location: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  address, 
  location, 
  city,
  latitude,
  longitude
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Default coordinates for Bulgaria if no coordinates are provided
  const coords = {
    lat: latitude || 42.7339,
    lng: longitude || 25.4858,
    zoom: latitude && longitude ? 15 : 7
  };

  useEffect(() => {
    // Load MapLibre GL JS script dynamically
    const loadMapLibre = async () => {
      if (!window.maplibregl) {
        const mapScript = document.createElement('script');
        mapScript.src = 'https://unpkg.com/maplibre-gl@5.0.1/dist/maplibre-gl.js';
        mapScript.async = true;
        
        const mapCss = document.createElement('link');
        mapCss.href = 'https://unpkg.com/maplibre-gl@5.0.1/dist/maplibre-gl.css';
        mapCss.rel = 'stylesheet';
        
        document.head.appendChild(mapScript);
        document.head.appendChild(mapCss);
        
        mapScript.onload = initializeMap;
      } else {
        initializeMap();
      }
    };
    
    const initializeMap = () => {
      if (map.current || !window.maplibregl) return;
      
      // Stadia Maps API key
      const apiKey = 'dac160e6-80ee-4604-98ec-8817dbf3a635';
      
      map.current = new window.maplibregl.Map({
        container: mapContainer.current!,
        style: `https://tiles.stadiamaps.com/styles/osm_bright.json?api_key=${apiKey}`,
        center: [coords.lng, coords.lat],
        zoom: coords.zoom
      });
      
      // Add navigation controls (zoom in/out)
      map.current.addControl(new window.maplibregl.NavigationControl());
      
      map.current.on('load', () => {
        // Add a marker
        marker.current = new window.maplibregl.Marker({
          color: '#d90429'
        })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current);
          
        setLoading(false);
      });
    };
    
    loadMapLibre();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coords.lat, coords.lng, coords.zoom]);

  return (
    <div className="relative rounded-lg overflow-hidden border">
      <AspectRatio ratio={16 / 9}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div 
          ref={mapContainer} 
          className="w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};

export default PropertyMap;
