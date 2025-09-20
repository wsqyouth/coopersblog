'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

export interface UseThemeReturn {
  theme: Theme
  appliedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light')
  const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // 从 localStorage 获取保存的主题
    const savedTheme = (localStorage.getItem('cooper-blog-theme') || 'light') as Theme
    setThemeState(savedTheme)
    
    // 计算实际应用的主题
    const getAppliedTheme = (theme: Theme): 'light' | 'dark' => {
      if (theme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return theme as 'light' | 'dark'
    }
    
    const applied = getAppliedTheme(savedTheme)
    setAppliedTheme(applied)
    document.documentElement.setAttribute('data-theme', applied)
    
    console.log('useTheme 初始化:', { savedTheme, applied })
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('cooper-blog-theme', newTheme)
    
    // 计算实际应用的主题
    const applied = newTheme === 'auto' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      newTheme as 'light' | 'dark'
    
    setAppliedTheme(applied)
    document.documentElement.setAttribute('data-theme', applied)
    
    console.log('主题已切换到:', { theme: newTheme, applied })
  }

  const toggleTheme = () => {
    const newTheme = appliedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return {
    theme,
    appliedTheme,
    setTheme,
    toggleTheme
  }
}