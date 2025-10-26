'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  content: string;
  imageUrls: string | null;
  userId: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Community Posts
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor and moderate user-generated content
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {posts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            No posts found
          </div>
        ) : (
          posts.map((post) => {
            const images = post.imageUrls ? JSON.parse(post.imageUrls) : [];
            return (
              <div
                key={post.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex gap-4">
                  <img
                    src={post.user.avatar || 'https://via.placeholder.com/40'}
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {post.user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        {deleting === post.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>

                    <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                        {images.slice(0, 6).map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt=""
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>👍 {post._count.likes} likes</span>
                      <span>💬 {post._count.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
