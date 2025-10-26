'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import ImageViewer from '@/components/ImageViewer';
import { HeartIcon, ChatBubbleIcon, ArrowLeftIcon } from '@/components/Icons';
import { Theme } from '@/types';

interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
}

interface PostDetail {
  id: string;
  content: string;
  images?: string | string[];
  likes?: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
}

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [imageViewer, setImageViewer] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
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
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setProfile(data);

        // Fetch user's posts
        const postsResponse = await fetch(`/api/users/${userId}/posts`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setUserPosts(postsData || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  const parseImages = (images: any): string[] => {
    if (!images) return [];
    
    // If it's already an array, return it
    if (Array.isArray(images)) return images;
    
    // If it's a string, try to parse it
    if (typeof images === 'string') {
      // Check if it's already a valid URL (not JSON)
      if (images.startsWith('http') || images.startsWith('https')) {
        return [images];
      }
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return [images]; // If parsed but not array, treat as single URL
      } catch {
        // If parsing fails, treat as single URL
        return images.trim() ? [images] : [];
      }
    }
    
    return [];
  };

  const isCurrentUser = clerkUser?.id === profile?.clerkId;

  if (loading) {
    return (
      <div className="bg-brand-gray-light dark:bg-black min-h-screen">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
        />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-brand-gray-light dark:bg-black min-h-screen">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
        />
        <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy người dùng</h2>
              <button
                onClick={() => router.push('/community')}
                className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-green-dark transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Quay lại Cộng đồng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />

      <div
        className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}
      >
        <main className="container mx-auto px-4 sm:px-6 py-10 max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/community')}
            className="inline-flex items-center gap-2 text-brand-green dark:text-brand-green-light font-semibold hover:text-brand-green-dark dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Quay lại Cộng đồng
          </button>

          {/* Profile Header */}
          <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-6">
              <img
                src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-brand-green"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.email}</p>
                {profile.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{profile.bio}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tham gia ngày: {formatDate(profile.joinDate)}
                </p>
              </div>
              {isCurrentUser && (
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {/* Profile Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-green">{userPosts.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bài viết</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-green">
                  {userPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lượt thích</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-green">
                  {userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bình luận</p>
              </div>
            </div>
          </div>

          {/* User Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bài viết của {profile.name}</h2>

            {userPosts.length === 0 ? (
              <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Chưa có bài viết nào</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(post.createdAt)}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 mb-4 break-words whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Images */}
                    <ImageGallery 
                      images={parseImages(post.images)} 
                      onImageClick={(index) => setImageViewer({ images: parseImages(post.images), index })}
                    />

                    {/* Post Stats */}
                    <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <HeartIcon className="w-5 h-5" />
                        <span className="text-sm">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChatBubbleIcon className="w-5 h-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Image Viewer Modal */}
      {imageViewer && (
        <ImageViewer
          images={imageViewer.images}
          initialIndex={imageViewer.index}
          onClose={() => setImageViewer(null)}
        />
      )}
    </div>
  );
}
