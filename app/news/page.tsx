'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UpcomingEvents from '@/components/UpcomingEvents';
import ShareModal from '@/components/ShareModal';
import { useState, useEffect } from 'react';
import { Theme, NewsArticle, RecyclingEvent } from '@/types';
import React from 'react';
import { useNewsStore } from '@/store/newsStore';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import { ShareIcon } from '@/components/Icons';

interface NewsCardProps {
  article: NewsArticle;
  isFeatured?: boolean;
  onClick: () => void;
  onShare: (e: React.MouseEvent) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, isFeatured = false, onClick, onShare }) => (
  <div 
    className={`bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-brand-green dark:hover:border-brand-green hover:shadow-md transition-all duration-200 h-full group relative flex flex-col ${isFeatured ? 'md:flex-row md:max-h-80' : ''}`}>
    
    {/* Share Button */}
    <button
      onClick={onShare}
      className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full hover:bg-brand-green hover:text-white dark:hover:bg-brand-green transition-all shadow-md z-10 opacity-0 group-hover:opacity-100"
      title="Chia sẻ tin tức"
    >
      <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>

    {/* Clickable Content */}
    <div onClick={onClick} className="cursor-pointer flex-1 flex flex-col h-full">
      {/* Image */}
      <div className={`relative overflow-hidden ${isFeatured ? 'md:w-1/2 md:h-full' : 'w-full'}`}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isFeatured ? 'h-48 sm:h-56' : 'h-48 sm:h-52'}`}
          loading="lazy" 
        />
      </div>

      {/* Content */}
      <div className={`p-4 sm:p-5 flex flex-col flex-1 ${isFeatured ? 'md:w-1/2' : ''}`}>
        <div className="flex-1">
          {/* Category Badge */}
          <span className="inline-block px-2.5 py-1 bg-brand-green-light text-brand-green-dark text-xs font-semibold rounded-md">
            {article.category}
          </span>
          
          {/* Title */}
          <h3 className={`font-bold mt-2.5 text-brand-gray-dark dark:text-gray-100 line-clamp-2 break-words group-hover:text-brand-green dark:group-hover:text-brand-green transition-colors ${isFeatured ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'}`}>
            {article.title}
          </h3>
          
          {/* Excerpt */}
          <p className={`text-brand-gray-DEFAULT dark:text-gray-400 mt-2 break-words ${isFeatured ? 'text-sm line-clamp-3' : 'text-xs sm:text-sm line-clamp-3'}`}>
            {article.excerpt}
          </p>
        </div>
        
        {/* Date */}
        <p className="text-xs text-brand-gray-DEFAULT dark:text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          📅 {article.date}
        </p>
      </div>
    </div>
  </div>
);

interface NewsPageProps {
  navigateTo: (path: string, options?: any) => void;
}

const NewsPageComponent: React.FC<NewsPageProps> = ({ navigateTo }) => {
  const router = useRouter();
  const [shareModalData, setShareModalData] = React.useState<{ url: string; title: string; text: string; type: 'post' | 'news' | 'event' } | null>(null);
  
  // Use Zustand store for news and events
  const { newsArticles, loading, fetchNews, fetchEvents } = useNewsStore();

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, [fetchNews, fetchEvents]);

  const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    // Use dynamic share route for better OG tags
    const newsUrl = `${window.location.origin}/share/news/${article.id}`;
    setShareModalData({
      url: newsUrl,
      title: article.title,
      text: article.excerpt,
      type: 'news'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Upcoming Events Section */}
      <section>
        <UpcomingEvents onEventClick={(event) => {
          router.push(`/map?lat=${event.latitude}&lng=${event.longitude}&zoom=15`);
        }} />
      </section>

      {/* All News Articles */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-gray-dark dark:text-gray-100 mb-4 sm:mb-6 break-words">Tin tức</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {newsArticles.map(article => (
            <NewsCard 
              key={article.id} 
              article={article} 
              onClick={() => navigateTo(`/news/${article.id}`)} 
              onShare={(e) => handleShare(article, e)}
            />
          ))}
        </div>
      </section>

      {/* Share Modal */}
      {shareModalData && (
        <ShareModal
          url={shareModalData.url}
          title={shareModalData.title}
          text={shareModalData.text}
          type={shareModalData.type}
          onClose={() => setShareModalData(null)}
        />
      )}
    </div>
  );
};

export default function News() {
  const router = useRouter();
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setIsSidebarCollapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const navigateTo = (path: string, options?: any) => {
    window.scrollTo(0, 0);
    if (options?.articleId) {
      router.push(`/news/${options.articleId}`);
    } else {
      router.push(path);
    }
  };

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}> 
        <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <NewsPageComponent navigateTo={navigateTo} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
