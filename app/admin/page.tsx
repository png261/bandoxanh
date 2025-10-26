'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  stations: number;
  events: number;
  news: number;
  posts: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    stations: 0,
    events: 0,
    news: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        setStats({
          stations: stations.length || 0,
          events: events.length || 0,
          news: news.length || 0,
          posts: posts.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const sections = [
    {
      title: 'Recycling Stations',
      description: 'Manage recycling station locations',
      icon: '📍',
      count: stats.stations,
      href: '/admin/stations',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Events',
      description: 'Manage recycling events and activities',
      icon: '📅',
      count: stats.events,
      href: '/admin/events',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'News Articles',
      description: 'Manage news and blog posts',
      icon: '📰',
      count: stats.news,
      href: '/admin/news',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Community Posts',
      description: 'Monitor and moderate user posts',
      icon: '💬',
      count: stats.posts,
      href: '/admin/posts',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => {
          return (
            <Link
              key={section.title}
              href={section.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`inline-flex p-3 rounded-lg ${section.bgColor} mb-4`}>
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {section.count}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  total
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/stations"
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center font-medium transition-colors"
          >
            Add Station
          </Link>
          <Link
            href="/admin/events"
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
          >
            Add Event
          </Link>
          <Link
            href="/admin/news"
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-medium transition-colors"
          >
            Add News Article
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
          <div className="ml-3">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              You're logged in as an administrator. You have full access to manage all content
              on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
