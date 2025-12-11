'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';

import ImageGallery from '@/components/ImageGallery';
import ImageViewer from '@/components/ImageViewer';
import BadgeDisplay from '@/components/BadgeDisplay';
import BadgeScanner from '@/components/BadgeScanner';
import FollowButton from '@/components/FollowButton';
import FollowersModal from '@/components/FollowersModal';
import SignInPrompt from '@/components/SignInPrompt';
import { HeartIcon, ChatBubbleIcon, ArrowLeftIcon } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfile } from '@/hooks/useProfile';
import { useBadges } from '@/hooks/useBadges';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFollow } from '@/hooks/useFollow';
import { useTheme } from '@/hooks/useTheme';
import { useSidebar } from '@/hooks/useSidebar';
import { formatDate, parseImages, getAvatarUrl } from '@/lib/utils/helpers';

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  // Local state
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [showBadgeScanner, setShowBadgeScanner] = useState(false);
  const [imageViewer, setImageViewer] = useState<{ images: string[]; index: number } | null>(null);
  const [followersModal, setFollowersModal] = useState<{ isOpen: boolean; type: 'followers' | 'following' }>({
    isOpen: false,
    type: 'followers',
  });

  // Check if user is signed in
  useEffect(() => {
    if (isLoaded && !clerkUser) {
      setShowSignInPrompt(true);
    }
  }, [isLoaded, clerkUser]);

  // Custom hooks
  const { profile, loading: profileLoading } = useProfile(userId);
  const { badges, addBadge } = useBadges(userId);
  const { posts: userPosts } = useUserPosts(userId);
  const { stats: followStats } = useFollow(Number(userId));
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setIsSidebarCollapsed } = useSidebar();

  const isCurrentUser = clerkUser?.id === profile?.clerkId;
  const loading = profileLoading;

  const handleBadgeScanned = (badge: any) => {
    addBadge(badge);
    setShowBadgeScanner(false);
    alert(`🎉 Bạn đã nhận được huy hiệu "${badge.name}"!`);
  };

  // Show sign-in required message if not authenticated
  if (isLoaded && !clerkUser) {
    return (
      <div className="bg-brand-gray-light dark:bg-black min-h-screen">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
        />
        <div className="pt-20 md:pt-0 transition-all duration-300 md:pl-20">
          <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Yêu cầu đăng nhập
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn cần đăng nhập để xem thông tin chi tiết của người dùng và tương tác với cộng đồng.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push('/sign-in')}
                  className="px-6 py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => router.push('/sign-up')}
                  className="px-6 py-3 bg-white text-brand-green border-2 border-brand-green font-semibold rounded-lg hover:bg-brand-green-light transition-colors dark:bg-gray-800 dark:text-white"
                >
                  Tạo tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
        <SignInPrompt
          isOpen={showSignInPrompt}
          onClose={() => setShowSignInPrompt(false)}
          feature="xem thông tin người dùng"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-brand-gray-light dark:bg-black min-h-screen">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
        />
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Đang tải...</p>
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
        <div className="pt-20 md:pt-0 transition-all duration-300 md:pl-20">
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
        className="pt-24 md:pt-0 transition-all duration-300 md:pl-20"
      >
        <main className="container mx-auto px-4 max-w-3xl pb-20">

          {/* Main Profile Card */}
          <div className="bg-white dark:bg-brand-gray-dark rounded-3xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden mb-8 relative">
            <div className="h-32 bg-gradient-to-r from-brand-green to-emerald-400 opacity-20"></div>

            <div className="px-6 pb-8 -mt-12 flex flex-col items-center relative">
              <img
                src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-8 border-white dark:border-brand-gray-dark shadow-xl"
              />

              <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-4 text-center">
                {profile.name}
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green font-bold text-sm">
                  🏆 Chiến binh xanh
                </span>
              </div>

              {profile.bio && (
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-center max-w-lg font-medium">
                  "{profile.bio}"
                </p>
              )}

              <div className="mt-8 flex gap-4 w-full max-w-sm">
                {isCurrentUser ? (
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-bold hover:bg-gray-200 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex-1">
                    <FollowButton userId={Number(userId)} className="w-full py-3 text-base rounded-xl" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-brand-gray-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-3xl font-black text-brand-green mb-1">{userPosts.length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bài viết</p>
            </div>
            <div className="bg-white dark:bg-brand-gray-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-3xl font-black text-pink-500 mb-1">{userPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thích</p>
            </div>
            <div
              onClick={() => setFollowersModal({ isOpen: true, type: 'followers' })}
              className="bg-white dark:bg-brand-gray-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center cursor-pointer hover:border-brand-green/50 transition-colors"
            >
              <p className="text-3xl font-black text-blue-500 mb-1">{followStats.followersCount || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Theo dõi</p>
            </div>
            <div
              onClick={() => setFollowersModal({ isOpen: true, type: 'following' })}
              className="bg-white dark:bg-brand-gray-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center cursor-pointer hover:border-brand-green/50 transition-colors"
            >
              <p className="text-3xl font-black text-purple-500 mb-1">{followStats.followingCount || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đang theo</p>
            </div>
          </div>

          {/* Posts Feed Header */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-2 h-8 bg-brand-green rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hoạt động gần đây</h2>
          </div>



          {/* User Posts List */}
          <div>
            {userPosts.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 font-medium">Chưa có bài viết nào 🍃</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-brand-gray-dark rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.avatar || ''}
                          alt={profile.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white leading-none">{profile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-base text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>

                    <ImageGallery
                      images={parseImages(post.images)}
                      onImageClick={(index) => setImageViewer({ images: parseImages(post.images), index })}
                    />

                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <HeartIcon className="w-5 h-5 text-gray-400" />
                        <span>{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <ChatBubbleIcon className="w-5 h-5 text-gray-400" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

      </div>

      {/* Followers/Following Modal */}
      <FollowersModal
        isOpen={followersModal.isOpen}
        onClose={() => setFollowersModal({ ...followersModal, isOpen: false })}
        userId={Number(userId)}
        type={followersModal.type}
      />

      {/* Image Viewer Modal */}
      {imageViewer && (
        <ImageViewer
          images={imageViewer.images}
          initialIndex={imageViewer.index}
          onClose={() => setImageViewer(null)}
        />
      )}

      {/* Sign In Prompt */}
      <SignInPrompt
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        feature="xem thông tin người dùng"
      />
    </div>
  );
}
