import React, { useState } from 'react';
import { FacebookIcon, XIcon, LinkIcon, TwitterIcon, LinkedInIcon, InstagramIcon, TelegramIcon, WhatsAppIcon, ZaloIcon } from './Icons';

interface ShareModalProps {
  url: string;
  title: string;
  text: string;
  onClose: () => void;
  type?: 'post' | 'news' | 'event'; // Loại nội dung để hiển thị tiêu đề phù hợp
}

const ShareModal: React.FC<ShareModalProps> = ({ url, title, text, onClose, type = 'post' }) => {
  const [copyStatus, setCopyStatus] = useState('Sao chép');

  const shareTitle = type === 'post' ? 'Chia sẻ bài viết' : 
                     type === 'news' ? 'Chia sẻ tin tức' : 
                     'Chia sẻ sự kiện';

  const shareTargets = [
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-7 h-7" />,
      url: `https://www.facebook.com/dialog/share?app_id=1355636276138350&href=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + ' - ' + text.substring(0, 200))}&display=popup`,
      color: 'text-blue-600 dark:text-blue-500',
    },
    {
      name: 'Zalo',
      icon: <ZaloIcon className="w-7 h-7" />,
      url: `https://page.zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(text.substring(0, 200))}`,
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-7 h-7" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n\n' + text.substring(0, 200) + '...\n\n' + url)}`,
      color: 'text-green-600 dark:text-green-500',
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon className="w-7 h-7" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + '\n' + text.substring(0, 200))}`,
      color: 'text-sky-500 dark:text-sky-400',
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon className="w-7 h-7" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=BảoVệMôiTrường,TáiChế`,
      color: 'text-gray-900 dark:text-gray-300',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon className="w-7 h-7" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'text-blue-700 dark:text-blue-600',
    },
  ];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
        setCopyStatus('Đã sao chép!');
        setTimeout(() => setCopyStatus('Sao chép'), 2000);
    });
  };

  const handleShare = (target: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Open share window with appropriate dimensions
    const width = target.name === 'Facebook' ? 600 : 550;
    const height = target.name === 'Facebook' ? 400 : 450;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      target.url, 
      'share-window', 
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-gray-dark dark:text-gray-100">{shareTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {shareTargets.map(target => (
            <a 
                href={target.url} 
                key={target.name} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-brand-green hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                onClick={(e) => handleShare(target, e)}
            >
              <span className={target.color}>{target.icon}</span>
              <span className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-green transition-colors">{target.name}</span>
            </a>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Hoặc sao chép liên kết</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                readOnly
                className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 bg-brand-green text-white font-semibold py-3 px-5 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
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
