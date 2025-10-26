'use client';

import { useEffect } from 'react';
import { useCommunityStore } from '@/store/communityStore';
import { useUser } from '@clerk/nextjs';

/**
 * Custom hook để fetch và cache posts
 * Tự động kiểm tra cache và chỉ fetch khi cần thiết
 */
export function usePosts() {
  const { user } = useUser();
  const {
    posts,
    loading,
    setLoading,
    setPostsWithCache,
    shouldRefetchPosts,
    setLikedPosts,
  } = useCommunityStore();

  useEffect(() => {
    // Chỉ fetch nếu cần (cache expired hoặc chưa có data)
    if (shouldRefetchPosts()) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      
      // Lưu vào cache
      setPostsWithCache(data || []);

      // Track liked posts của user hiện tại
      if (user) {
        const userLikedPostIds = new Set<string>();
        data.forEach((post: any) => {
          if (post.likedBy && Array.isArray(post.likedBy)) {
            post.likedBy.forEach((like: any) => {
              if (like.user?.clerkId === user.id) {
                userLikedPostIds.add(post.id.toString());
              }
            });
          }
        });
        setLikedPosts(userLikedPostIds);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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
