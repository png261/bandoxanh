import { useState, useEffect } from 'react';

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const useFollow = (userId: number) => {
  const [stats, setStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchFollowStats = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          isFollowing: data.isFollowing || false,
        });
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFollowStats();
    }
  }, [userId]);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const method = stats.isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`/api/users/${userId}/follow`, {
        method,
      });

      if (response.ok) {
        // Optimistic update
        setStats(prev => ({
          ...prev,
          followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
          isFollowing: !prev.isFollowing,
        }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, toggleFollow, refetch: fetchFollowStats };
};
