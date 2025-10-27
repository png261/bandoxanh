'use client';

import { create } from 'zustand';

export type ReactionType = 'love' | 'like' | 'clap' | 'green_heart' | 'seedling' | 'recycle' | 'wow';

export interface Reaction {
  type: ReactionType;
  count: number;
}

export interface PostReactions {
  postId: number;
  reactions: Reaction[];
  userReaction: ReactionType | null;
}

interface ReactionsState {
  // Store reactions by postId
  postReactions: Map<number, PostReactions>;
  
  // Actions
  setPostReactions: (postId: number, reactions: Reaction[], userReaction: ReactionType | null) => void;
  updateReaction: (postId: number, type: ReactionType, userReaction: ReactionType | null) => void;
  getPostReactions: (postId: number) => PostReactions | null;
}

export const useReactionsStore = create<ReactionsState>((set, get) => ({
  postReactions: new Map(),

  setPostReactions: (postId, reactions, userReaction) =>
    set((state) => {
      const newMap = new Map(state.postReactions);
      newMap.set(postId, { postId, reactions, userReaction });
      return { postReactions: newMap };
    }),

  updateReaction: (postId, type, currentUserReaction) =>
    set((state) => {
      const newMap = new Map(state.postReactions);
      const existing = newMap.get(postId);
      
      if (!existing) {
        // First reaction on this post
        newMap.set(postId, {
          postId,
          reactions: [{ type, count: 1 }],
          userReaction: type,
        });
        return { postReactions: newMap };
      }

      // Create a copy of existing reactions
      let updatedReactions = [...existing.reactions];
      let newUserReaction: ReactionType | null = null;

      // If clicking the same reaction, remove it
      if (currentUserReaction === type) {
        // Find and decrease the count
        const reactionIndex = updatedReactions.findIndex(r => r.type === type);
        if (reactionIndex !== -1) {
          updatedReactions[reactionIndex] = {
            ...updatedReactions[reactionIndex],
            count: Math.max(0, updatedReactions[reactionIndex].count - 1)
          };
        }
        newUserReaction = null;
      } else {
        // Switching to a different reaction or adding new one
        
        // 1. Decrease old reaction count if user had one
        if (currentUserReaction) {
          const oldReactionIndex = updatedReactions.findIndex(r => r.type === currentUserReaction);
          if (oldReactionIndex !== -1) {
            updatedReactions[oldReactionIndex] = {
              ...updatedReactions[oldReactionIndex],
              count: Math.max(0, updatedReactions[oldReactionIndex].count - 1)
            };
          }
        }

        // 2. Increase new reaction count
        const newReactionIndex = updatedReactions.findIndex(r => r.type === type);
        if (newReactionIndex !== -1) {
          // Reaction type already exists, increase count
          updatedReactions[newReactionIndex] = {
            ...updatedReactions[newReactionIndex],
            count: updatedReactions[newReactionIndex].count + 1
          };
        } else {
          // New reaction type, add it
          updatedReactions.push({ type, count: 1 });
        }
        
        newUserReaction = type;
      }

      // Filter out reactions with 0 count to keep the array clean
      updatedReactions = updatedReactions.filter(r => r.count > 0);

      newMap.set(postId, {
        postId,
        reactions: updatedReactions,
        userReaction: newUserReaction,
      });

      return { postReactions: newMap };
    }),

  getPostReactions: (postId) => {
    const state = get();
    return state.postReactions.get(postId) || null;
  },
}));
