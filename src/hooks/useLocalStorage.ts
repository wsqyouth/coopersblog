'use client'

import { useState, useEffect, useCallback } from 'react'

export type UseLocalStorageReturn<T> = [
  T,
  (value: T | ((prevValue: T) => T)) => void,
  () => void
]

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      
      // 检查item是否为有效的JSON字符串
      if (item.trim() === '' || item === 'undefined' || item === 'null') {
        console.warn(`Invalid localStorage value for key "${key}": "${item}"`)
        // 清理无效数据
        window.localStorage.removeItem(key)
        return initialValue
      }
      
      return JSON.parse(item)
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      // 清理损坏的数据
      try {
        window.localStorage.removeItem(key)
      } catch (removeError) {
        console.warn(`Error removing corrupted localStorage key "${key}":`, removeError)
      }
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue === null) {
          setStoredValue(initialValue)
        } else {
          try {
            // 检查新值是否有效
            if (e.newValue.trim() === '' || e.newValue === 'undefined' || e.newValue === 'null') {
              console.warn(`Invalid localStorage value received for key "${key}": "${e.newValue}"`)
              setStoredValue(initialValue)
              return
            }
            setStoredValue(JSON.parse(e.newValue))
          } catch (error) {
            console.warn(`Error parsing localStorage value for key "${key}":`, error)
            // 设置为初始值，不清理localStorage，因为这是响应其他标签页的变化
            setStoredValue(initialValue)
          }
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}