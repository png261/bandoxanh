'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsStore } from '@/store/newsStore';
import { ShareIcon, ArrowRightIcon } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import UpcomingEvents from '@/components/UpcomingEvents';
import ShareModal from '@/components/ShareModal';
import { NewsArticle } from '@/types';

interface NewsCardProps {
    article: NewsArticle;
    isFeatured?: boolean;
    onClick: () => void;
    onShare: (e: React.MouseEvent) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onClick, onShare }) => (
    <div
        className="bg-white dark:bg-brand-gray-dark rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:scale-[1.02]"
        onClick={onClick}
    >
        <div className="relative h-56 overflow-hidden">
            {article.imageUrl ? (
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-green to-teal-600 flex items-center justify-center">
                    <span className="text-5xl">📰</span>
                </div>
            )}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onShare}
                    className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-brand-green hover:text-white transition-colors"
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
            </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-green/10 text-brand-green rounded-full">
                    {article.category || 'Tin tức'}
                </span>
                <span className="text-xs text-gray-400">• {article.date}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-brand-green transition-colors">
                {article.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                {article.excerpt}
            </p>

            <div className="flex items-center text-brand-green font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Đọc tiếp <ArrowRightIcon className="w-4 h-4 ml-1" />
            </div>
        </div>
    </div>
);

const HeroCard: React.FC<{ article: NewsArticle; onClick: () => void }> = ({ article, onClick }) => (
    <div
        onClick={onClick}
        className="cursor-pointer relative rounded-[2.5rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] group mb-12 shadow-2xl"
    >
        <div className="absolute inset-0">
            {article.imageUrl ? (
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl w-full">
            <span className="inline-block px-4 py-1.5 bg-brand-green text-white font-bold text-sm tracking-widest uppercase rounded-full mb-4 shadow-lg">
                Tâm điểm
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-brand-green-light transition-colors shadow-black drop-shadow-lg">
                {article.title}
            </h2>
            <p className="text-gray-200 text-lg md:text-xl line-clamp-2 mb-6 max-w-2xl drop-shadow-md">
                {article.excerpt}
            </p>
            <div className="flex items-center gap-3">
                <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-brand-green hover:text-white transition-all flex items-center gap-2 shadow-xl">
                    Đọc ngay <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
);

interface NewsPageProps {
    navigateTo: (path: string, options?: any) => void;
}

export const NewsPageComponent: React.FC<NewsPageProps> = ({ navigateTo }) => {
    const router = useRouter();
    const [shareModalData, setShareModalData] = useState<{ url: string; title: string; text: string; type: 'post' | 'news' | 'event' } | null>(null);
    const { newsArticles, loading, fetchNews, fetchEvents } = useNewsStore();

    useEffect(() => {
        fetchNews();
        fetchEvents();
    }, [fetchNews, fetchEvents]);

    const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
        e.stopPropagation();
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
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Split into Hero (first item) and Grid (rest)
    const featuredArticle = newsArticles[0];
    const gridArticles = newsArticles.slice(1);

    return (
        <div className="space-y-12 pb-20">
            {/* Featured Hero */}
            {featuredArticle && (
                <section>
                    <HeroCard article={featuredArticle} onClick={() => navigateTo(`/news/${featuredArticle.id}`)} />
                </section>
            )}

            {/* Events Section - Horizontal Scroll */}
            <section>
                <UpcomingEvents onEventClick={(event) => {
                    router.push(`/map?lat=${event.latitude}&lng=${event.longitude}&zoom=15`);
                }} />
            </section>

            {/* Latest News Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Tin mới nhất</h2>
                    <button className="text-brand-green font-bold text-sm hover:underline">Xem tất cả</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridArticles.map(article => (
                        <NewsCard
                            key={article.id}
                            article={article}
                            onClick={() => navigateTo(`/news/${article.id}`)}
                            onShare={(e) => handleShare(article, e)}
                        />
                    ))}
                </div>
            </section>

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
