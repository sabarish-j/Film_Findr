import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of no further changes. Use to throttle search inputs, filters, etc.
 */
export const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
