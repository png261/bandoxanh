/**
 * Badge color classes for Tailwind CSS
 */
export const BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300',
  gold: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300',
  red: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300',
  pink: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 text-pink-800 dark:text-pink-300',
};

/**
 * Badge categories
 */
export const BADGE_CATEGORIES = {
  RECYCLING: 'recycling',
  EVENT: 'event',
  COMMUNITY: 'community',
  SPECIAL: 'special',
} as const;

/**
 * Badge category labels (Vietnamese)
 */
export const BADGE_CATEGORY_LABELS: Record<string, string> = {
  recycling: 'Tái chế',
  event: 'Sự kiện',
  community: 'Cộng đồng',
  special: 'Đặc biệt',
};

/**
 * News categories
 */
export const NEWS_CATEGORIES = [
  'Tin tức',
  'Hướng dẫn',
  'Sự kiện',
  'Môi trường',
] as const;

/**
 * Waste types for stations
 */
export const WASTE_TYPES = [
  'Nhựa',
  'Giấy',
  'Kim loại',
  'Thủy tinh',
  'Pin',
  'Điện tử',
] as const;

/**
 * Loading spinner component (extracted)
 */
export const LOADING_SPINNER_CLASS = 'animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green';

/**
 * Common transition classes
 */
export const TRANSITIONS = {
  default: 'transition-all duration-300',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-500',
  colors: 'transition-colors duration-200',
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  header: 40,
  sidebar: 30,
  modal: 50,
  tooltip: 60,
  dropdown: 45,
} as const;
