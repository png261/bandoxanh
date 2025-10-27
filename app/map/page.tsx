'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Station, WasteType, RecyclingEvent } from '@/types';
import { MapPinIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, CalendarIcon, DirectionsIcon } from '@/components/Icons';
import Header from '@/components/Header';
import { Theme } from '@/types';
import { useMapStore } from '@/store/mapStore';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';

declare var L: any;

const isStation = (item: Station | RecyclingEvent): item is Station => {
  return (item as Station).wasteTypes !== undefined;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

const StationCard: React.FC<{ station: Station & { distance: number | null } }> = ({ station }) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    return (
    <div className="bg-white dark:bg-brand-gray-dark rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-brand-green dark:hover:border-brand-green hover:shadow-md transition-all duration-200 cursor-pointer group">
        <img src={station.image} alt={station.name} className="w-full h-24 object-cover group-hover:brightness-105 transition-all" />
        <div className="p-3">
        <h3 className="font-semibold text-sm text-brand-green-dark dark:text-brand-green-light truncate">{station.name}</h3>
        <p className="text-xs text-brand-gray-DEFAULT dark:text-gray-400 mt-1 flex items-start line-clamp-2">
            <MapPinIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{station.address}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
            {station.wasteTypes.map((type) => (
            <span key={type} className="px-1.5 py-0.5 bg-brand-green-light text-brand-green-dark text-[10px] font-medium rounded">
                {type}
            </span>
            ))}
        </div>
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
                <DirectionsIcon className="w-3.5 h-3.5" />
                Chỉ đường
            </a>
            {station.distance !== null && (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    ~{station.distance.toFixed(1)} km
                </p>
            )}
        </div>
        </div>
    </div>
    );
};

const EventCard: React.FC<{ event: RecyclingEvent & { distance: number | null } }> = ({ event }) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`;
    return (
    <div className="bg-white dark:bg-brand-gray-dark rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <img src={event.image} alt={event.name} className="w-full h-24 object-cover group-hover:brightness-105 transition-all" />
      <div className="p-3">
        <h3 className="font-semibold text-sm text-purple-700 dark:text-purple-400 truncate">{event.name}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-start line-clamp-2">
          <MapPinIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{event.address}</span>
        </p>
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <CalendarIcon className="w-3.5 h-3.5 mr-1" />
          <span className="truncate">{event.date} - {event.time}</span>
        </div>
         <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
                <DirectionsIcon className="w-3.5 h-3.5" />
                Chỉ đường
            </a>
            {event.distance !== null && (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    ~{event.distance.toFixed(1)} km
                </p>
            )}
        </div>
      </div>
    </div>
    );
};

const getStationIcon = (station: Station, isHovered: boolean = false) => {
  const iconPriority: WasteType[] = [
    WasteType.Electronic, WasteType.Battery, WasteType.Glass, WasteType.Metal,
    WasteType.Plastic, WasteType.Paper, WasteType.Organic, WasteType.General,
  ];
  const primaryType = iconPriority.find(type => station.wasteTypes.includes(type)) || WasteType.General;

  const iconSvgs: Record<WasteType, string> = {
    [WasteType.Electronic]: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />`,
    [WasteType.Battery]: `<path stroke-linecap="round" stroke-linejoin="round" d="M21 12V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5v-4.5m-19.5-3h1.5M4.5 12h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0h1.5" />`,
    [WasteType.Glass]: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 3.545A2.25 2.25 0 0115 5.795v1.5a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 0112.75 3.545z" />`,
    [WasteType.Metal]: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />`,
    [WasteType.Paper]: `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />`,
    [WasteType.Organic]: `<path stroke-linecap="round" stroke-linejoin="round" d="M14.121 14.121a2.25 2.25 0 113.182-3.182a2.25 2.25 0 01-3.182 3.182zM9.879 9.879a2.25 2.25 0 10-3.182 3.182a2.25 2.25 0 003.182-3.182zM12 21a9 9 0 100-18 9 9 0 000 18z" />`,
    [WasteType.Plastic]: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.33-2.125 5.25 5.25 0 011.025 6.075 4.5 4.5 0 11-9.945 4.825z" />`,
    [WasteType.General]: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.33-2.125 5.25 5.25 0 011.025 6.075 4.5 4.5 0 11-9.945 4.825z" />`,
  };
  
  const iconColors: Record<WasteType, string> = {
    [WasteType.Electronic]: 'text-indigo-600 bg-indigo-100', [WasteType.Battery]: 'text-amber-600 bg-amber-100',
    [WasteType.Glass]: 'text-sky-600 bg-sky-100', [WasteType.Metal]: 'text-slate-600 bg-slate-200',
    [WasteType.Paper]: 'text-blue-600 bg-blue-100', [WasteType.Plastic]: 'text-rose-600 bg-rose-100',
    [WasteType.Organic]: 'text-green-600 bg-green-100', [WasteType.General]: 'text-gray-600 bg-gray-200',
  };

  const svgPath = iconSvgs[primaryType];
  const colorClasses = iconColors[primaryType];
  const size = isHovered ? 48 : 40;
  const iconSize = isHovered ? 24 : 20;

  const html = `<div class="${colorClasses} rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-200" style="width: ${size}px; height: ${size}px; transform: ${isHovered ? 'scale(1.2)' : 'scale(1)'};"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: ${iconSize}px; height: ${iconSize}px;">${svgPath}</svg></div>`;

  return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size] });
};

