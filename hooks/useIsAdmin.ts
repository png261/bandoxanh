import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useIsAdmin() {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!isLoaded || !user) {
        console.log('useIsAdmin: User not loaded yet', { isLoaded, user: !!user });
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('useIsAdmin: Fetching admin status...');
        const response = await fetch('/api/users/me');
        console.log('useIsAdmin: Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('useIsAdmin: Response data:', data);
          setIsAdmin(data.isAdmin || false);
        } else {
          console.error('useIsAdmin: Response not OK');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, isLoaded]);

  return { isAdmin, loading };
}
