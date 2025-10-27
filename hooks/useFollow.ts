import { useEffect } from 'react';
import { useFollowStore } from '@/store/followStore';

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const useFollow = (userId: number) => {
  const { userFollowStats, setUserFollowStats, toggleFollow: toggleFollowInStore, getUserFollowStats } = useFollowStore();

  // Get stats from store or use defaults
  const stats = getUserFollowStats(userId) || {
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  };

  const fetchFollowStats = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const newStats = {
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          isFollowing: data.isFollowing || false,
        };
        setUserFollowStats(userId, newStats);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      // Only fetch if we don't have cached data
      const cachedStats = getUserFollowStats(userId);
      if (!cachedStats) {
        fetchFollowStats();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleFollow = async () => {
    const currentIsFollowing = stats.isFollowing;
    
    // Optimistic update in store
    toggleFollowInStore(userId, currentIsFollowing);

    try {
      const method = currentIsFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`/api/users/${userId}/follow`, {
        method,
      });

      if (!response.ok) {
        // Revert on error
        toggleFollowInStore(userId, !currentIsFollowing);
        console.error('Failed to toggle follow');
      }
    } catch (error) {
      // Revert on error
      toggleFollowInStore(userId, !currentIsFollowing);
      console.error('Error toggling follow:', error);
    }
  };

  return { stats, loading: false, toggleFollow, refetch: fetchFollowStats };
};
