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
    await react(type);
    setShowPicker(false);
    onReact?.();
  };

  const totalReactions = reactionData.reactions.reduce((sum, r) => sum + r.count, 0);
  const topReaction = reactionData.reactions.sort((a, b) => b.count - a.count)[0];

  return (
    <div className="relative">
      {/* Reaction Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          disabled={loading}
        >
          {reactionData.userReaction ? (
            <span className="text-lg">{REACTION_EMOJIS[reactionData.userReaction]}</span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">👍</span>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {reactionData.userReaction ? REACTION_LABELS[reactionData.userReaction] : 'Thích'}
          </span>
        </button>

        {/* Reaction Count */}
        {totalReactions > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            {topReaction && <span>{REACTION_EMOJIS[topReaction.type]}</span>}
            <span>{totalReactions}</span>
          </div>
        )}
      </div>

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
                className="group relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-125"
                title={REACTION_LABELS[type]}
              >
                <span className="text-2xl">{REACTION_EMOJIS[type]}</span>
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {REACTION_LABELS[type]}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Detailed Reactions Display */}
      {reactionData.reactions.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {reactionData.reactions.map((reaction) => (
            <div
              key={reaction.type}
              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
            >
              <span>{REACTION_EMOJIS[reaction.type]}</span>
              <span>{reaction.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;
