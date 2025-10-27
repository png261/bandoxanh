'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Stats {
  stations: number;
  events: number;
  news: number;
  posts: number;
  users: number;
  reactions: number;
  follows: number;
  comments: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [stats, setStats] = useState<Stats>({
    stations: 0,
    events: 0,
    news: 0,
    posts: 0,
    users: 0,
    reactions: 0,
    follows: 0,
    comments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin (you can customize this logic)
    if (isLoaded && !user) {
      router.push('/');
      return;
    }

    async function fetchStats() {
      try {
        const [stationsRes, eventsRes, newsRes, postsRes] = await Promise.all([
          fetch('/api/stations'),
          fetch('/api/events'),
          fetch('/api/news'),
          fetch('/api/posts'),
        ]);

        const [stations, events, news, posts] = await Promise.all([
          stationsRes.json(),
          eventsRes.json(),
          newsRes.json(),
          postsRes.json(),
        ]);

        // Calculate additional stats from posts data
        let totalReactions = 0;
        let totalComments = 0;
        
        if (Array.isArray(posts)) {
          posts.forEach((post: any) => {
            totalReactions += post.likesCount || 0;
            totalComments += post.comments?.length || 0;
          });
        }

        setStats({
          stations: stations.length || 0,
          events: events.length || 0,
          news: news.length || 0,
          posts: Array.isArray(posts) ? posts.length : 0,
          users: 0, // Would need a users API endpoint
          reactions: totalReactions,
          follows: 0, // Would need a follows API endpoint
          comments: totalComments,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [isLoaded, user, router]);

  const sections = [
    {
      title: 'Điểm thu gom',
      description: 'Quản lý các điểm thu gom rác thải',
      icon: '📍',
      count: stats.stations,
      href: '/admin/stations',
      color: 'text-brand-green',
      bgColor: 'bg-brand-green-light',
      borderColor: 'border-brand-green',
    },
    {
      title: 'Sự kiện',
      description: 'Quản lý các sự kiện tái chế',
      icon: '📅',
      count: stats.events,
      href: '/admin/events',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Tin tức',
      description: 'Quản lý tin tức và bài viết',
      icon: '📰',
      count: stats.news,
      href: '/admin/news',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Bài đăng',
      description: 'Theo dõi và kiểm duyệt bài viết',
      icon: '💬',
      count: stats.posts,
      href: '/admin/posts',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Phản ứng',
      description: 'Tổng số reactions từ người dùng',
      icon: '❤️',
      count: stats.reactions,
      href: '/community',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200',
    },
    {
      title: 'Bình luận',
      description: 'Tổng số bình luận trong cộng đồng',
      icon: '💭',
      count: stats.comments,
      href: '/community',
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-gray-light dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-gray-dark dark:text-gray-300 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-light dark:bg-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-gray-dark dark:text-white mb-2">
            🎛️ Quản trị hệ thống
          </h1>
          <p className="text-brand-gray-DEFAULT dark:text-gray-400">
            Chào mừng {user?.firstName || 'Admin'}! Quản lý toàn bộ nội dung của BandoXanh
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {sections.map((section) => {
            return (
              <Link
                key={section.title}
                href={section.href}
                className="group block p-6 bg-white dark:bg-brand-gray-dark rounded-xl shadow-sm hover:shadow-lg transition-all border-2 border-gray-100 dark:border-gray-700 hover:border-brand-green dark:hover:border-brand-green transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${section.bgColor} group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{section.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-brand-gray-dark dark:text-white">
                      {section.count}
                    </div>
                    <div className="text-xs text-brand-gray-DEFAULT dark:text-gray-400 uppercase tracking-wide">
                      Total
                    </div>
                  </div>
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${section.color}`}>
                  {section.title}
                </h3>
                <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-brand-gray-dark rounded-xl shadow-sm border-2 border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-brand-gray-dark dark:text-white mb-6 flex items-center gap-2">
            ⚡ Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/stations"
              className="group px-6 py-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-lg text-center font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="block mb-1 text-2xl">📍</span>
              Thêm điểm thu gom
            </Link>
            <Link
              href="/admin/events"
              className="group px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="block mb-1 text-2xl">📅</span>
              Thêm sự kiện
            </Link>
            <Link
              href="/admin/news"
              className="group px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="block mb-1 text-2xl">📰</span>
              Thêm tin tức
            </Link>
          </div>
        </div>

        {/* Recent Activity & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info Card */}
          <div className="bg-gradient-to-br from-brand-green-light to-brand-green/20 dark:from-brand-green/20 dark:to-brand-green/5 border-2 border-brand-green/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-white dark:bg-brand-gray-dark p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-brand-green"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-gray-dark dark:text-white mb-2">
                  Quyền quản trị
                </h3>
                <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-300">
                  Bạn đang đăng nhập với quyền quản trị viên. Bạn có toàn quyền quản lý nội dung và người dùng trên nền tảng BandoXanh.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white dark:bg-brand-gray-dark border-2 border-gray-100 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-bold text-brand-gray-dark dark:text-white mb-4 flex items-center gap-2">
              📊 Tổng quan nền tảng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">Tổng nội dung</span>
                <span className="font-bold text-brand-gray-dark dark:text-white">
                  {stats.stations + stats.events + stats.news + stats.posts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">Tương tác</span>
                <span className="font-bold text-brand-gray-dark dark:text-white">
                  {stats.reactions + stats.comments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">Mức độ hoạt động</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-green text-white">
                  🔥 Cao
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
