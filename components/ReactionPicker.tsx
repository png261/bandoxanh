'use client';

import React from 'react';
import { useReactions, ReactionType, REACTION_EMOJIS, REACTION_LABELS } from '@/hooks/useReactions';

interface ReactionPickerProps {
  postId: number;
  onReact?: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ postId, onReact }) => {
  const { reactionData, react } = useReactions(postId);

  const handleReact = async (type: ReactionType) => {
    await react(type);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* All Reaction Buttons - Always Visible */}
      {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => {
        const reactionCount = reactionData.reactions.find(r => r.type === type)?.count || 0;
        const isUserReaction = reactionData.userReaction === type;
        
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm border transition-all hover:scale-110 ${
              isUserReaction
                ? 'bg-brand-green/10 border-brand-green text-brand-green dark:bg-brand-green/20 font-semibold'
                : reactionCount > 0
                ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-green'
                : 'bg-transparent border-gray-200 dark:border-gray-700 hover:border-brand-green opacity-60 hover:opacity-100'
            }`}
            title={REACTION_LABELS[type]}
          >
            <span className="text-base sm:text-lg">{REACTION_EMOJIS[type]}</span>
            {reactionCount > 0 && (
              <span className={`font-medium text-xs ${isUserReaction ? 'text-brand-green' : 'text-gray-600 dark:text-gray-400'}`}>
                {reactionCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionPicker;
