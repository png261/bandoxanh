import { useState, useEffect, useCallback } from 'react';

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  earnedAt?: Date | string;
  scannedAt?: Date | string | null;
}

export function useBadges(userId: string | null) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}/badges`);
      
      if (response.ok) {
        const data = await response.json();
        setBadges(data || []);
      } else {
        setBadges([]);
      }
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch badges');
      setBadges([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const addBadge = useCallback((badge: Badge) => {
    setBadges(prev => [badge, ...prev]);
  }, []);

  return { badges, loading, error, refetch: fetchBadges, addBadge };
}