const getEventIcon = (_event: RecyclingEvent, isHovered: boolean = false) => {
    const svgPath = `<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />`;
    const colorClasses = 'text-purple-600 bg-purple-100';
    const size = isHovered ? 48 : 40;
    const iconSize = isHovered ? 24 : 20;
  
    const html = `<div class="${colorClasses} rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-200" style="width: ${size}px; height: ${size}px; transform: ${isHovered ? 'scale(1.2)' : 'scale(1)'};"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: ${iconSize}px; height: ${iconSize}px;">${svgPath}</svg></div>`;
  
    return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size] });
};

type ItemWithDistance = (Station | RecyclingEvent) & { distance: number | null };

const MapComponent: React.FC<{
  items: ItemWithDistance[];
  hoveredItemId: number | null;
  userLocation: { lat: number; lng: number } | null;
  focusedItem: ItemWithDistance | null;
}> = ({ items, hoveredItemId, userLocation, focusedItem }) => {
  const mapRef = useRef<any>(null);
  const itemMarkersRef = useRef<any>({});
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map('map-container').setView([21.0227, 105.8521], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(itemMarkersRef.current).forEach((marker: any) => marker.remove());
    itemMarkersRef.current = {};

    items.forEach(item => {
      let icon;
      let popupContent;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
      const directionsButton = `<div class="mt-3 pt-2 border-t border-gray-200"><a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4c0-.6.4-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>Chỉ đường trên Google Maps</a></div>`;

      if (isStation(item)) {
        icon = getStationIcon(item, false);
        popupContent = `<div class="w-64 -m-3"><img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover" /><div class="p-3"><h3 class="font-bold text-md text-brand-green-dark">${item.name}</h3><p class="text-xs text-gray-600 mt-1">${item.address}</p><div class="mt-2 flex flex-wrap gap-1">${item.wasteTypes.map(type => `<span class="px-1.5 py-0.5 bg-brand-green-light text-brand-green-dark text-[10px] font-semibold rounded-full">${type}</span>`).join('')}</div>${directionsButton}</div></div>`;
      } else {
        icon = getEventIcon(item, false);
        popupContent = `<div class="w-64 -m-3"><img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover" /><div class="p-3"><h3 class="font-bold text-md text-purple-700">${item.name}</h3><p class="text-xs text-gray-600 mt-1">${item.address}</p><div class="mt-2 text-xs text-gray-500"><p><strong>Tổ chức:</strong> ${item.organizer}</p><p><strong>Thời gian:</strong> ${item.date} - ${item.time}</p></div>${directionsButton}</div></div>`;
      }
      const marker = L.marker([item.lat, item.lng], { icon }).addTo(map);
      marker.bindPopup(popupContent);
      itemMarkersRef.current[item.id] = marker;
    });
  }, [items]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      const userIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup('Vị trí của bạn');
      map.panTo([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  useEffect(() => {
    Object.entries(itemMarkersRef.current).forEach(([id, marker]: [string, any]) => {
      const itemId = parseInt(id, 10);
      const isHovered = itemId === hoveredItemId;
      const item = items.find(s => s.id === itemId);
      if (item) {
        if(isStation(item)){
            marker.setIcon(getStationIcon(item, isHovered));
        } else {
            marker.setIcon(getEventIcon(item, isHovered));
        }
        marker.setZIndexOffset(isHovered ? 1000 : 0);
      }
    });
  }, [hoveredItemId, items]);
  
  useEffect(() => {
    if (focusedItem && mapRef.current && itemMarkersRef.current[focusedItem.id]) {
      const marker = itemMarkersRef.current[focusedItem.id];
      mapRef.current.flyTo([focusedItem.lat, focusedItem.lng], 15, { animate: true, duration: 1 });
      marker.openPopup();
    }
  }, [focusedItem]);

  return <div id="map-container" className="w-full h-full" />;
};

function MapPage() {
  const searchParams = useSearchParams();
  const MAX_DISTANCE = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<WasteType[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [focusedItem, setFocusedItem] = useState<ItemWithDistance | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'stations' | 'events'>('all');
  const [distanceFilter, setDistanceFilter] = useState<number>(MAX_DISTANCE);
  const [showSearchResults, setShowSearchResults] = useState(false); // New state for mobile
  
  // Use Zustand store for stations and events
  const { stations, events, loading, fetchStations, fetchEvents } = useMapStore();

  // Handle URL parameters (from Identify page)
  useEffect(() => {
    if (!searchParams) return;
    
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    const selectedId = searchParams.get('selected');

    if (lat && lng) {
      const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      setUserLocation(coords);
      
      // If a station is selected, focus on it
      if (selectedId && stations.length > 0) {
        const station = stations.find(s => s.id === parseInt(selectedId));
        if (station) {
          setFocusedItem({ ...station, distance: null });
          setIsPanelOpen(true);
        }
      }
    }
  }, [searchParams, stations]);

  // Fetch stations and events from API with cache
  useEffect(() => {
    fetchStations();
    fetchEvents();
  }, [fetchStations, fetchEvents]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const toggleWasteType = (type: WasteType) => {
    setSelectedWasteTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const itemsWithDistance = useMemo(() => {
    const allItems = viewMode === 'stations' ? stations : viewMode === 'events' ? events : [...stations, ...events];
    return allItems.map(item => ({
      ...item,
      distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, item.lat, item.lng) : null,
    }));
  }, [viewMode, userLocation, stations, events]);

  const filteredAndSortedItems = useMemo(() => {
    return itemsWithDistance
      .filter((item: ItemWithDistance) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDistance = item.distance === null || item.distance <= distanceFilter;
        
        if (isStation(item)) {
          const matchesWasteType = selectedWasteTypes.length === 0 ||
                                   selectedWasteTypes.every(type => item.wasteTypes.includes(type));
          return matchesSearch && matchesWasteType && matchesDistance;
        }
        
        return matchesSearch && matchesDistance;
      })
      .sort((a: ItemWithDistance, b: ItemWithDistance) => {
        if (a.distance === null || b.distance === null) return 0;
        return a.distance - b.distance;
      });
  }, [itemsWithDistance, searchTerm, selectedWasteTypes, distanceFilter]);

  const handleItemClick = (item: ItemWithDistance) => {
    setFocusedItem(item);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] md:h-screen w-full">
        {/* Mobile: Search bar overlay at top (below header) */}
        <div className="md:hidden fixed top-20 left-0 right-0 z-30 bg-white dark:bg-brand-gray-dark shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="p-3">
                <input
                    type="text"
                    placeholder="Tìm theo tên, địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-brand-gray-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <button onClick={() => setViewMode('all')} className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'all' ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Tất cả</button>
                    <button onClick={() => setViewMode('stations')} className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'stations' ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Trạm</button>
                    <button onClick={() => setViewMode('events')} className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'events' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Sự kiện</button>
                </div>
                
                {/* Mobile search results - only show when focused and has search term */}
                {showSearchResults && searchTerm.trim() !== '' && (
                    <div className="mt-2 max-h-[200px] overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{filteredAndSortedItems.length} kết quả</p>
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-green"></div>
                                </div>
                            ) : filteredAndSortedItems.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredAndSortedItems.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                              handleItemClick(item);
                                              setShowSearchResults(false);
                                            }}
                                            className="p-2 bg-white dark:bg-brand-gray-dark rounded border border-gray-200 dark:border-gray-600 hover:border-brand-green cursor-pointer"
                                        >
                                            <h4 className={`text-sm font-semibold ${isStation(item) ? 'text-brand-green-dark dark:text-brand-green-light' : 'text-purple-700 dark:text-purple-400'}`}>
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.address}</p>
                                            {item.distance !== null && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">~{item.distance.toFixed(1)} km</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">Không tìm thấy kết quả</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Desktop: Side panel */}
        <div className={`hidden md:block md:relative top-0 left-0 h-full flex-shrink-0 bg-white dark:bg-brand-gray-dark shadow-lg z-20 transition-all duration-300 ${isPanelOpen ? 'md:w-[400px]' : 'w-0'}`}>
            <div className="h-full flex flex-col overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Tìm kiếm</h2>
                    </div>
                    <div className="mt-3">
                        <input
                            type="text"
                            placeholder="Tìm theo tên, địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-brand-gray-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                    </div>
                </div>

                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                        <button onClick={() => setViewMode('all')} className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'all' ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Tất cả</button>
                        <button onClick={() => setViewMode('stations')} className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'stations' ? 'bg-brand-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Trạm</button>
                        <button onClick={() => setViewMode('events')} className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'events' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Sự kiện</button>
                    </div>

                    {viewMode !== 'events' && (
                        <div>
                            <h3 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Loại rác</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {Object.values(WasteType).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleWasteType(type)}
                                        className={`px-2 py-0.5 text-[10px] font-semibold rounded border-2 transition-colors ${selectedWasteTypes.includes(type) ? 'bg-brand-green text-white border-brand-green' : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-brand-green'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {userLocation && (
                        <div className="mt-3">
                            <label htmlFor="distance" className="text-xs font-semibold text-gray-600 dark:text-gray-300">Khoảng cách: <span className="font-bold text-brand-green">{distanceFilter} km</span></label>
                            <input
                                id="distance"
                                type="range"
                                min="1"
                                max={MAX_DISTANCE}
                                value={distanceFilter}
                                onChange={(e) => setDistanceFilter(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
                                style={{ accentColor: '#10B981' }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex-grow overflow-y-auto p-3 space-y-2.5">
                    <p className="text-xs font-semibold text-gray-500 mb-1.5">{filteredAndSortedItems.length} kết quả</p>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green"></div>
                        </div>
                    ) : filteredAndSortedItems.length > 0 ? (
                        filteredAndSortedItems.map((item: ItemWithDistance) => (
                            <div key={item.id} onMouseEnter={() => setHoveredItemId(item.id)} onMouseLeave={() => setHoveredItemId(null)} onClick={() => handleItemClick(item)}>
                                {isStation(item) ? <StationCard station={item} /> : <EventCard event={item} />}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <MapPinIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Không tìm thấy kết quả</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="relative z-20 hidden md:block">
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-brand-gray-dark p-1.5 rounded-r-lg shadow-sm border-y border-r border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                style={{ left: isPanelOpen ? '-1px' : '0' }}
            >
                {isPanelOpen ? <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <ChevronDoubleRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>
        </div>

        {/* Map container - full screen on mobile, flexible on desktop */}
        <div 
            className="flex-grow h-full z-10 pt-[132px] md:pt-0"
            onClick={() => setShowSearchResults(false)}
        >
            <MapComponent
                items={filteredAndSortedItems}
                hoveredItemId={hoveredItemId}
                userLocation={userLocation}
                focusedItem={focusedItem}
            />
        </div>
    </div>
  );
}

export default function Map() {
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setIsSidebarCollapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}> 
        <main>
          <Suspense fallback={<div className="flex items-center justify-center h-screen"><p className="text-gray-500">Đang tải bản đồ...</p></div>}>
            <MapPage />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
