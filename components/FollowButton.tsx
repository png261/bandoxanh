'use client';

import React from 'react';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  userId: number;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, className = '' }) => {
  const { stats, loading, toggleFollow } = useFollow(userId);

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        stats.isFollowing
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          : 'bg-brand-green text-white hover:bg-brand-green-dark'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? '...' : stats.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
    </button>
  );
};

export default FollowButton;
