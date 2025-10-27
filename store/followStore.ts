import { create } from 'zustand';

interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface FollowStoreState {
  userFollowStats: Map<number, FollowStats>;
  setUserFollowStats: (userId: number, stats: FollowStats) => void;
  toggleFollow: (userId: number, currentIsFollowing: boolean) => void;
  getUserFollowStats: (userId: number) => FollowStats | undefined;
}

export const useFollowStore = create<FollowStoreState>((set, get) => ({
  userFollowStats: new Map(),

  setUserFollowStats: (userId: number, stats: FollowStats) => {
    set((state) => {
      const newMap = new Map(state.userFollowStats);
      newMap.set(userId, stats);
      return { userFollowStats: newMap };
    });
  },

  toggleFollow: (userId: number, currentIsFollowing: boolean) => {
    set((state) => {
      const newMap = new Map(state.userFollowStats);
      const currentStats = newMap.get(userId);

      if (currentStats) {
        // Toggle follow status and update count
        const newStats: FollowStats = {
          ...currentStats,
          isFollowing: !currentIsFollowing,
          followersCount: currentIsFollowing
            ? Math.max(0, currentStats.followersCount - 1)
            : currentStats.followersCount + 1,
        };
        newMap.set(userId, newStats);
      }

      return { userFollowStats: newMap };
    });
  },

  getUserFollowStats: (userId: number) => {
    return get().userFollowStats.get(userId);
  },
}));
