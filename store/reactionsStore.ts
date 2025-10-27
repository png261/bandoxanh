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

      let updatedReactions = [...existing.reactions];
      let newUserReaction: ReactionType | null = null;

      // If clicking the same reaction, remove it
      if (currentUserReaction === type) {
        updatedReactions = updatedReactions
          .map(r => r.type === type ? { ...r, count: Math.max(0, r.count - 1) } : r)
          .filter(r => r.count > 0);
        newUserReaction = null;
      } else {
        // Remove old reaction count
        if (currentUserReaction) {
          updatedReactions = updatedReactions
            .map(r => r.type === currentUserReaction ? { ...r, count: Math.max(0, r.count - 1) } : r)
            .filter(r => r.count > 0);
        }

        // Add new reaction count
        const existingReaction = updatedReactions.find(r => r.type === type);
        if (existingReaction) {
          updatedReactions = updatedReactions.map(r =>
            r.type === type ? { ...r, count: r.count + 1 } : r
          );
        } else {
          updatedReactions.push({ type, count: 1 });
        }
        newUserReaction = type;
      }

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
