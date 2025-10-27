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
    {
      title: 'Quản lý Admin',
      description: 'Thêm và quản lý quyền admin',
      icon: '👥',
      count: stats.users,
      href: '/admin/users',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200',
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🎛️ Bảng điều khiển Admin
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Chào mừng {user?.firstName || 'Admin'}! Quản lý nội dung BandoXanh
              </p>
            </div>
            <Link
              href="/admin/help"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <span className="text-xl">❓</span>
              <span>Hướng dẫn</span>
            </Link>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📍</span>
              <span className="text-3xl font-bold text-green-600">{stats.stations}</span>
            </div>
            <div className="text-gray-700 font-medium">Điểm thu gom</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📅</span>
              <span className="text-3xl font-bold text-blue-600">{stats.events}</span>
            </div>
            <div className="text-gray-700 font-medium">Sự kiện</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📰</span>
              <span className="text-3xl font-bold text-purple-600">{stats.news}</span>
            </div>
            <div className="text-gray-700 font-medium">Tin tức</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">💬</span>
              <span className="text-3xl font-bold text-orange-600">{stats.posts}</span>
            </div>
            <div className="text-gray-700 font-medium">Bài đăng</div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Quản lý nội dung
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/stations"
              className="group flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border-2 border-green-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">📍</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Điểm thu gom</div>
                  <div className="text-sm text-gray-600">Quản lý điểm thu gom rác thải</div>
                </div>
              </div>
              <span className="text-2xl text-green-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/admin/events"
              className="group flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border-2 border-blue-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">📅</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Sự kiện</div>
                  <div className="text-sm text-gray-600">Quản lý sự kiện tái chế</div>
                </div>
              </div>
              <span className="text-2xl text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/admin/news"
              className="group flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border-2 border-purple-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">📰</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Tin tức</div>
                  <div className="text-sm text-gray-600">Quản lý tin tức môi trường</div>
                </div>
              </div>
              <span className="text-2xl text-purple-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/admin/users"
              className="group flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-lg border-2 border-indigo-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">👥</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Người dùng</div>
                  <div className="text-sm text-gray-600">Quản lý admin & người dùng</div>
                </div>
              </div>
              <span className="text-2xl text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
