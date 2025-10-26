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
  isSidebarCollapsed: boolean;
  theme: Theme;
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

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setCommentingPostId: (postId: string | null) => void;
  setPosts: (posts: DBPost[]) => void;
  setNewPostContent: (content: string) => void;
  setPostImages: (images: File[]) => void;
  setPreviewUrls: (urls: string[]) => void;
  setLikedPosts: (posts: Set<string>) => void;
  setCommentText: (text: string) => void;
  
  // Helper actions
  addPost: (post: DBPost) => void;
  updatePost: (postId: string, post: DBPost) => void;
  removePostImage: (index: number) => void;
  clearPostForm: () => void;
  toggleLikedPost: (postId: string, liked: boolean) => void;
  updatePostLikes: (postId: string, count: number) => void;
  addComment: (postId: string, comment: DBComment) => void;
  replaceComment: (postId: string, oldCommentId: string, newComment: DBComment) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  // Initial state
  isSidebarCollapsed: false,
  theme: 'light',
  loading: false,
  uploading: false,
  commentingPostId: null,
  posts: [],
  newPostContent: '',
  postImages: [],
  previewUrls: [],
  likedPosts: new Set(),
  commentText: '',

  // Basic setters
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ loading }),
  setUploading: (uploading) => set({ uploading }),
  setCommentingPostId: (postId) => set({ commentingPostId: postId }),
  setPosts: (posts) => set({ posts }),
  setNewPostContent: (content) => set({ newPostContent: content }),
  setPostImages: (images) => set({ postImages: images }),
  setPreviewUrls: (urls) => set({ previewUrls: urls }),
  setLikedPosts: (posts) => set({ likedPosts: posts }),
  setCommentText: (text) => set({ commentText: text }),

  // Toggle theme
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  // Helper actions
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (postId, post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? post : p)),
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
