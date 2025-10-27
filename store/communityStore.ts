'use client';

import { create } from 'zustand';
import { Theme } from '@/types';

export interface DBPost {
  id: string;
  content: string;
  images?: string | string[];
  likes?: number;
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
  likedBy?: any[];
}

export interface DBComment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp?: string;
}

interface CommunityState {
  // UI State
  loading: boolean;
  uploading: boolean;
  commentingPostId: string | null;

  // Post State
  posts: DBPost[];
  newPostContent: string;
  postImages: File[];
  previewUrls: string[];
  likedPosts: Set<string>;
  commentText: string;
  
  // Cache State
  postsLastFetched: number | null;
  postsCacheValid: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setCommentingPostId: (postId: string | null) => void;
  setPosts: (posts: DBPost[]) => void;
  setNewPostContent: (content: string) => void;
  setPostImages: (images: File[]) => void;
  setPreviewUrls: (urls: string[]) => void;
  setLikedPosts: (posts: Set<string>) => void;
  setCommentText: (text: string) => void;
  
  // Cache actions
  setPostsWithCache: (posts: DBPost[]) => void;
  invalidatePostsCache: () => void;
  shouldRefetchPosts: () => boolean;
  
  // Helper actions
  addPost: (post: DBPost) => void;
  updatePost: (postId: string, post: DBPost) => void;
  deletePost: (postId: string) => void;
  removePostImage: (index: number) => void;
  clearPostForm: () => void;
  toggleLikedPost: (postId: string, liked: boolean) => void;
  updatePostLikes: (postId: string, count: number) => void;
  addComment: (postId: string, comment: DBComment) => void;
  updateComment: (postId: string, commentId: string, comment: DBComment) => void;
  deleteComment: (postId: string, commentId: string) => void;
  replaceComment: (postId: string, oldCommentId: string, newComment: DBComment) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  // Initial state
  loading: false,
  uploading: false,
  commentingPostId: null,
  posts: [],
  newPostContent: '',
  postImages: [],
  previewUrls: [],
  likedPosts: new Set(),
  commentText: '',
  postsLastFetched: null,
  postsCacheValid: false,

  // Basic setters
  setLoading: (loading) => set({ loading }),
  setUploading: (uploading) => set({ uploading }),
  setCommentingPostId: (postId) => set({ commentingPostId: postId }),
  setPosts: (posts) => set({ posts }),
  setNewPostContent: (content) => set({ newPostContent: content }),
  setPostImages: (images) => set({ postImages: images }),
  setPreviewUrls: (urls) => set({ previewUrls: urls }),
  setLikedPosts: (posts) => set({ likedPosts: posts }),
  setCommentText: (text) => set({ commentText: text }),

  // Cache actions
  setPostsWithCache: (posts) =>
    set({
      posts,
      postsLastFetched: Date.now(),
      postsCacheValid: true,
    }),

  invalidatePostsCache: () =>
    set({
      postsCacheValid: false,
    }),

  shouldRefetchPosts: () => {
    const state = get();
    // Cache valid for 5 minutes
    const CACHE_DURATION = 5 * 60 * 1000;
    
    if (!state.postsCacheValid) return true;
    if (!state.postsLastFetched) return true;
    if (Date.now() - state.postsLastFetched > CACHE_DURATION) return true;
    
    return false;
  },

  // Helper actions
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
      postsCacheValid: false, // Invalidate cache when adding new post
    })),

  updatePost: (postId, post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? post : p)),
    })),

  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
    })),

  removePostImage: (index) =>
    set((state) => {
      const urlToRemove = state.previewUrls[index];
      URL.revokeObjectURL(urlToRemove);
      return {
        postImages: state.postImages.filter((_, i) => i !== index),
        previewUrls: state.previewUrls.filter((_, i) => i !== index),
      };
    }),

  clearPostForm: () =>
    set((state) => {
      state.previewUrls.forEach((url) => URL.revokeObjectURL(url));
      return {
        newPostContent: '',
        postImages: [],
        previewUrls: [],
      };
    }),

  toggleLikedPost: (postId, liked) =>
    set((state) => {
      const newLikedPosts = new Set(state.likedPosts);
      if (liked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      return { likedPosts: newLikedPosts };
    }),

  updatePostLikes: (postId, count) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, likes: count } : post
      ),
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), comment],
            }
          : post
      ),
    })),

  updateComment: (postId, commentId, comment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).map((c) =>
                c.id === commentId ? comment : c
              ),
            }
          : post
      ),
    })),

  deleteComment: (postId, commentId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).filter((c) => c.id !== commentId),
            }
          : post
      ),
    })),

  replaceComment: (postId, oldCommentId, newComment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).map((comment) =>
                comment.id === oldCommentId ? newComment : comment
              ),
            }
          : post
      ),
    })),
}));
