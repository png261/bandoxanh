'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UpcomingEvents from '@/components/UpcomingEvents';
import { useState, useEffect } from 'react';
import { Theme, NewsArticle, RecyclingEvent } from '@/types';
import React from 'react';
import { useNewsStore } from '@/store/newsStore';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';

interface NewsCardProps {
  article: NewsArticle;
  isFeatured?: boolean;
  onClick: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, isFeatured = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex ${isFeatured ? 'flex-col md:flex-row' : 'flex-col'} hover:border-brand-green dark:hover:border-brand-green hover:shadow-md transition-all duration-200 cursor-pointer h-full group`}>
    <img src={article.imageUrl} alt={article.title} className={`${isFeatured ? 'md:w-1/2' : ''} w-full h-40 sm:h-48 object-cover group-hover:brightness-105 transition-all`} />
    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
      <div>
        <span className="px-2 py-0.5 bg-brand-green-light text-brand-green-dark text-xs font-semibold rounded">{article.category}</span>
        <h3 className={`font-bold mt-2 sm:mt-2.5 text-brand-gray-dark dark:text-gray-100 ${isFeatured ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'} line-clamp-2 break-words`}>{article.title}</h3>
        <p className="text-xs sm:text-sm text-brand-gray-DEFAULT dark:text-gray-400 mt-2 line-clamp-3 break-words">{article.excerpt}</p>
      </div>
      <p className="text-xs text-brand-gray-DEFAULT dark:text-gray-400 mt-3">{article.date}</p>
    </div>
  </div>
);

interface NewsPageProps {
  navigateTo: (path: string, options?: any) => void;
}

const NewsPageComponent: React.FC<NewsPageProps> = ({ navigateTo }) => {
  const router = useRouter();
  // Use Zustand store for news and events
  const { newsArticles, events, loading, fetchNews, fetchEvents } = useNewsStore();

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, [fetchNews, fetchEvents]);

  const featuredArticle = newsArticles.find(a => a.isFeatured);
  const otherArticles = newsArticles
    .filter(a => !a.isFeatured)
    .sort((a, b) => 
      new Date(b.date.split('/').reverse().join('-')).getTime() - 
      new Date(a.date.split('/').reverse().join('-')).getTime()
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {featuredArticle && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-gray-dark dark:text-gray-100 mb-4 sm:mb-5 break-words">Tin nổi bật</h2>
          <NewsCard 
            article={featuredArticle} 
            isFeatured={true} 
            onClick={() => navigateTo(`/news/${featuredArticle.id}`)} 
          />
        </section>
      )}

      {/* Upcoming Events Section */}
      <section>
        <UpcomingEvents onEventClick={(event) => {
          router.push(`/map?lat=${event.latitude}&lng=${event.longitude}&zoom=15`);
        }} />
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-gray-dark dark:text-gray-100 mb-4 sm:mb-5 break-words">Tin tức khác</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {otherArticles.map(article => (
            <NewsCard 
              key={article.id} 
              article={article} 
              onClick={() => navigateTo(`/news/${article.id}`)} 
            />
          ))}
        </div>
      </section>
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
