'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { POSTS, USERS } from '@/constants';
import { HeartIcon, ChatBubbleIcon, ImageIcon, XIcon, ChartBarIcon, MedalIcon, EllipsisHorizontalIcon, ShareIcon, PencilIcon, TrashIcon } from '@/components/Icons';
import PostImageGrid from '@/components/PostImageGrid';
import ImageModal from '@/components/ImageModal';
import PollComponent from '@/components/PollComponent';
import Dropdown from '@/components/Dropdown';
import ShareModal from '@/components/ShareModal';
import { useState, useEffect, useRef } from 'react';
import { Theme, Post, Comment, Poll } from '@/types';
import React from 'react';

interface CommentProps {
  comment: Comment;
  currentUserId: number;
  onAuthorClick: (authorId: number) => void;
  onUpdateComment: (commentId: number, newContent: string) => void;
  onDeleteComment: (commentId: number) => void;
}

const CommentComponent: React.FC<CommentProps> = ({ comment, currentUserId, onAuthorClick, onUpdateComment, onDeleteComment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const handleUpdate = () => {
        if (editedContent.trim()) {
            onUpdateComment(comment.id, editedContent);
            setIsEditing(false);
        }
    };

    const commentOptions = [
        { label: 'Sửa', icon: <PencilIcon className="w-4 h-4" />, onClick: () => setIsEditing(true) },
        { label: 'Xoá', icon: <TrashIcon className="w-4 h-4" />, onClick: () => {
            if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
                onDeleteComment(comment.id);
            }
        } },
    ];
    
    return (
        <div className="flex items-start space-x-3 mt-4">
            <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-9 h-9 rounded-full object-cover cursor-pointer flex-shrink-0"
            onClick={() => onAuthorClick(comment.author.id)}
            />
            <div className="bg-gray-100 dark:bg-brand-gray-dark/50 rounded-xl p-3 flex-1 group">
                <div className="flex justify-between items-start">
                    <div>
                        <strong
                            className="font-semibold text-sm cursor-pointer hover:underline text-gray-900 dark:text-gray-100"
                            onClick={() => onAuthorClick(comment.author.id)}
                        >
                            {comment.author.name}
                        </strong>{' '}
                        {isEditing ? (
                            <div className="mt-1">
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-brand-green focus:border-brand-green"
                                    rows={2}
                                />
                                <div className="flex gap-2 mt-1">
                                    <button onClick={handleUpdate} className="text-xs font-semibold text-white bg-brand-green px-2 py-1 rounded">Lưu</button>
                                    <button onClick={() => { setIsEditing(false); setEditedContent(comment.content); }} className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Hủy</button>
                                </div>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-800 dark:text-gray-300 break-words">{comment.content}</span>
                        )}
                    </div>
                    {comment.author.id === currentUserId && !isEditing && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-1">
                            <Dropdown options={commentOptions}>
                                <EllipsisHorizontalIcon className="w-5 h-5" />
                            </Dropdown>
                        </div>
                    )}
                </div>
                 {!isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comment.timestamp}</p>}
            </div>
        </div>
    );
};


interface PostCardProps {
  post: Post;
  currentUserId: number;
  onUpdatePost: (postId: number, newContent: string) => void;
  onDeletePost: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
  onUpdateComment: (postId: number, commentId: number, newContent: string) => void;
  onDeleteComment: (postId: number, commentId: number) => void;
  onNavigateToProfile: (userId: number) => void;
}

