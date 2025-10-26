'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeartIcon, ChatBubbleIcon, ImageIcon, XIcon } from '@/components/Icons';
import { useState, useEffect, useRef } from 'react';
import { Theme } from '@/types';
import React from 'react';

interface DBPost {
  id: string;
  content: string;
  images?: string | string[];
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  comments: DBComment[];
  _count?: {
    likedBy?: number;
  };
}

interface DBComment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch posts from database
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Theme management
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

  // Image handling
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    if (files.length + postImages.length > 5) {
      alert('Bạn chỉ có thể đăng tối đa 5 hình ảnh.');
      if (event.target) event.target.value = '';
      return;
    }

    const validFiles = files.filter(file => file instanceof Blob);
    setPostImages(prev => [...prev, ...validFiles]);
    const newUrls = validFiles.map(file => URL.createObjectURL(file as Blob));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    if (event.target) event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Post creation
  const handleCreatePost = async () => {
    if (newPostContent.trim() === '' && postImages.length === 0) {
      alert('Vui lòng nhập nội dung hoặc thêm hình ảnh');
      return;
    }

    if (!user) {
      alert('Vui lòng đăng nhập để tạo bài viết');
      return;
    }

    try {
      setUploading(true);
      let imageUrls: string[] = [];

      // Upload images to Supabase via API if any
      if (postImages.length > 0) {
        try {
          for (const file of postImages) {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json();
              throw new Error(errorData.error || 'Upload failed');
            }

            const uploadData = await uploadResponse.json();
            if (uploadData.url) {
              imageUrls.push(uploadData.url);
            }
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue with post creation even if images fail to upload
          alert('Cảnh báo: Không thể tải ảnh lên. Bài viết sẽ được đăng mà không có ảnh.');
        }
      }

      // Create post in database
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          images: imageUrls.length > 0 ? imageUrls : null,
          timestamp: new Date().toISOString(),
          authorId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || 'User',
          avatar: user.imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      // Reset form
      setNewPostContent('');
      setPostImages([]);
      setPreviewUrls([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));

      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins}m trước`;
      if (diffHours < 24) return `${diffHours}h trước`;
      if (diffDays < 7) return `${diffDays}d trước`;

      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Vừa xong';
    }
  };

  const parseImages = (images: any): string[] => {
    if (!images) return [];
    if (typeof images === 'string') {
      try {
        return JSON.parse(images);
      } catch {
        return [images];
      }
    }
    return Array.isArray(images) ? images : [];
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
        <main className="container mx-auto px-4 sm:px-6 py-10 max-w-2xl">
          {/* Create Post Section */}
          <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cộng Đồng</h2>

            {/* Post Input */}
            <div className="space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bảo vệ môi trường..."
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-brand-gray-darker text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 resize-none"
                rows={4}
              />

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md border dark:border-gray-600" />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-brand-green font-semibold p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                  <span>Thêm ảnh</span>
                </button>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={handleCreatePost}
                  disabled={uploading || (newPostContent.trim() === '' && previewUrls.length === 0)}
                  className="bg-brand-green text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-green-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Đang đăng...' : 'Đăng'}
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Đang tải bài viết...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={post.author?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author?.name || 'User')}
                      alt={post.author?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{post.author?.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-900 dark:text-gray-100 mb-4 break-words">{post.content}</p>

                  {/* Post Images */}
                  {parseImages(post.images).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 rounded-lg overflow-hidden">
                      {parseImages(post.images).map((img, idx) => (
                        <img key={idx} src={img} alt={`Post image ${idx}`} className="w-full h-32 object-cover" />
                      ))}
                    </div>
                  )}

                  {/* Post Footer */}
                  <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center gap-2 hover:text-brand-green transition-colors">
                      <HeartIcon className="w-5 h-5" />
                      <span className="text-sm">Thích</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-brand-green transition-colors">
                      <ChatBubbleIcon className="w-5 h-5" />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                      {post.comments.slice(0, 3).map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <img
                            src={comment.author?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author?.name || 'User')}
                            alt={comment.author?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 bg-gray-100 dark:bg-brand-gray-darker rounded-lg p-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.author?.name}</p>
                            <p className="text-sm text-gray-800 dark:text-gray-300">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
