'use client';

import React from 'react';
import { BADGE_COLORS } from '@/lib/utils/constants';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  earnedAt?: Date | string;
  scannedAt?: Date | string | null;
}

interface BadgeDisplayProps {
  badges: Badge[];
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">🏆</div>
        <p>Chưa có huy hiệu nào</p>
        <p className="text-sm mt-1">Quét mã QR để nhận huy hiệu đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {badges.map((badge) => {
        const colorClass = BADGE_COLORS[badge.color] || BADGE_COLORS.blue;
        
        return (
          <div
            key={badge.id}
            className={`${colorClass} rounded-lg p-4 border-2 transition-all hover:scale-105 cursor-pointer relative group`}
          >
            {/* Badge Icon */}
            <div className="text-4xl mb-2 text-center">
              {badge.icon}
            </div>

            {/* Badge Name */}
            <h3 className="font-bold text-sm text-center mb-1 line-clamp-1">
              {badge.name}
            </h3>

            {/* Badge Category */}
            <p className="text-xs text-center opacity-75 mb-2">
              {badge.category}
            </p>

            {/* Earned Date */}
            {badge.earnedAt && (
              <p className="text-xs text-center opacity-60">
                {new Date(badge.earnedAt).toLocaleDateString('vi-VN')}
              </p>
            )}

            {/* Scanned Badge Indicator */}
            {badge.scannedAt && (
              <div className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {badge.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
