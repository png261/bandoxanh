'use client';

import { create } from 'zustand';
import { Station, RecyclingEvent } from '@/types';

interface MapState {
  // Data
  stations: Station[];
  events: RecyclingEvent[];
  
  // UI State
  loading: boolean;
  selectedStation: Station | null;
  selectedEvent: RecyclingEvent | null;
  
  // Cache State
  stationsLastFetched: number | null;
  eventsLastFetched: number | null;
  cacheValidDuration: number; // 5 minutes in milliseconds
  
  // Actions
  setStations: (stations: Station[]) => void;
  setEvents: (events: RecyclingEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedStation: (station: Station | null) => void;
  setSelectedEvent: (event: RecyclingEvent | null) => void;
  
  fetchStations: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  invalidateCache: () => void;
  
  // Cache helpers
  isStationsCacheValid: () => boolean;
  isEventsCacheValid: () => boolean;
}

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  stations: [],
  events: [],
  loading: false,
  selectedStation: null,
  selectedEvent: null,
  stationsLastFetched: null,
  eventsLastFetched: null,
  cacheValidDuration: 5 * 60 * 1000, // 5 minutes
  
  // Setters
  setStations: (stations) => {
    set({ 
      stations,
      stationsLastFetched: Date.now()
    });
  },
  
  setEvents: (events) => {
    set({ 
      events,
      eventsLastFetched: Date.now()
    });
  },
  
  setLoading: (loading) => set({ loading }),
  setSelectedStation: (station) => set({ selectedStation: station }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  // Cache validators
  isStationsCacheValid: () => {
    const { stationsLastFetched, cacheValidDuration } = get();
    if (!stationsLastFetched) return false;
    return Date.now() - stationsLastFetched < cacheValidDuration;
  },
  
  isEventsCacheValid: () => {
    const { eventsLastFetched, cacheValidDuration } = get();
    if (!eventsLastFetched) return false;
    return Date.now() - eventsLastFetched < cacheValidDuration;
  },
  
  // Fetch stations with cache
  fetchStations: async () => {
    const { isStationsCacheValid, setStations, setLoading } = get();
    
    // Return cached data if valid
    if (isStationsCacheValid()) {
      console.log('Using cached stations data');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/stations');
      if (res.ok) {
        const data = await res.json();
        // Transform API data to match frontend format
        const transformedStations = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          address: s.address,
          lat: s.latitude,
          lng: s.longitude,
          hours: s.hours,
          wasteTypes: JSON.parse(s.wasteTypes),
          image: s.image,
        }));
        setStations(transformedStations);
        console.log('Fetched fresh stations data');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  },
  
  // Fetch events with cache
  fetchEvents: async () => {
    const { isEventsCacheValid, setEvents, setLoading } = get();
    
    // Return cached data if valid
    if (isEventsCacheValid()) {
      console.log('Using cached events data');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        // Transform API data to match frontend format
        const transformedEvents = data.map((e: any) => ({
          id: e.id,
          name: e.name,
          address: e.address,
          lat: e.latitude,
          lng: e.longitude,
          date: e.date,
          time: e.time,
          organizer: e.organizer,
          description: e.description,
          image: e.imageUrl || e.image || '',
        }));
        setEvents(transformedEvents);
        console.log('Fetched fresh events data');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  },
  
  // Invalidate cache (call after create/update/delete)
  invalidateCache: () => {
    set({
      stationsLastFetched: null,
      eventsLastFetched: null,
    });
  },
}));
