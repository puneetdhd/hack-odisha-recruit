import { useEffect, useState } from 'react';

/**
 * useDebounce hook
 * @param value - The value to debounce
 * @param delay - Delay in ms
 * @returns Debounced value
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
