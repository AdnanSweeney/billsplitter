import { useState, useEffect, useRef, useCallback } from 'react'

interface UseLocalStorageOptions {
  debounceMs?: number
}

function useLocalStorageWithDebounce<T>(
  key: string,
  initialValue: T,
  { debounceMs = 500 }: UseLocalStorageOptions = {}
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Failed to read from localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new debounced write
      debounceTimerRef.current = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
          console.error(`Failed to write to localStorage key "${key}":`, error)
        }
      }, debounceMs)
    },
    [key, debounceMs]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return [storedValue, setValue]
}

export default useLocalStorageWithDebounce
