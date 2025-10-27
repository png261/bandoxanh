/**
 * Format date string to Vietnamese locale
 */
export function formatDate(dateString: string | Date): string {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return 'N/A';
  }
}

/**
 * Format date and time to Vietnamese locale
 */
export function formatDateTime(dateString: string | Date): string {
  try {
    return new Date(dateString).toLocaleString('vi-VN');
  } catch {
    return 'N/A';
  }
}

/**
 * Parse images from various formats (string, array, JSON)
 */
export function parseImages(images: any): string[] {
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
}

/**
 * Generate avatar URL from name
 */
export function getAvatarUrl(name: string, avatar?: string): string {
  if (avatar) return avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate random QR code
 */
export function generateRandomQR(prefix = 'BADGE'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Classnames utility (simple version)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
