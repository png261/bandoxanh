'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
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
        <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/community')}
            className="inline-flex items-center gap-2 text-brand-green dark:text-brand-green-light font-semibold hover:text-brand-green-dark dark:hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Quay lại Cộng đồng
          </button>

          {/* Profile Header */}
          <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <img
                src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-brand-green flex-shrink-0"
              />
              <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{profile.name}</h1>
                </div>
                {/* User Title/Rank - Mock for now until DB migration */}
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm">
                    🏆 Chiến binh xanh
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 mt-2 break-words">{profile.bio}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Tham gia ngày: {formatDate(profile.joinDate)}
                </p>
              </div>
              {isCurrentUser ? (
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <div className="w-full sm:w-auto">
                  <FollowButton userId={Number(userId)} />
                </div>
              )}
            </div>

            {/* Profile Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-5 gap-2 sm:gap-4">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-brand-green">{userPosts.length}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bài viết</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-brand-green">
                  {userPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lượt thích</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-brand-green">
                  {userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bình luận</p>
              </div>
              <button
                onClick={() => setFollowersModal({ isOpen: true, type: 'followers' })}
                className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors py-2"
              >
                <p className="text-xl sm:text-2xl font-bold text-brand-green">{followStats.followersCount || 0}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Người theo dõi</p>
              </button>
              <button
                onClick={() => setFollowersModal({ isOpen: true, type: 'following' })}
                className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors py-2"
              >
                <p className="text-xl sm:text-2xl font-bold text-brand-green">{followStats.followingCount || 0}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Đang theo dõi</p>
              </button>
            </div>
          </div>

          {/* User Posts */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Bài viết của {profile.name}
            </h2>

            {userPosts.length === 0 ? (
              <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 sm:p-8 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Chưa có bài viết nào</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(post.createdAt)}
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-4 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                      {post.content}
                    </p>

                    {/* Images */}
                    <ImageGallery 
                      images={parseImages(post.images)} 
                      onImageClick={(index) => setImageViewer({ images: parseImages(post.images), index })}
                    />

                    {/* Post Stats */}
                    <div className="flex items-center gap-4 sm:gap-6 text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChatBubbleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm">{post.comments?.length || 0}</span>
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
