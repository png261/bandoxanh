import React, { useState } from 'react';
import { FacebookIcon, XIcon, LinkIcon, TwitterIcon, LinkedInIcon } from './Icons';

interface ShareModalProps {
  url: string;
  title: string;
  text: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ url, title, text, onClose }) => {
  const [copyStatus, setCopyStatus] = useState('Sao chép');

  const shareTargets = [
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-8 h-8" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      color: 'text-blue-600',
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon className="w-8 h-8" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'text-sky-500 dark:text-gray-300',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon className="w-8 h-8" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
      color: 'text-blue-700',
    },
  ];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
        setCopyStatus('Đã sao chép!');
        setTimeout(() => setCopyStatus('Sao chép'), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-gray-dark dark:text-gray-100">Chia sẻ bài viết</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {shareTargets.map(target => (
            <a 
                href={target.url} 
                key={target.name} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-brand-green transition-colors group"
                onClick={(e) => {
                    e.preventDefault();
                    window.open(target.url, 'share-window', 'height=450,width=550,toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0');
                }}
            >
              <span className={target.color}>{target.icon}</span>
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-green">{target.name}</span>
            </a>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Hoặc sao chép liên kết</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 focus:ring-0 focus:border-gray-400"
            />
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              {copyStatus}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
