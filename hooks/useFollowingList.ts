import { useState, useEffect } from 'react';

export const useFollowingList = (userId: string | undefined) => {
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) {
        setFollowingIds([]);
        return;
      }

      setLoading(true);
      try {
        // Get current user's database ID first
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          setFollowingIds([]);
          return;
        }
        
        const userData = await userResponse.json();
        const dbUserId = userData.id;

        // Fetch following list
        const response = await fetch(`/api/users/${dbUserId}/following`);
        if (response.ok) {
          const data = await response.json();
          const ids = data.users?.map((user: any) => user.id) || [];
          setFollowingIds(ids);
        }
      } catch (error) {
        console.error('Error fetching following list:', error);
        setFollowingIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return { followingIds, loading };
};