const PostCard: React.FC<PostCardProps> = (props) => {
  const { post, currentUserId, onUpdatePost, onDeletePost, onAddComment, onUpdateComment, onDeleteComment, onNavigateToProfile } = props;

  const [newComment, setNewComment] = useState('');
  const [modalState, setModalState] = useState<{ isOpen: boolean; index: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [shareModalData, setShareModalData] = useState<{ url: string; title: string; text: string } | null>(null);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment('');
    }
  };

  const handleUpdatePost = () => {
      if (editedContent.trim() || post.images?.length || post.poll) {
          onUpdatePost(post.id, editedContent);
          setIsEditing(false);
      }
  };
  
  const handleShare = async () => {
    const postUrl = `${window.location.origin || 'https://bandoxanh.com'}/post/${post.id}`;
    
    const shareData = {
        title: `Bài viết từ ${post.author.name} trên BandoXanh`,
        text: post.content,
        url: postUrl,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error("Lỗi khi dùng Web Share API:", err);
            setShareModalData(shareData);
        }
    } else {
        setShareModalData(shareData);
    }
  };

  const postOptions = [
    { label: 'Chỉnh sửa bài viết', icon: <PencilIcon className="w-4 h-4" />, onClick: () => setIsEditing(true) },
    { label: 'Xoá bài viết', icon: <TrashIcon className="w-4 h-4" />, onClick: () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            onDeletePost(post.id);
        }
    } },
  ];

  return (
    <>
      {shareModalData && (
        <ShareModal
          url={shareModalData.url}
          title={shareModalData.title}
          text={shareModalData.text}
          onClose={() => setShareModalData(null)}
        />
      )}
      {modalState?.isOpen && post.images && (
        <ImageModal
          images={post.images}
          initialIndex={modalState.index}
          onClose={() => setModalState(null)}
        />
      )}
      <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="p-5 flex items-start">
          <div className="flex items-center flex-grow">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onClick={() => onNavigateToProfile(post.author.id)}
            />
            <div className="ml-4">
              <div className="flex items-center gap-2">
                  <h4
                  className="font-bold text-brand-gray-dark dark:text-gray-100 cursor-pointer hover:underline"
                  onClick={() => onNavigateToProfile(post.author.id)}
                  >
                  {post.author.name}
                  </h4>
                  {post.author.awards && post.author.awards.length > 0 && (
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer" onClick={() => onNavigateToProfile(post.author.id)}>
                          <MedalIcon className="w-4 h-4 text-yellow-500" />
                          <span className="ml-1">{post.author.awards.length}</span>
                      </div>
                  )}
              </div>
              <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-400">{post.timestamp}</p>
            </div>
          </div>
           {post.author.id === currentUserId && (
                <div className="-mr-2">
                    <Dropdown options={postOptions}>
                        <EllipsisHorizontalIcon className="w-6 h-6" />
                    </Dropdown>
                </div>
           )}
        </div>
        
        <div className="px-5 pb-3">
            {isEditing ? (
                <div>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-brand-green focus:border-brand-green"
                        rows={4}
                    />
                    <div className="flex gap-2 mt-2">
                        <button onClick={handleUpdatePost} className="text-sm font-semibold text-white bg-brand-green px-3 py-1 rounded-md">Lưu</button>
                        <button onClick={() => setIsEditing(false)} className="text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-md">Hủy</button>
                    </div>
                </div>
            ) : (
                post.content && <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
            )}
        </div>
        
        {post.poll && <PollComponent poll={post.poll} />}
        
        {post.images && post.images.length > 0 && !isEditing && (
            <div className="mt-2">
                <PostImageGrid images={post.images} onImageClick={(index) => setModalState({ isOpen: true, index })} />
            </div>
        )}

        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-brand-gray-DEFAULT dark:text-gray-400">
              <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <HeartIcon className="w-6 h-6" />
                <span className="font-semibold text-sm">{post.likes}</span>
              </button>
              <div className="flex items-center space-x-2 ml-6">
                <ChatBubbleIcon className="w-6 h-6" />
                <span className="font-semibold text-sm">{post.comments.length}</span>
              </div>
              <div className="flex-grow text-right">
                <button onClick={handleShare} className="flex items-center space-x-1 hover:text-brand-green transition-colors ml-auto p-1">
                    <ShareIcon className="w-6 h-6" />
                </button>
              </div>
          </div>
        </div>
        <div className="p-5 pt-3 bg-gray-50 dark:bg-gray-900/50">
          {post.comments.map(comment => (
            <CommentComponent 
                key={comment.id} 
                comment={comment}
                currentUserId={currentUserId}
                onAuthorClick={onNavigateToProfile}
                onUpdateComment={(commentId, newContent) => onUpdateComment(post.id, commentId, newContent)}
                onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
            />
          ))}
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3 mt-4">
            <img src={USERS.find(u => u.id === currentUserId)?.avatar} alt="Your avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-brand-gray-dark dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </form>
        </div>
      </div>
    </>
  );
};

interface CommunityPageProps {
    navigateTo: (path: string, options?: any) => void;
}

