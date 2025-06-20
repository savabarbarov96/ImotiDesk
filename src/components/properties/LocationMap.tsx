import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Add Stadia Maps API key
const STADIA_MAPS_API_KEY = 'dac160e6-80ee-4604-98ec-8817dbf3a635';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, onChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [address, setAddress] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      const mapInstance = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Add Stadia Maps tile layer
      L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=' + STADIA_MAPS_API_KEY, {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstance);

      // Add marker at initial position
      const markerInstance = L.marker([latitude, longitude], {
        draggable: true
      }).addTo(mapInstance);

      // Handle marker drag
      markerInstance.on('dragend', function() {
        const position = markerInstance.getLatLng();
        onChange(position.lat, position.lng);
      });

      // Handle map click to move marker
      mapInstance.on('click', function(e) {
        markerInstance.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef.current]);

  // Update marker position if props change externally
  useEffect(() => {
    if (marker && (marker.getLatLng().lat !== latitude || marker.getLatLng().lng !== longitude)) {
      marker.setLatLng([latitude, longitude]);
      map?.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, marker, map]);

  // Geocode address to coordinates
  const handleAddressSearch = async () => {
    if (!address) return;
    
    setSearchStatus('Търсене...');
    try {
      const response = await fetch(
        `https://api.stadiamaps.com/geocoding/v1/search?text=${encodeURIComponent(address)}&api_key=${STADIA_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const location = data.features[0].geometry.coordinates;
        const lat = location[1];
        const lng = location[0];
        
        // Update map view and marker
        if (map && marker) {
          map.setView([lat, lng], 14);
          marker.setLatLng([lat, lng]);
          onChange(lat, lng);
        }
        
        setSearchStatus('Намерен');
        setTimeout(() => setSearchStatus(''), 2000);
      } else {
        setSearchStatus('Не е намерен');
        setTimeout(() => setSearchStatus(''), 2000);
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchStatus('Грешка');
      setTimeout(() => setSearchStatus(''), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2 items-end">
        <div className="flex-1">
          <Input
            placeholder="Търсене на адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddressSearch}
          disabled={searchStatus === 'Търсене...'}
        >
          <Search size={16} className="mr-2" />
          Търсене
        </Button>
        {searchStatus && (
          <div className={`text-sm ${
            searchStatus === 'Намерен' ? 'text-green-500' : 
            searchStatus === 'Грешка' || searchStatus === 'Не е намерен' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            {searchStatus}
          </div>
        )}
      </div>
      <div 
        ref={mapRef} 
        className="h-[250px] w-full rounded-md border border-input overflow-hidden"
      />
      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-2">
        <div>Latitude: {latitude.toFixed(6)}</div>
        <div>Longitude: {longitude.toFixed(6)}</div>
      </div>
    </div>
  );
};

export default LocationMap; 