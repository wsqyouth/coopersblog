/**
 * 主题管理库
 */

import type { Theme } from '@/types/common'
import { themeConfig } from '@/config/site'
import { THEMES, STORAGE_KEYS } from './constants'
import { storage } from './utils'

/** 主题变化监听器类型 */
export type ThemeChangeListener = (theme: Theme) => void

/** 主题管理器类 */
class ThemeManager {
  private currentTheme: Theme = themeConfig.defaultTheme
  private listeners: Set<ThemeChangeListener> = new Set()
  private mediaQuery: MediaQueryList | null = null
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  /**
   * 初始化主题管理器
   */
  private initialize(): void {
    if (this.isInitialized) return

    // 设置媒体查询监听器
    if (themeConfig.enableSystemTheme) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this))
    }

    // 加载保存的主题
    this.loadTheme()
    
    // 应用主题
    this.applyTheme(this.currentTheme)

    this.isInitialized = true
  }

  /**
   * 加载主题设置
   */
  private loadTheme(): void {
    const savedTheme = storage.get<Theme>(STORAGE_KEYS.THEME)
    
    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.currentTheme = savedTheme
    } else {
      // 如果没有保存的主题且启用了系统主题检测
      if (themeConfig.enableSystemTheme) {
        this.currentTheme = THEMES.AUTO
      }
    }
  }

  /**
   * 验证主题值是否有效
   */
  private isValidTheme(theme: string): theme is Theme {
    return Object.values(THEMES).includes(theme as Theme)
  }

  /**
   * 获取当前主题
   */
  getTheme(): Theme {
    return this.currentTheme
  }

  /**
   * 获取实际应用的主题（解析 auto 主题）
   */
  getAppliedTheme(): 'light' | 'dark' {
    if (this.currentTheme === THEMES.AUTO) {
      return this.getSystemTheme()
    }
    return this.currentTheme as 'light' | 'dark'
  }

  /**
   * 获取系统主题
   */
  getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * 设置主题
   */
  setTheme(theme: Theme): void {
    if (!this.isValidTheme(theme)) {
      console.warn(`Invalid theme: ${theme}`)
      return
    }

    const previousTheme = this.currentTheme
    this.currentTheme = theme

    // 保存到本地存储
    storage.set(STORAGE_KEYS.THEME, theme)

    // 应用主题
    this.applyTheme(theme)

    // 通知监听器
    if (previousTheme !== theme) {
      this.notifyListeners()
    }
  }

  /**
   * 切换主题
   */
  toggleTheme(): void {
    const appliedTheme = this.getAppliedTheme()
    const newTheme = appliedTheme === 'light' ? THEMES.DARK : THEMES.LIGHT
    this.setTheme(newTheme)
  }

  /**
   * 应用主题到 DOM
   */
  private applyTheme(theme: Theme): void {
    if (typeof window === 'undefined') return

    const appliedTheme = theme === THEMES.AUTO ? this.getSystemTheme() : theme
    const root = document.documentElement
    
    // 设置 data-theme 属性（与 CSS 选择器匹配）
    root.setAttribute('data-theme', appliedTheme)
    
    // 设置 meta 标签
    this.updateMetaThemeColor(appliedTheme)
    
    console.log('主题已应用:', { theme, appliedTheme })
  }


  /**
   * 更新 meta 主题颜色
   */
  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const themeColor = theme === 'light' ? '#ffffff' : '#0a0a0a'
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    
    metaThemeColor.setAttribute('content', themeColor)
  }

  /**
   * 处理系统主题变化
   */
  private handleSystemThemeChange = (): void => {
    if (this.currentTheme === THEMES.AUTO) {
      this.applyTheme(THEMES.AUTO)
      this.notifyListeners()
    }
  }

  /**
   * 添加主题变化监听器
   */
  addListener(listener: ThemeChangeListener): () => void {
    this.listeners.add(listener)
    
    // 返回取消监听的函数
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 移除主题变化监听器
   */
  removeListener(listener: ThemeChangeListener): void {
    this.listeners.delete(listener)
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentTheme)
      } catch (error) {
        console.error('Theme listener error:', error)
      }
    })
  }

  /**
   * 获取主题选项列表
   */
  getThemeOptions(): Array<{ value: Theme; label: string; icon: string }> {
    return [
      { value: THEMES.LIGHT, label: '浅色模式', icon: '☀️' },
      { value: THEMES.DARK, label: '深色模式', icon: '🌙' },
      { value: THEMES.AUTO, label: '跟随系统', icon: '🔄' },
    ]
  }

  /**
   * 检查是否支持主题切换
   */
  isThemeSupported(): boolean {
    return typeof window !== 'undefined' && 'localStorage' in window
  }

  /**
   * 预加载主题资源
   */
  preloadThemeResources(): void {
    // 预加载主题相关的 CSS 文件或图片
    const themes: Array<'light' | 'dark'> = ['light', 'dark']
    
    themes.forEach(theme => {
      // 这里可以预加载主题相关的资源
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = `/themes/${theme}.css`
      document.head.appendChild(link)
    })
  }

  /**
   * 销毁主题管理器
   */
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange)
      this.mediaQuery = null
    }
    
    this.listeners.clear()
    this.isInitialized = false
  }
}

/** 全局主题管理器实例 */
export const themeManager = new ThemeManager()

/** 获取 Ant Design 主题配置 */
export function getAntdThemeConfig(theme: 'light' | 'dark') {
  return {
    ...themeConfig.antdTheme[theme],
    algorithm: theme === 'dark' 
      ? require('antd').theme.darkAlgorithm 
      : require('antd').theme.defaultAlgorithm,
  }
}

/** 主题工具函数 */
export const themeUtils = {
  /**
   * 检查当前是否为深色主题
   */
  isDark(): boolean {
    return themeManager.getAppliedTheme() === 'dark'
  },

  /**
   * 检查当前是否为浅色主题
   */
  isLight(): boolean {
    return themeManager.getAppliedTheme() === 'light'
  },

  /**
   * 获取主题对应的图标
   */
  getThemeIcon(theme: Theme): string {
    const iconMap = {
      [THEMES.LIGHT]: '☀️',
      [THEMES.DARK]: '🌙',
      [THEMES.AUTO]: '🔄',
    }
    return iconMap[theme] || '🔄'
  },

  /**
   * 获取主题对应的标签
   */
  getThemeLabel(theme: Theme): string {
    const labelMap = {
      [THEMES.LIGHT]: '浅色模式',
      [THEMES.DARK]: '深色模式',
      [THEMES.AUTO]: '跟随系统',
    }
    return labelMap[theme] || '未知主题'
  },

  /**
   * 根据主题获取对应的颜色
   */
  getThemeColor(theme: 'light' | 'dark', colorName: string): string {
    const colors = {
      light: {
        primary: '#1890ff',
        background: '#ffffff',
        text: '#000000',
        border: '#e5e5e5',
      },
      dark: {
        primary: '#1890ff',
        background: '#0a0a0a',
        text: '#fafafa',
        border: '#262626',
      },
    }
    
    return colors[theme]?.[colorName as keyof typeof colors.light] || '#000000'
  },

  /**
   * 创建主题感知的样式
   */
  createThemeAwareStyles(lightStyles: any, darkStyles: any) {
    return themeUtils.isDark() ? darkStyles : lightStyles
  },
}

// 导出主题常量
export { THEMES }

// 导出默认实例
export default themeManager