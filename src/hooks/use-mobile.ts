import { useEffect, useState } from 'react';

/**
 * Hook to detect if the screen size is mobile (< 768px)
 * Updates on window resize
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
