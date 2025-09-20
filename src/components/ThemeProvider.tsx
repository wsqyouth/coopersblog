'use client'

import { useEffect } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // 获取保存的主题，如果没有则使用默认的 light 主题
    const savedTheme = localStorage.getItem('cooper-blog-theme') || 'light'
    
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', savedTheme === 'auto' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      savedTheme
    )
    
    console.log('ThemeProvider 初始化:', { savedTheme })
  }, [])

  return <>{children}</>
}