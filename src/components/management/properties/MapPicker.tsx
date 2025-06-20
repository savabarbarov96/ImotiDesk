import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

// Add window type declaration for maplibregl
declare global {
  interface Window {
    maplibregl: any;
  }
}

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ 
  latitude: initialLatitude, 
  longitude: initialLongitude,
  onChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Default coordinates for Bulgaria if no coordinates are provided
  const [coords, setCoords] = useState({
    lat: initialLatitude || 42.7339,
    lng: initialLongitude || 25.4858,
    zoom: initialLatitude && initialLongitude ? 15 : 7
  });

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
        // Add a draggable marker
        marker.current = new window.maplibregl.Marker({
          draggable: true,
          color: '#d90429'
        })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current);
          
        // When marker is dragged, update coordinates
        marker.current.on('dragend', () => {
          const lngLat = marker.current.getLngLat();
          setCoords(prev => ({
            ...prev,
            lat: lngLat.lat,
            lng: lngLat.lng
          }));
          onChange(lngLat.lat, lngLat.lng);
        });
        
        setMapLoaded(true);
      });
    };
    
    loadMapLibre();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker position if props change
  useEffect(() => {
    if (marker.current && map.current && initialLatitude && initialLongitude) {
      marker.current.setLngLat([initialLongitude, initialLatitude]);
      map.current.flyTo({
        center: [initialLongitude, initialLatitude],
        zoom: 15,
        essential: true
      });
    }
  }, [initialLatitude, initialLongitude]);

  // Get current user location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({
            lat: latitude,
            lng: longitude,
            zoom: 15
          });
          
          if (marker.current && map.current) {
            marker.current.setLngLat([longitude, latitude]);
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true
            });
          }
          
          onChange(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div 
        ref={mapContainer} 
        className="w-full h-[300px] rounded-md border border-gray-200 bg-gray-50"
      />
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          {mapLoaded ? (
            <span>
              Географска ширина: {coords.lat.toFixed(6)}, 
              Географска дължина: {coords.lng.toFixed(6)}
            </span>
          ) : (
            <span>Зареждане на картата...</span>
          )}
        </div>
        <Button 
          type="button" 
          size="sm" 
          variant="secondary"
          onClick={handleGetCurrentLocation}
          className="text-xs"
        >
          <MapPin className="h-3 w-3 mr-1" /> Моята локация
        </Button>
      </div>
    </div>
  );
};

export default MapPicker; 