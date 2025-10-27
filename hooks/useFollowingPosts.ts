'use client';

import { useState, useEffect } from 'react';
import type { DBPost } from '@/store/communityStore';

/**
 * Hook để fetch posts từ người dùng đang follow
 */
export function useFollowingPosts() {
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const CACHE_DURATION = 2 * 60 * 1000; // 2 phút

  const shouldRefetch = () => {
    return Date.now() - lastFetchTime > CACHE_DURATION;
  };

  useEffect(() => {
    if (shouldRefetch()) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts/following');
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated
          setPosts([]);
          return;
        }
        throw new Error('Failed to fetch following posts');
      }
      const data = await response.json();
      setPosts(data.posts || []);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('Error fetching following posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Force refresh (bỏ qua cache)
  const refreshPosts = async () => {
    await fetchPosts();
  };

  return {
    posts,
    loading,
    refreshPosts,
  };
}
