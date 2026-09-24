import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to interact with localStorage and reactively update
 * on custom internal storage events and window storage events.
 */
export function useLocalStorage(key, initialValue) {
  // Read value safely
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(`Tried setting localStorage key "${key}" even though window is not defined`);
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Notify other components
        window.dispatchEvent(new Event('fitcoach_storage_update'));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Listen to native storage events (other tabs)
    window.addEventListener('storage', handleStorageChange);
    // Listen to our custom event (same tab updates)
    window.addEventListener('fitcoach_storage_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fitcoach_storage_update', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}
