import { useState, useEffect } from 'react';

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
  const [reactionData, setReactionData] = useState<ReactionData>({
    reactions: [],
    userReaction: null,
  });
  const [loading, setLoading] = useState(false);

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
        
        setReactionData({ reactions, userReaction });
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchReactions();
    }
  }, [postId]);

  const react = async (type: ReactionType) => {
    setLoading(true);
    
    // Optimistic update
    const currentUserReaction = reactionData.userReaction;
    const updatedReactions = [...reactionData.reactions];
    
    // If clicking the same reaction, remove it
    if (currentUserReaction === type) {
      setReactionData({
        reactions: updatedReactions.map(r => 
          r.type === type ? { ...r, count: Math.max(0, r.count - 1) } : r
        ).filter(r => r.count > 0),
        userReaction: null,
      });
    } else {
      // Remove old reaction count
      let reactions = updatedReactions.map(r => 
        r.type === currentUserReaction ? { ...r, count: Math.max(0, r.count - 1) } : r
      ).filter(r => r.count > 0);
      
      // Add new reaction count
      const existingReaction = reactions.find(r => r.type === type);
      if (existingReaction) {
        reactions = reactions.map(r => 
          r.type === type ? { ...r, count: r.count + 1 } : r
        );
      } else {
        reactions.push({ type, count: 1 });
      }
      
      setReactionData({
        reactions,
        userReaction: type,
      });
    }
    
    try {
      const response = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        // Fetch actual data from server to confirm
        await fetchReactions();
      } else {
        // Revert on error
        setReactionData({
          reactions: reactionData.reactions,
          userReaction: reactionData.userReaction,
        });
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
      // Revert on error
      setReactionData({
        reactions: reactionData.reactions,
        userReaction: reactionData.userReaction,
      });
    } finally {
      setLoading(false);
    }
  };

  return { reactionData, loading, react, refetch: fetchReactions };
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
