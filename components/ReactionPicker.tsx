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
  };

  const handleMainButtonClick = () => {
    // If user already reacted, remove the reaction
    if (reactionData.userReaction) {
      handleReact(reactionData.userReaction);
    } else {
      // Otherwise, show the picker
      setShowPicker(!showPicker);
    }
  };

  const totalReactions = reactionData.reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="relative flex items-center gap-2">
      {/* Reaction Button Group */}
      <div className="flex items-center">
        {/* Main Reaction Button */}
        <button
          onClick={handleMainButtonClick}
          className={`flex items-center gap-1.5 sm:gap-2 transition-colors ${
            reactionData.userReaction 
              ? 'text-brand-green' 
              : 'text-gray-600 dark:text-gray-400 hover:text-brand-green'
          }`}
          disabled={loading}
          title={reactionData.userReaction ? `Bỏ ${REACTION_LABELS[reactionData.userReaction]}` : 'Thêm reaction'}
        >
          {reactionData.userReaction ? (
            <span className="text-base sm:text-lg">{REACTION_EMOJIS[reactionData.userReaction]}</span>
          ) : (
            <span className="text-base sm:text-lg">👍</span>
          )}
          <span className="text-xs sm:text-sm font-medium">
            {reactionData.userReaction ? REACTION_LABELS[reactionData.userReaction] : 'Thích'}
          </span>
        </button>

        {/* Dropdown arrow to show picker when user already reacted */}
        {reactionData.userReaction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
            className="ml-1 text-brand-green hover:text-brand-green/80 transition-colors"
            disabled={loading}
            title="Đổi reaction"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Reaction Counts - GitHub Style */}
      {reactionData.reactions.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {reactionData.reactions
            .sort((a, b) => b.count - a.count)
            .map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReact(reaction.type)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                  reactionData.userReaction === reaction.type
                    ? 'bg-brand-green/10 border-brand-green text-brand-green dark:bg-brand-green/20'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-green'
                }`}
                title={REACTION_LABELS[reaction.type]}
              >
                <span>{REACTION_EMOJIS[reaction.type]}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
        </div>
      )}

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
