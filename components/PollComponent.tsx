import React, { useState, useMemo } from 'react';
import { Poll } from '../types';
import { CheckCircleIcon } from './Icons';

const PollComponent: React.FC<{ poll: Poll }> = ({ poll }) => {
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);
  const [pollResults, setPollResults] = useState(poll.options);

  const totalVotes = useMemo(() => {
    return pollResults.reduce((sum, option) => sum + option.votes, 0);
  }, [pollResults]);

  const handleVote = (optionId: number) => {
    if (votedOptionId) return;

    setVotedOptionId(optionId);
    setPollResults(prevResults =>
      prevResults.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );
  };
  
  return (
    <div className="my-3 px-5">
      <p className="font-bold text-lg text-brand-gray-dark dark:text-gray-100 mb-3">{poll.question}</p>
      <div className="space-y-3">
        {pollResults.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const hasVotedForThis = votedOptionId === option.id;

          if (votedOptionId) {
            return (
              <div key={option.id} className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-hidden bg-gray-50 dark:bg-brand-gray-dark/50">
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-green-light/50 dark:bg-brand-green/30 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="relative flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className={`font-semibold ${hasVotedForThis ? 'text-brand-green-dark dark:text-brand-green-light' : 'text-gray-700 dark:text-gray-300'}`}>{option.text}</span>
                    {hasVotedForThis && <CheckCircleIcon className="w-5 h-5 text-brand-green dark:text-brand-green-light ml-2" />}
                  </div>
                  <span className="font-bold text-gray-600 dark:text-gray-300">{percentage}%</span>
                </div>
              </div>
            );
          } else {
            return (
              <button 
                key={option.id}
                onClick={() => handleVote(option.id)}
                className="w-full text-left border border-gray-300 dark:border-gray-600 rounded-lg p-3 hover:bg-brand-green-light/30 dark:hover:bg-brand-green/20 hover:border-brand-green dark:hover:border-brand-green-light transition-colors duration-200 font-semibold text-gray-700 dark:text-gray-200"
              >
                {option.text}
              </button>
            );
          }
        })}
      </div>
      {votedOptionId && <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-2">{totalVotes} phiếu bầu</p>}
    </div>
  );
};

export default PollComponent;
