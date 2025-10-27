'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
  label?: string;
}

export default function MapPicker({ latitude, longitude, onLocationSelect, label = 'Chọn vị trí trên bản đồ' }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return;

    // Dynamic import of Leaflet (client-side only)
    (async () => {
      // @ts-ignore - Leaflet types will be available at runtime
      const L = await import('leaflet');
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icon issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map
      const map = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([latitude, longitude], {
        draggable: true,
      }).addTo(map);

      // Update position when marker is dragged
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onLocationSelect(pos.lat, pos.lng);
      });

      // Update position when map is clicked
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationSelect(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    })();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted]);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
    }
  }, [latitude, longitude]);

  // Search location using Nominatim (OpenStreetMap geocoding)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        
        onLocationSelect(newLat, newLng);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 15);
        }
      } else {
        alert('Không tìm thấy địa điểm');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Lỗi khi tìm kiếm địa điểm');
    } finally {
      setSearching(false);
    }
  };

  if (!mounted) {
    return <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Đang tải bản đồ...</div>;
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Search box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Tìm kiếm địa điểm (VD: Quận 1, TP.HCM)"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
        >
          {searching ? '🔍...' : '🔍 Tìm'}
        </button>
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg border-2 border-gray-300 overflow-hidden"
        style={{ zIndex: 0 }}
      />

      {/* Coordinates display */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p>📍 <strong>Vĩ độ:</strong> {latitude.toFixed(6)}</p>
        <p>📍 <strong>Kinh độ:</strong> {longitude.toFixed(6)}</p>
        <p className="text-xs mt-2 text-gray-500">💡 Click vào bản đồ hoặc kéo marker để chọn vị trí</p>
      </div>
    </div>
  );
}
