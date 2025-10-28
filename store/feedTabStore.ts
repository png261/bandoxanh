'use client';

import { create } from 'zustand';

export interface DBPost {
  id: string;
  content: string;
  images?: string | string[];
  hashtags?: string[];
  likes?: number;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  comments: any[];
  _count?: {
    likedBy?: number;
  };
  likedBy?: any[];
}

interface FeedTabState {
  // Active tab
  activeTab: 'explore' | 'following';
  
  // Cached posts for each tab
  explorePosts: DBPost[];
  followingPosts: DBPost[];
  
  // Loading states
  exploreLoading: boolean;
  followingLoading: boolean;
  
  // Last fetch timestamps (for cache invalidation)
  exploreLastFetch: number | null;
  followingLastFetch: number | null;
  
  // Actions
  setActiveTab: (tab: 'explore' | 'following') => void;
  setExplorePosts: (posts: DBPost[]) => void;
  setFollowingPosts: (posts: DBPost[]) => void;
  setExploreLoading: (loading: boolean) => void;
  setFollowingLoading: (loading: boolean) => void;
  
  // Post mutations (for both tabs)
  addPost: (post: DBPost) => void;
  deletePost: (postId: string) => void;
  updatePost: (postId: string, updates: Partial<DBPost>) => void;
  
  // Check if cache is valid (2 minutes)
  isExploreCacheValid: () => boolean;
  isFollowingCacheValid: () => boolean;
  
  // Clear cache
  clearExploreCache: () => void;
  clearFollowingCache: () => void;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const useFeedTabStore = create<FeedTabState>((set, get) => ({
  activeTab: 'explore',
  explorePosts: [],
  followingPosts: [],
  exploreLoading: false,
  followingLoading: false,
  exploreLastFetch: null,
  followingLastFetch: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setExplorePosts: (posts) => set({ 
    explorePosts: posts,
    exploreLastFetch: Date.now()
  }),
  
  setFollowingPosts: (posts) => set({ 
    followingPosts: posts,
    followingLastFetch: Date.now()
  }),
  
  setExploreLoading: (loading) => set({ exploreLoading: loading }),
  setFollowingLoading: (loading) => set({ followingLoading: loading }),
  
  // Add new post to both tabs (prepend to start of array)
  addPost: (post) => set((state) => ({
    explorePosts: [post, ...state.explorePosts],
    followingPosts: [post, ...state.followingPosts],
  })),
  
  // Delete post from both tabs
  deletePost: (postId) => set((state) => ({
    explorePosts: state.explorePosts.filter(p => p.id !== postId),
    followingPosts: state.followingPosts.filter(p => p.id !== postId),
  })),
  
  // Update post in both tabs
  updatePost: (postId, updates) => set((state) => ({
    explorePosts: state.explorePosts.map(p => 
      p.id === postId ? { ...p, ...updates } : p
    ),
    followingPosts: state.followingPosts.map(p => 
      p.id === postId ? { ...p, ...updates } : p
    ),
  })),
  
  isExploreCacheValid: () => {
    const { exploreLastFetch } = get();
    if (!exploreLastFetch) return false;
    return Date.now() - exploreLastFetch < CACHE_DURATION;
  },
  
  isFollowingCacheValid: () => {
    const { followingLastFetch } = get();
    if (!followingLastFetch) return false;
    return Date.now() - followingLastFetch < CACHE_DURATION;
  },
  
  clearExploreCache: () => set({ 
    explorePosts: [],
    exploreLastFetch: null
  }),
  
  clearFollowingCache: () => set({ 
    followingPosts: [],
    followingLastFetch: null
  }),
}));
