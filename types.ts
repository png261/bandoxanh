export type Page = 'home' | 'map' | 'identify' | 'community' | 'news' | 'about' | 'newsDetail' | 'profile';
export type Theme = 'light' | 'dark';

export enum WasteType {
  Plastic = 'Nhựa',
  Paper = 'Giấy',
  Metal = 'Kim loại',
  Glass = 'Thủy tinh',
  Organic = 'Hữu cơ',
  Electronic = 'Điện tử',
  Battery = 'Pin',
  General = 'Tổng hợp',
}

export interface Station {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  wasteTypes: WasteType[];
  image: string;
}

export interface RecyclingEvent {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  organizer: string;
  description: string;
  image: string;
}

export interface Award {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  joinDate: string;
  bio: string;
  awards: Award[];
}

export interface Comment {
    id: number;
    author: User;
    content: string;
    timestamp: string;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  votedBy?: number[];
}

export interface Post {
  id: number;
  author: User;
  content: string;
  images?: string[];
  poll?: Poll;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  isFeatured?: boolean;
  content: string;
}

export interface GptAnalysis {
  wasteType: string;
  recyclingSuggestion: string;
}
