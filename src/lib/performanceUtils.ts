/**
 * Performance utilities for optimizing app loading and rendering
 */

// Cache for reducing repeated database queries
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheQuery = (key: string, data: any) => {
  queryCache.set(key, { data, timestamp: Date.now() });
};

export const getCachedQuery = (key: string) => {
  const cached = queryCache.get(key);
  if (!cached) return null;
  
  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    queryCache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const clearCache = (key?: string) => {
  if (key) {
    queryCache.delete(key);
  } else {
    queryCache.clear();
  }
};

// Utility to defer non-critical animations
export const deferAnimation = (callback: () => void, delay: number = 300) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => callback(), { timeout: delay });
  } else {
    setTimeout(callback, delay);
  }
};

// Optimize image loading
export const optimizeImageUrl = (url: string, width: number = 800): string => {
  if (!url) return url;
  
  // Add image optimization params if using an image service
  // This is a placeholder - adjust based on your image service
  if (url.includes('supabase')) {
    return url;
  }
  return url;
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
