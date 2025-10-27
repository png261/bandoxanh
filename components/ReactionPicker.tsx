'use client';

import React, { useState } from 'react';
import { useReactions, ReactionType, REACTION_EMOJIS, REACTION_LABELS } from '@/hooks/useReactions';

interface ReactionPickerProps {
  postId: number;
  onReact?: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ postId, onReact }) => {
  const { reactionData, loading, react } = useReactions(postId);
  const [showPicker, setShowPicker] = useState(false);

  const handleReact = async (type: ReactionType) => {
    setShowPicker(false);
    await react(type);
    // Don't call onReact - let the component update itself
  };

  const totalReactions = reactionData.reactions.reduce((sum, r) => sum + r.count, 0);
  const topReaction = reactionData.reactions.length > 0 
    ? [...reactionData.reactions].sort((a, b) => b.count - a.count)[0]
    : null;

  return (
    <div className="relative">
      {/* Reaction Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-1.5 sm:gap-2 hover:text-brand-green transition-colors"
        disabled={loading}
      >
        {reactionData.userReaction ? (
          <span className="text-base sm:text-lg">{REACTION_EMOJIS[reactionData.userReaction]}</span>
        ) : (
          <span className="text-base sm:text-lg">👍</span>
        )}
        <span className="text-xs sm:text-sm">
          {totalReactions > 0 ? totalReactions : '0'}
        </span>
      </button>

      {/* Reaction Picker Dropdown */}
      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1">
            {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleReact(type)}
                className="group relative p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-125"
                title={REACTION_LABELS[type]}
              >
                <span className="text-xl sm:text-2xl">{REACTION_EMOJIS[type]}</span>
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                  {REACTION_LABELS[type]}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReactionPicker;
