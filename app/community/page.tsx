'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import ImageViewer from '@/components/ImageViewer';
import { HeartIcon, ChatBubbleIcon, ImageIcon, XIcon } from '@/components/Icons';
import { useEffect, useRef } from 'react';
import React from 'react';
import { useCommunityStore, type DBPost, type DBComment } from '@/store/communityStore';
import { useTheme } from '@/hooks/useTheme';
import { useSidebar } from '@/hooks/useSidebar';
import { usePosts } from '@/hooks/usePosts';

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use custom hook for posts with caching
  const { posts, loading, refreshPosts } = usePosts();

  // Local state for edit/delete modals
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [editPostContent, setEditPostContent] = React.useState('');
  const [openActionMenu, setOpenActionMenu] = React.useState<string | null>(null);
  const [openCommentMenu, setOpenCommentMenu] = React.useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = React.useState('');
  const [imageViewer, setImageViewer] = React.useState<{ images: string[]; index: number } | null>(null);

  // Global state
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  // Zustand store (without posts, loading, and sidebar which come from hooks)
  const {
    setPostsWithCache,
    newPostContent,
    setNewPostContent,
    postImages,
    setPostImages,
    previewUrls,
    setPreviewUrls,
    uploading,
    setUploading,
    commentingPostId,
    setCommentingPostId,
    commentText,
    setCommentText,
    likedPosts,
    removePostImage: storeRemovePostImage,
    clearPostForm: storeClearPostForm,
    toggleLikedPost,
    updatePostLikes,
    addComment: storeAddComment,
    replaceComment,
  } = useCommunityStore();

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
    setPostImages([...postImages, ...validFiles]);
    const newUrls = validFiles.map(file => URL.createObjectURL(file as Blob));
    setPreviewUrls([...previewUrls, ...newUrls]);
    if (event.target) event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    storeRemovePostImage(index);
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

      const newPost = await response.json();

      // Add new post to the top of the list and invalidate cache
      setPostsWithCache([newPost, ...posts]);

      // Reset form
      storeClearPostForm();
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
    
    // If it's already an array, return it
    if (Array.isArray(images)) {
      return images;
    }
    
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
      } catch (error) {
        // If parsing fails, treat as single URL
        return images.trim() ? [images] : [];
      }
    }
    
    return [];
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;

      const currentPost = posts[postIndex];
      const isCurrentlyLiked = likedPosts.has(postId);

      // Update local state immediately using store
      toggleLikedPost(postId, !isCurrentlyLiked);

      // Update posts count immediately using store
      updatePostLikes(postId, isCurrentlyLiked ? (currentPost.likes || 0) - 1 : (currentPost.likes || 0) + 1);

      // Send request to server
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: user.id }),
      });

      if (!response.ok) {
        // Revert on error - restore previous state
        toggleLikedPost(postId, isCurrentlyLiked);
        updatePostLikes(postId, currentPost.likes || 0);
        throw new Error('Failed to like post');
      }

      const data = await response.json();
      
      // Update with actual server response from server
      updatePostLikes(postId, data.likes || 0);
    } catch (error) {
      console.error('Error liking post:', error);
      // UI already reverted if there was an error
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !commentText.trim()) return;

    try {
      // Save comment text before clearing
      const commentContent = commentText;

      // Create optimistic comment object
      const optimisticComment: DBComment = {
        id: Date.now().toString(),
        content: commentContent,
        createdAt: new Date().toISOString(),
        authorId: user.id.toString(),
        author: {
          id: user.id.toString(),
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || 'User',
          email: user.emailAddresses?.[0]?.emailAddress || '',
          avatar: user.imageUrl,
        },
        timestamp: new Date().toISOString(),
      };

      // Optimistic update: add comment to UI immediately using store action
      storeAddComment(postId, optimisticComment);

      // Clear input immediately
      setCommentText('');

      // Send request to server
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          authorId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || 'User',
          avatar: user.imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to create comment');

      const actualComment = await response.json();

      // Update with actual server response using store action
      replaceComment(postId, optimisticComment.id, actualComment);

      setCommentingPostId(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Có lỗi xảy ra khi thêm bình luận');
      
      // Revert optimistic update on error
      await refreshPosts();
    }
  };

  const parseLikes = (likes: any): number => {
    if (!likes) return 0;
    if (typeof likes === 'number') return likes;
    if (typeof likes === 'string') {
      const num = parseInt(likes);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const handleEditPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditingPostId(postId);
      setEditPostContent(post.content);
      setOpenActionMenu(null);
    }
  };

  const handleSaveEditPost = async (postId: string) => {
    if (!editPostContent.trim()) {
      alert('Nội dung bài viết không được để trống');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editPostContent }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      const updatedPost = await response.json();
      // Update the post in state and invalidate cache
      setPostsWithCache(posts.map(p => p.id === postId ? updatedPost : p));
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Có lỗi xảy ra khi chỉnh sửa bài viết');
    }
  };

  const handleEditComment = (commentId: string, content: string, postId: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
    setOpenCommentMenu(null);
  };

  const handleSaveEditComment = async (postId: string, commentId: string) => {
    if (!editCommentContent.trim()) {
      alert('Nội dung bình luận không được để trống');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editCommentContent }),
      });

      if (!response.ok) throw new Error('Failed to update comment');

      const updatedComment = await response.json();
      // Update comment in state
      setPostsWithCache(posts.map(p => 
        p.id === postId 
          ? { ...p, comments: p.comments.map(c => c.id === commentId ? updatedComment : c) }
          : p
      ));
      setEditingCommentId(null);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Có lỗi xảy ra khi chỉnh sửa bình luận');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        {/* Single column layout - Posts Feed */}
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">

            {/* Main Content - Posts Feed */}
            <main className="space-y-4">
              {/* Create Post Section */}
              <div className="bg-white dark:bg-brand-gray-dark rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 break-words">Tạo bài viết</h2>

            {/* Post Input */}
            <div className="space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bảo vệ môi trường..."
                className="w-full p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-brand-gray-darker text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 resize-none transition-all break-words"
                rows={3}
              />

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-16 sm:h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600" loading="lazy" />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all"
                      >
                        <XIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 border-t border-gray-200 dark:border-gray-700 pt-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 text-brand-green font-medium px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-sm"
                >
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Thêm ảnh</span>
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
                  className="w-full sm:w-auto bg-brand-green text-white font-medium py-2 px-4 sm:px-5 rounded-lg hover:bg-emerald-600 transition-all disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-xs sm:text-sm"
                >
                  {uploading ? 'Đang đăng...' : 'Đăng bài'}
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-green mx-auto mb-3"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Đang tải bài viết...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white dark:bg-brand-gray-dark rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChatBubbleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Chưa có bài viết nào</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Hãy tạo bài viết đầu tiên!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-brand-gray-dark rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-3">
                    <button
                      onClick={() => router.push(`/profile/${post.author?.id}`)}
                      className="flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={post.author?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author?.name || 'User')}
                        alt={post.author?.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => router.push(`/profile/${post.author?.id}`)}
                        className="font-semibold text-gray-900 dark:text-white hover:text-brand-green transition-colors text-xs sm:text-sm truncate block"
                      >
                        {post.author?.name}
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                    </div>
                    {/* Edit/Delete actions - only for post author */}
                    {user && post.author?.email === user?.emailAddresses?.[0]?.emailAddress && (
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenu(openActionMenu === post.id ? null : post.id)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Tùy chọn"
                        >
                          <span className="text-lg">⋮</span>
                        </button>
                        {openActionMenu === post.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-brand-gray-darker rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-600 py-1">
                            <button
                              onClick={() => handleEditPost(post.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
                                  try {
                                    const response = await fetch(`/api/posts/${post.id}`, {
                                      method: 'DELETE',
                                    });
                                    if (!response.ok) throw new Error('Failed to delete post');
                                    setPostsWithCache(posts.filter(p => p.id !== post.id));
                                    setOpenActionMenu(null);
                                  } catch (error) {
                                    console.error('Error deleting post:', error);
                                    alert('Có lỗi xảy ra khi xóa bài viết');
                                  }
                                }
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400"
                            >
                              Xóa bài viết
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  {editingPostId === post.id ? (
                    <div className="space-y-3 mb-4">
                      <textarea
                        value={editPostContent}
                        onChange={(e) => setEditPostContent(e.target.value)}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-brand-gray-darker text-sm sm:text-base text-gray-900 dark:text-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 resize-none break-words"
                        rows={4}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          Huỷ
                        </button>
                        <button
                          onClick={() => handleSaveEditPost(post.id)}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-brand-green text-white rounded hover:bg-brand-green-dark transition-colors"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-4 break-words whitespace-pre-wrap">{post.content}</p>
                  )}

                  {/* Post Images */}
                  <ImageGallery 
                    images={parseImages(post.images)} 
                    onImageClick={(index) => setImageViewer({ images: parseImages(post.images), index })}
                  />

                  {/* Post Footer */}
                  <div className="flex items-center gap-4 sm:gap-6 text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 transition-colors ${
                        likedPosts.has(post.id) || (parseLikes(post.likes) ?? 0) > 0
                          ? 'text-red-500 hover:text-red-600' 
                          : 'hover:text-brand-green'
                      }`}
                    >
                      <HeartIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-xs sm:text-sm">{parseLikes(post.likes) ?? 0}</span>
                    </button>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                      <ChatBubbleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">{post.comments?.length || 0}</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                      {post.comments.slice(0, 3).map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <button
                            onClick={() => router.push(`/profile/${comment.author?.id}`)}
                            className="flex-shrink-0 hover:opacity-75 transition-opacity"
                          >
                            <img
                              src={comment.author?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author?.name || 'User')}
                              alt={comment.author?.name}
                              className="w-8 h-8 rounded-full object-cover cursor-pointer"
                            />
                          </button>
                          <div className="flex-1">
                            {editingCommentId === comment.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editCommentContent}
                                  onChange={(e) => setEditCommentContent(e.target.value)}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-brand-gray-darker text-gray-900 dark:text-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 text-sm resize-none"
                                  rows={2}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                  >
                                    Huỷ
                                  </button>
                                  <button
                                    onClick={() => handleSaveEditComment(post.id, comment.id)}
                                    className="text-xs px-2 py-1 bg-brand-green text-white rounded hover:bg-brand-green-dark"
                                  >
                                    Lưu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="bg-gray-100 dark:bg-brand-gray-darker rounded-lg p-2 relative">
                                  <button
                                    onClick={() => router.push(`/profile/${comment.author?.id}`)}
                                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-brand-green dark:hover:text-brand-green-light transition-colors"
                                  >
                                    {comment.author?.name}
                                  </button>
                                  <p className="text-sm text-gray-800 dark:text-gray-300">{comment.content}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
                                  
                                  {/* Edit/Delete for comment - only for comment author */}
                                  {user && comment.author?.email === user?.emailAddresses?.[0]?.emailAddress && (
                                    <div className="absolute top-1 right-1">
                                      <button
                                        onClick={() => setOpenCommentMenu(openCommentMenu === comment.id ? null : comment.id)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                      >
                                        <span className="text-sm">⋮</span>
                                      </button>
                                      {openCommentMenu === comment.id && (
                                        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-brand-gray-darker rounded shadow-lg z-50 border border-gray-200 dark:border-gray-600">
                                          <button
                                            onClick={() => handleEditComment(comment.id, comment.content, post.id)}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-900 dark:text-white"
                                          >
                                            Sửa
                                          </button>
                                          <button
                                            onClick={async () => {
                                              if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
                                                try {
                                                  const response = await fetch(`/api/posts/${post.id}/comment/${comment.id}`, {
                                                    method: 'DELETE',
                                                  });
                                                  if (!response.ok) throw new Error('Failed to delete comment');
                                                  setPostsWithCache(posts.map(p => 
                                                    p.id === post.id 
                                                      ? { ...p, comments: p.comments.filter(c => c.id !== comment.id) }
                                                      : p
                                                  ));
                                                  setOpenCommentMenu(null);
                                                } catch (error) {
                                                  console.error('Error deleting comment:', error);
                                                  alert('Có lỗi xảy ra khi xóa bình luận');
                                                }
                                              }
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-red-600 dark:text-red-400"
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input - Always Visible */}
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex gap-2 sm:gap-3">
                      <img
                        src={user?.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.fullName || 'User')}
                        alt="Your avatar"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={commentingPostId === post.id ? commentText : ''}
                          onChange={(e) => {
                            setCommentingPostId(post.id);
                            setCommentText(e.target.value);
                          }}
                          onFocus={() => setCommentingPostId(post.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && commentText.trim()) {
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Viết bình luận..."
                          className="flex-1 px-2.5 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-brand-gray-darker text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={commentingPostId !== post.id || !commentText.trim()}
                          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold"
                        >
                          Gửi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
    <Footer />

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
