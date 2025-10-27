import { useState, useEffect, useCallback } from 'react';

export interface PostDetail {
  id: string;
  content: string;
  images?: string | string[];
  likes?: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
}

export function useUserPosts(userId: string | null) {
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}/posts`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data || []);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
