/**
 * 通用工具函数库
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BlogCategory } from '@/types/blog'
import type { Theme } from '@/types/common'
import { DATE_FORMATS, VALIDATION } from './constants'

/**
 * 合并 CSS 类名（支持 Tailwind CSS）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 */
export function formatDate(
  date: string | Date,
  format: keyof typeof DATE_FORMATS | string = DATE_FORMATS.DATE
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return '无效日期'
  }

  switch (format) {
    case DATE_FORMATS.FULL:
      return dateObj.toLocaleString('zh-CN')
    
    case DATE_FORMATS.DATE:
      return dateObj.toLocaleDateString('zh-CN')
    
    case DATE_FORMATS.TIME:
      return dateObj.toLocaleTimeString('zh-CN')
    
    case DATE_FORMATS.SHORT_TIME:
      return dateObj.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    
    case DATE_FORMATS.RELATIVE:
      return getRelativeTime(dateObj)
    
    case DATE_FORMATS.ISO:
      return dateObj.toISOString()
    
    default:
      // 自定义格式
      return formatCustomDate(dateObj, format)
  }
}

/**
 * 获取相对时间
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

/**
 * 自定义日期格式化
 */
function formatCustomDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds)
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成 UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj as T
  }

  return obj
}

/**
 * 检查是否为空值
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 获取分类的显示信息
 */
export function getCategoryInfo(category: BlogCategory) {
  const categoryMap = {
    thinking: { name: '思考笔记', color: '#1890ff', icon: '🤔' },
    tech: { name: '技术分享', color: '#52c41a', icon: '💻' },
    life: { name: '生活感悟', color: '#faad14', icon: '🌱' },
    diary: { name: '个人日记', color: '#eb2f96', icon: '📝' },
  }
  
  return categoryMap[category as keyof typeof categoryMap] || categoryMap.thinking
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化数字
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * 获取阅读时间的显示文本
 */
export function getReadingTimeText(minutes: number): string {
  if (minutes < 1) {
    return '< 1 分钟'
  }
  return `${minutes} 分钟`
}

/**
 * 生成颜色哈希
 */
export function generateColorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 清理 HTML 标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * 获取设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * 检查是否为移动设备
 */
export function isMobile(): boolean {
  return getDeviceType() === 'mobile'
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        return success
      } catch {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch {
    return false
  }
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, contentType = 'text/plain'): void {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 获取 URL 查询参数
 */
export function getQueryParams(url?: string): Record<string, string> {
  const searchParams = new URLSearchParams(url ? new URL(url).search : window.location.search)
  const params: Record<string, string> = {}
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

/**
 * 构建 URL 查询字符串
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

/**
 * 滚动到元素
 */
export function scrollToElement(
  element: Element | string,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
): void {
  const target = typeof element === 'string' ? document.querySelector(element) : element
  
  if (target) {
    target.scrollIntoView(options)
  }
}

/**
 * 获取元素的偏移位置
 */
export function getElementOffset(element: Element): { top: number; left: number } {
  const rect = element.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  }
}

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 获取本地存储数据
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },

  /**
   * 设置本地存储数据
   */
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  /**
   * 删除本地存储数据
   */
  remove(key: string): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  /**
   * 清空本地存储
   */
  clear(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

/**
 * 会话存储工具
 */
export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key: string): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      window.sessionStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  clear(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      window.sessionStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

/**
 * 验证工具
 */
export const validate = {
  /**
   * 验证文章标题
   */
  title(title: string): { isValid: boolean; error?: string } {
    if (!title.trim()) {
      return { isValid: false, error: '标题不能为空' }
    }
    
    if (title.length < VALIDATION.MIN_TITLE_LENGTH) {
      return { isValid: false, error: `标题长度不能少于 ${VALIDATION.MIN_TITLE_LENGTH} 个字符` }
    }
    
    if (title.length > VALIDATION.MAX_TITLE_LENGTH) {
      return { isValid: false, error: `标题长度不能超过 ${VALIDATION.MAX_TITLE_LENGTH} 个字符` }
    }
    
    return { isValid: true }
  },

  /**
   * 验证文章描述
   */
  description(description: string): { isValid: boolean; error?: string } {
    if (description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
      return { isValid: false, error: `描述长度不能超过 ${VALIDATION.MAX_DESCRIPTION_LENGTH} 个字符` }
    }
    
    return { isValid: true }
  },

  /**
   * 验证标签
   */
  tags(tags: string[]): { isValid: boolean; error?: string } {
    if (tags.length > VALIDATION.MAX_TAGS_COUNT) {
      return { isValid: false, error: `标签数量不能超过 ${VALIDATION.MAX_TAGS_COUNT} 个` }
    }
    
    for (const tag of tags) {
      if (tag.length > VALIDATION.MAX_TAG_LENGTH) {
        return { isValid: false, error: `标签 "${tag}" 长度不能超过 ${VALIDATION.MAX_TAG_LENGTH} 个字符` }
      }
    }
    
    return { isValid: true }
  }
}