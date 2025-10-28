'use client';

import { create } from 'zustand';
import { NewsArticle, RecyclingEvent } from '@/types';

interface NewsState {
  // Data
  newsArticles: NewsArticle[];
  events: RecyclingEvent[];
  
  // UI State
  loading: boolean;
  selectedCategory: string;
  
  // Cache State
  newsLastFetched: number | null;
  eventsLastFetched: number | null;
  cacheValidDuration: number; // 5 minutes in milliseconds
  
  // Actions
  setNewsArticles: (articles: NewsArticle[]) => void;
  setEvents: (events: RecyclingEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedCategory: (category: string) => void;
  
  fetchNews: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  invalidateCache: () => void;
  
  // Cache helpers
  isNewsCacheValid: () => boolean;
  isEventsCacheValid: () => boolean;
  
  // Computed
  getFilteredArticles: () => NewsArticle[];
}

export const useNewsStore = create<NewsState>((set, get) => ({
  // Initial state
  newsArticles: [],
  events: [],
  loading: false,
  selectedCategory: 'Tất cả',
  newsLastFetched: null,
  eventsLastFetched: null,
  cacheValidDuration: 5 * 60 * 1000, // 5 minutes
  
  // Setters
  setNewsArticles: (articles) => {
    set({ 
      newsArticles: articles,
      newsLastFetched: Date.now()
    });
  },
  
  setEvents: (events) => {
    set({ 
      events,
      eventsLastFetched: Date.now()
    });
  },
  
  setLoading: (loading) => set({ loading }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  // Cache validators
  isNewsCacheValid: () => {
    const { newsLastFetched, cacheValidDuration } = get();
    if (!newsLastFetched) return false;
    return Date.now() - newsLastFetched < cacheValidDuration;
  },
  
  isEventsCacheValid: () => {
    const { eventsLastFetched, cacheValidDuration } = get();
    if (!eventsLastFetched) return false;
    return Date.now() - eventsLastFetched < cacheValidDuration;
  },
  
  // Fetch news with cache
  fetchNews: async () => {
    const { isNewsCacheValid, setNewsArticles, setLoading } = get();
    
    // Return cached data if valid
    if (isNewsCacheValid()) {
      console.log('Using cached news data');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        // API already returns data in correct format
        setNewsArticles(data);
        console.log('Fetched fresh news data from database');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
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
        // Transform events data for news page
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
        console.log('Fetched fresh events data for news');
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
      newsLastFetched: null,
      eventsLastFetched: null,
    });
  },
  
  // Get filtered articles based on selected category
  getFilteredArticles: () => {
    const { newsArticles, selectedCategory } = get();
    if (selectedCategory === 'Tất cả') {
      return newsArticles;
    }
    return newsArticles.filter(article => article.category === selectedCategory);
  },
}));
