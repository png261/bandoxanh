'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NEWS_ARTICLES, EVENTS } from '@/constants';
import { CalendarIcon } from '@/components/Icons';
import { useState, useEffect } from 'react';
import { Theme, NewsArticle, RecyclingEvent } from '@/types';
import React from 'react';

interface NewsCardProps {
  article: NewsArticle;
  isFeatured?: boolean;
  onClick: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, isFeatured = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex ${isFeatured ? 'flex-col md:flex-row' : 'flex-col'} hover:border-brand-green dark:hover:border-brand-green transition-colors duration-200 cursor-pointer h-full`}>
    <img src={article.imageUrl} alt={article.title} className={`${isFeatured ? 'md:w-1/2' : ''} w-full h-56 object-cover`} />
    <div className="p-6 flex flex-col justify-between flex-1">
      <div>
        <span className="px-2.5 py-1 bg-brand-green-light text-brand-green-dark text-xs font-semibold rounded-full">{article.category}</span>
        <h3 className={`font-bold mt-3 text-brand-gray-dark dark:text-gray-100 ${isFeatured ? 'text-2xl' : 'text-xl'}`}>{article.title}</h3>
        <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-400 mt-2 line-clamp-3">{article.excerpt}</p>
      </div>
      <p className="text-xs text-brand-gray-DEFAULT dark:text-gray-400 mt-4">{article.date}</p>
    </div>
  </div>
);

const EventCard: React.FC<{ event: RecyclingEvent }> = ({ event }) => (
    <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-200 cursor-pointer h-full">
      <img src={event.image} alt={event.name} className="w-full h-56 object-cover" />
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
            <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-full">Sự kiện</span>
            <h3 className="font-bold text-xl mt-3 text-purple-700 dark:text-purple-400">{event.name}</h3>
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{event.date} - {event.time}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{event.description}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Tổ chức bởi: {event.organizer}</p>
      </div>
    </div>
);

interface NewsPageProps {
  navigateTo: (path: string, options?: any) => void;
}

const NewsPageComponent: React.FC<NewsPageProps> = ({ navigateTo }) => {
  const featuredArticle = NEWS_ARTICLES.find(a => a.isFeatured);
  const otherArticles = NEWS_ARTICLES.filter(a => !a.isFeatured).sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime());

  return (
    <div className="space-y-16">
      {featuredArticle && (
        <section>
          <h2 className="text-3xl font-bold text-brand-gray-dark dark:text-gray-100 mb-6">Tin nổi bật</h2>
          <NewsCard 
            article={featuredArticle} 
            isFeatured={true} 
            onClick={() => navigateTo(`/news/${featuredArticle.id}`)} 
          />
        </section>
      )}

      {EVENTS.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-brand-gray-dark dark:text-gray-100 mb-6">Sự kiện sắp diễn ra</h2>
          <div className="grid md:grid-cols-2 gap-8">
              {EVENTS.map(event => (
                  <EventCard key={event.id} event={event} />
              ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-brand-gray-dark dark:text-gray-100 mb-6">Tin tức khác</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherArticles.map((article) => (
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
        <main className="container mx-auto px-4 sm:px-6 py-10">
          <NewsPageComponent navigateTo={navigateTo} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
