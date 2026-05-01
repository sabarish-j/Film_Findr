import { useEffect } from 'react';

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isLocked]);
};
