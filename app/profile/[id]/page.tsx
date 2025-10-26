'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { USERS, POSTS, AWARDS } from '@/constants';
import { ArrowLeftIcon, CalendarIcon, SproutIcon, MedalIcon, HeartHandshakeIcon, QrCodeIcon } from '@/components/Icons';
import PostImageGrid from '@/components/PostImageGrid';
import ImageModal from '@/components/ImageModal';
import QrScanner from '@/components/QrScanner';
import { useState, useEffect } from 'react';
import { Theme, Post, User } from '@/types';
import React from 'react';

interface PostCardProps { 
    post: Post;
    onNavigateToProfile: (userId: number) => void;
}

const ProfilePostCard: React.FC<PostCardProps> = ({ post }) => {
    const [modalState, setModalState] = useState<{ isOpen: boolean; index: number } | null>(null);

    return (
        <>
            {modalState?.isOpen && post.images && (
                <ImageModal
                images={post.images}
                initialIndex={modalState.index}
                onClose={() => setModalState(null)}
                />
            )}
            <div className="bg-white dark:bg-brand-gray-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">{post.timestamp}</p>
                <p className="mt-3 text-brand-gray-dark dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
                
                {post.images && post.images.length > 0 && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                        <PostImageGrid images={post.images} onImageClick={(index) => setModalState({ isOpen: true, index })} />
                    </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-brand-gray-DEFAULT dark:text-gray-400">
                    <span>{post.likes} lượt thích</span>
                    <span className="ml-4">{post.comments.length} bình luận</span>
                </div>
            </div>
        </>
    );
};

interface ProfilePageProps {
  userId: number;
  navigateTo: (path: string, options?: any) => void;
}


const AwardIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
    switch (iconName) {
        case 'SproutIcon':
            return <SproutIcon className={className} />;
        case 'MedalIcon':
            return <MedalIcon className={className} />;
        case 'HeartHandshakeIcon':
            return <HeartHandshakeIcon className={className} />;
        default:
            return null;
    }
};


const ProfilePageComponent: React.FC<ProfilePageProps> = ({ userId, navigateTo }) => {
  const initialUser = USERS.find(u => u.id === userId);
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanNotification, setScanNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const userPosts = POSTS.filter(p => p.author.id === userId);

  useEffect(() => {
    setUser(USERS.find(u => u.id === userId));
  }, [userId]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setScanNotification({ type, message });
    setTimeout(() => setScanNotification(null), 4000);
  };

  const handleScanSuccess = (data: string) => {
    setIsScannerOpen(false);

    if (!data.startsWith('award_id:')) {
      showNotification('error', 'Mã QR không hợp lệ.');
      return;
    }

    const awardId = parseInt(data.split(':')[1], 10);
    if (isNaN(awardId)) {
      showNotification('error', 'Mã QR không hợp lệ.');
      return;
    }

    const newAward = AWARDS.find(a => a.id === awardId);
    if (!newAward) {
      showNotification('error', 'Danh hiệu không tồn tại.');
      return;
    }

    if (user) {
      const userHasAward = user.awards.some(a => a.id === newAward.id);
      if (userHasAward) {
        showNotification('error', `Bạn đã sở hữu danh hiệu "${newAward.name}" rồi.`);
      } else {
        setUser(prevUser => {
          if (!prevUser) return undefined;
          return {
            ...prevUser,
            awards: [...prevUser.awards, newAward],
          };
        });
        showNotification('success', `Chúc mừng! Bạn đã nhận được danh hiệu "${newAward.name}".`);
      }
    }
  };

  const handleNavigateToProfile = (id: number) => {
    if (id !== userId) {
      navigateTo(`/profile/${id}`);
    }
  }

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500">Không tìm thấy người dùng</h2>
        <button
          onClick={() => navigateTo('/community')}
          className="mt-6 inline-flex items-center gap-2 bg-brand-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-green-dark transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Quay lại Cộng đồng
        </button>
      </div>
    );
  }

  const isCurrentUser = user.id === 3; // Assume current user is ID 3

  return (
    <div className="max-w-4xl mx-auto">
        {isScannerOpen && (
            <QrScanner 
                onScanSuccess={handleScanSuccess} 
                onClose={() => setIsScannerOpen(false)} 
            />
        )}
        {scanNotification && (
            <div className={`fixed top-24 right-4 z-[60] p-4 rounded-lg text-white border ${scanNotification.type === 'success' ? 'bg-brand-green border-brand-green-dark' : 'bg-red-500 border-red-700'}`}>
                {scanNotification.message}
            </div>
        )}

        <button
            onClick={() => navigateTo('/community')}
            className="inline-flex items-center gap-2 text-brand-green dark:text-brand-green-light font-semibold hover:text-brand-green-dark dark:hover:text-white transition-colors mb-6"
        >
            <ArrowLeftIcon className="w-5 h-5" />
            Quay lại Cộng đồng
        </button>

        <div className="bg-white dark:bg-brand-gray-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center">
                <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-brand-green" />
                <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-brand-gray-dark dark:text-gray-100">{user.name}</h1>
                    <p className="mt-2 text-brand-gray-DEFAULT dark:text-gray-400 max-w-md">{user.bio}</p>
                    <div className="mt-3 flex items-center justify-center md:justify-start text-sm text-brand-gray-DEFAULT dark:text-gray-400">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span>Tham gia vào {user.joinDate}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-brand-gray-dark dark:text-gray-100">Danh hiệu & Thành tích</h3>
                    {isCurrentUser && (
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="flex items-center gap-2 bg-brand-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-green-dark transition-colors"
                        >
                            <QrCodeIcon className="w-5 h-5" />
                            Quét mã
                        </button>
                    )}
                </div>
                {user.awards && user.awards.length > 0 ? (
                    <ul className="space-y-4">
                        {user.awards.map(award => (
                            <li key={award.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-brand-gray-dark/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex-shrink-0 bg-brand-green-light/50 dark:bg-brand-green/20 text-brand-green-dark dark:text-brand-green-light rounded-full p-3">
                                    <AwardIcon iconName={award.icon} className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-gray-dark dark:text-gray-100">{award.name}</h4>
                                    <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">{award.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-brand-gray-DEFAULT dark:text-gray-400 py-6">Người dùng này chưa có danh hiệu nào.</p>
                )}
            </div>
        </div>

        <div className="mt-12">
            <h2 className="text-3xl font-bold text-brand-green-dark dark:text-brand-green-light mb-6">Bài viết của {user.name}</h2>
            <div className="space-y-6">
                {userPosts.length > 0 ? (
                    userPosts.map(post => <ProfilePostCard key={post.id} post={post} onNavigateToProfile={handleNavigateToProfile} />)
                ) : (
                    <p className="text-center text-brand-gray-DEFAULT dark:text-gray-400 bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-8 rounded-xl">
                        {user.name} chưa có bài viết nào.
                    </p>
                )}
            </div>
        </div>
    </div>
  );
};

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <ProfilePage id={id} />;
}

function ProfilePage({ id }: { id: string }) {
  'use client';
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

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

  const navigateTo = (path: string, options?: any) => {
    window.scrollTo(0, 0);
    router.push(path);
  };

  const userId = parseInt(id, 10);

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}> 
        <main className="container mx-auto px-4 sm:px-6 py-10">
          <ProfilePageComponent userId={userId} navigateTo={navigateTo} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
