'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';


interface NewsArticle {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  isFeatured: boolean;
  content: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    } finally {
      setDeleting(null);
    }
  }

  async function handleEdit(article: NewsArticle) {
    setEditing(article);
  }

  async function handleSave() {
    if (!editing) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editing.title,
          category: editing.category,
          excerpt: editing.excerpt,
          imageUrl: editing.imageUrl,
          date: editing.date,
          isFeatured: editing.isFeatured,
          content: editing.content,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setArticles(articles.map((a) => (a.id === updated.id ? updated : a)));
        setEditing(null);
      } else {
        alert('Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Error updating article');
    } finally {
      setSaving(false);
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
            News Articles
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage all news and blog posts
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {articles.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No articles found
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex gap-6">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                            {article.category}
                          </span>
                          {article.isFeatured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {article.excerpt}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(article.date).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-shrink-0"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          {deleting === article.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit News Article
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Tin tức">Tin tức</option>
                      <option value="Hướng dẫn">Hướng dẫn</option>
                      <option value="Sự kiện">Sự kiện</option>
                      <option value="Môi trường">Môi trường</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editing.date}
                      onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    value={editing.excerpt}
                    onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editing.content}
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>

                <ImageUpload
                  currentUrl={editing.imageUrl}
                  onUploadSuccess={(url) => setEditing({ ...editing, imageUrl: url })}
                  label="Article Image"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editing.isFeatured}
                    onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Featured Article
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditing(null)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