const CommunityPageComponent: React.FC<CommunityPageProps> = ({ navigateTo }) => {
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [postType, setPostType] = useState<'text' | 'poll'>('text');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const currentUserId = 3; 

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    if (files.length + postImages.length > 5) {
        alert("Bạn chỉ có thể đăng tối đa 5 hình ảnh.");
        if(event.target) event.target.value = "";
        return;
    }
    
    const validFiles = files.filter(file => file instanceof Blob);

    setPostImages(prev => [...prev, ...validFiles]);
    const newUrls = validFiles.map(file => URL.createObjectURL(file as Blob));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    if(event.target) event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
        const urlToRemove = prev[index];
        URL.revokeObjectURL(urlToRemove);
        return prev.filter((_, i) => i !== index);
    });
  };
  
  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
        setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
      if (pollOptions.length > 2) {
          setPollOptions(pollOptions.filter((_, i) => i !== index));
      }
  };

  const handlePollOptionChange = (index: number, value: string) => {
      const newOptions = [...pollOptions];
      newOptions[index] = value;
      setPollOptions(newOptions);
  };

  const handleCreatePost = () => {
    if (postType === 'text' && newPostContent.trim() === '' && previewUrls.length === 0) return;
    if (postType === 'poll' && (pollQuestion.trim() === '' || pollOptions.some(opt => opt.trim() === '') || pollOptions.length < 2)) {
      alert('Vui lòng nhập câu hỏi và ít nhất 2 lựa chọn cho khảo sát.');
      return;
    }

    const currentUser = USERS.find(u => u.id === currentUserId);
    if (!currentUser) return;

    let newPost: Post;

    if (postType === 'poll') {
        const newPoll: Poll = {
            question: pollQuestion,
            options: pollOptions.filter(opt => opt.trim() !== '').map((opt, index) => ({
                id: index + 1,
                text: opt,
                votes: 0,
            })),
        };
        newPost = {
            id: Date.now(),
            author: currentUser, 
            content: newPostContent,
            poll: newPoll,
            timestamp: 'Vừa xong',
            likes: 0,
            comments: [],
        }
    } else {
        newPost = {
            id: Date.now(),
            author: currentUser,
            content: newPostContent,
            images: previewUrls,
            timestamp: 'Vừa xong',
            likes: 0,
            comments: [],
        };
    }

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setPostImages([]);
    setPreviewUrls([]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setPostType('text');
  };
  
    const handleUpdatePost = (postId: number, newContent: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, content: newContent } : p));
    };

    const handleDeletePost = (postId: number) => {
        setPosts(posts.filter(p => p.id !== postId));
    };

    const handleAddComment = (postId: number, content: string) => {
        const currentUser = USERS.find(u => u.id === currentUserId);
        if (!currentUser) return;
        const newComment: Comment = {
            id: Date.now(),
            author: currentUser,
            content,
            timestamp: 'Vừa xong',
        };
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    };
    
    const handleUpdateComment = (postId: number, commentId: number, newContent: string) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: p.comments.map(c => c.id === commentId ? { ...c, content: newContent } : c)
                };
            }
            return p;
        }));
    };

    const handleDeleteComment = (postId: number, commentId: number) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
            }
            return p;
        }));
    };

  const handleNavigateToProfile = (userId: number) => {
    navigateTo(`/profile/${userId}`);
  };


  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-brand-gray-dark p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button 
                onClick={() => setPostType('text')}
                className={`flex-1 py-3 text-center font-semibold transition-colors ${postType === 'text' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            >
                Bài viết
            </button>
            <button 
                onClick={() => setPostType('poll')}
                className={`flex-1 py-3 text-center font-semibold transition-colors ${postType === 'poll' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            >
                Khảo sát
            </button>
        </div>

        {postType === 'poll' && (
             <textarea
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Đặt câu hỏi khảo sát..."
                className="w-full p-2 border-b-2 border-transparent focus:outline-none resize-none text-lg font-semibold bg-transparent focus:border-brand-green transition-colors"
                rows={2}
            ></textarea>
        )}

        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder={postType === 'poll' ? "Thêm mô tả (tùy chọn)..." : "Bạn đã làm gì cho môi trường hôm nay?"}
          className="w-full p-2 border-0 focus:ring-0 resize-none bg-transparent text-lg"
          rows={postType === 'poll' ? 2 : 4}
        ></textarea>
        
        {postType === 'poll' && (
            <div className="space-y-2 my-2 px-2">
                {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handlePollOptionChange(index, e.target.value)}
                            placeholder={`Lựa chọn ${index + 1}`}
                            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-green"
                        />
                        {pollOptions.length > 2 && (
                            <button onClick={() => handleRemovePollOption(index)} className="p-1 text-gray-400 hover:text-red-500 rounded-full">
                                <XIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
                {pollOptions.length < 5 && (
                     <button onClick={handleAddPollOption} className="text-sm font-semibold text-brand-green hover:underline mt-2">
                        + Thêm lựa chọn
                    </button>
                )}
            </div>
        )}
        
        {postType === 'text' && previewUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-3 md:grid-cols-5 gap-2 px-2">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md border dark:border-gray-600" />
                        <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
           {postType === 'text' ? (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-brand-green font-semibold p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ImageIcon className="w-6 h-6" />
                    <span>Thêm ảnh</span>
                </button>
           ) : (
                <div className="flex items-center gap-2 text-gray-400 p-2">
                    <ChartBarIcon className="w-6 h-6" />
                    <span>Tạo khảo sát</span>
                </div>
           )}

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
            className="bg-brand-green text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-green-dark transition-colors disabled:bg-gray-400"
            disabled={(postType === 'text' && newPostContent.trim() === '' && previewUrls.length === 0) || (postType === 'poll' && pollQuestion.trim() === '')}
          >
            Đăng
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUserId={currentUserId}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            onNavigateToProfile={handleNavigateToProfile} 
          />
        ))}
      </div>
    </div>
  );
};

export default function Community() {
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
    if (options?.profileId) {
      router.push(`/profile/${options.profileId}`);
    } else {
      router.push(path);
    }
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
        <main className="container mx-auto px-4 sm:px-6 py-10">
          <CommunityPageComponent navigateTo={navigateTo} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
