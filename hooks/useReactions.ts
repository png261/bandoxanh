import { useState, useEffect } from 'react';
import { useReactionsStore } from '@/store/reactionsStore';

export type ReactionType = 'love' | 'like' | 'clap' | 'green_heart' | 'seedling' | 'recycle' | 'wow';

export interface Reaction {
  type: ReactionType;
  count: number;
}

export interface ReactionData {
  reactions: Reaction[];
  userReaction: ReactionType | null;
}

export const useReactions = (postId: number) => {
  const { postReactions, setPostReactions, updateReaction, getPostReactions } = useReactionsStore();

  // Get from store or initialize empty
  const storedData = getPostReactions(postId);
  const [reactionData, setReactionData] = useState<ReactionData>(
    storedData || { reactions: [], userReaction: null }
  );

  // Update local state when store changes
  useEffect(() => {
    const stored = getPostReactions(postId);
    if (stored) {
      setReactionData({ reactions: stored.reactions, userReaction: stored.userReaction });
    }
  }, [postReactions, postId, getPostReactions]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/react`);
      if (response.ok) {
        const data = await response.json();
        // Process data
        const reactions: Reaction[] = data.reactions.map((r: any) => ({
          type: r.type,
          count: r._count || 0,
        }));
        
        // Find current user's reaction
        const userReaction = data.users?.find((r: any) => r.isCurrentUser)?.type || null;
        
        // Update store
        setPostReactions(postId, reactions, userReaction);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  useEffect(() => {
    if (postId && !storedData) {
      fetchReactions();
    }
  }, [postId]);

  const react = async (type: ReactionType) => {
    // Optimistic update in store FIRST - instant UI update
    const currentUserReaction = reactionData.userReaction;
    updateReaction(postId, type, currentUserReaction);
    
    try {
      const response = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        // Only revert and fetch from server on error
        console.error('Failed to update reaction on server');
        await fetchReactions();
      }
      // Success - no need to fetch again, optimistic update is correct
    } catch (error) {
      console.error('Error reacting to post:', error);
      // Revert on error - fetch from server
      await fetchReactions();
    }
  };

  return { reactionData, react, refetch: fetchReactions };
};

// Reaction emoji mapping
export const REACTION_EMOJIS: Record<ReactionType, string> = {
  love: '❤️',
  like: '👍',
  clap: '👏',
  green_heart: '💚',
  seedling: '🌱',
  recycle: '♻️',
  wow: '😮',
};

export const REACTION_LABELS: Record<ReactionType, string> = {
  love: 'Yêu thích',
  like: 'Thích',
  clap: 'Tuyệt vời',
  green_heart: 'Xanh',
  seedling: 'Mầm xanh',
  recycle: 'Tái chế',
  wow: 'Wow',
};
