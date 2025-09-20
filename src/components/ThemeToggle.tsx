'use client'

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const { appliedTheme, toggleTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    console.log('=== 主题切换按钮被点击 ===')
    console.log('当前 appliedTheme:', appliedTheme)
    console.log('当前 document.documentElement.getAttribute("data-theme"):', document.documentElement.getAttribute('data-theme'))
    
    setIsAnimating(true)
    
    try {
      toggleTheme()
      console.log('toggleTheme() 执行完成')
    } catch (error) {
      console.error('toggleTheme() 执行错误:', error)
    }
    
    setTimeout(() => {
      setIsAnimating(false)
      console.log('切换后 document.documentElement.getAttribute("data-theme"):', document.documentElement.getAttribute('data-theme'))
    }, 200)
  }

  const getThemeIcon = () => {
    if (appliedTheme === 'light') {
      return (
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isAnimating ? 'rotate-180' : ''}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )
    } else {
      return (
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isAnimating ? 'rotate-180' : ''}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
            clipRule="evenodd" 
          />
        </svg>
      )
    }
  }

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="icon"
      className="transition-all duration-200"
      aria-label={`切换到${appliedTheme === 'light' ? '暗色' : '亮色'}主题`}
      title={`当前：${appliedTheme === 'light' ? '亮色' : '暗色'}主题`}
    >
      {getThemeIcon()}
    </Button>
  )
}