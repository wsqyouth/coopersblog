/**
 * 站点配置文件
 */

import type { SystemSettings, SEOData } from '@/types/common'

/** 站点基础配置 */
export const siteConfig: SystemSettings = {
  /** 站点名称 */
  siteName: "Cooper's Blog",
  /** 站点描述 */
  siteDescription: '基于 Next.js 15 + React 19 + Ant Design 5.x 技术栈的个人博客网站，采用 JAMstack 架构模式，支持 Markdown 文章渲染、工具集成和全球化访问。',
  /** 站点 URL */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  /** 站点作者 */
  siteAuthor: 'Cooper',
  /** 是否启用分析 */
  enableAnalytics: !!process.env.NEXT_PUBLIC_GA_ID,
  /** 分析 ID */
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,
  /** 关键词 */
  keywords: [
    '个人博客',
    'Next.js',
    'React',
    'TypeScript',
    'Ant Design',
    'Markdown',
    'JAMstack',
    '前端开发',
    '全栈开发',
    'Cooper',
  ],
  /** 作者信息 */
  author: {
    name: 'Cooper',
    url: 'https://cooper.dev',
    email: 'cooper@example.com',
    twitter: '@cooper',
  },
}

/** 默认 SEO 配置 */
export const defaultSEO: SEOData = {
  title: siteConfig.siteName,
  description: siteConfig.siteDescription,
  keywords: [
    '个人博客',
    'Next.js',
    'React',
    'TypeScript',
    'Ant Design',
    'Markdown',
    'JAMstack',
    '前端开发',
    '全栈开发',
    'Cooper',
  ],
  author: siteConfig.siteAuthor,
  type: 'website',
  url: siteConfig.siteUrl,
  image: `${siteConfig.siteUrl}/images/common/og-image.jpg`,
}

/** 社交媒体配置 */
export const socialLinks = {
  github: 'https://github.com/cooper',
  twitter: 'https://twitter.com/cooper',
  linkedin: 'https://linkedin.com/in/cooper',
  email: 'mailto:cooper@example.com',
} as const

/** 博客配置 */
export const blogConfig = {
  /** 文章目录路径 */
  postsDirectory: 'posts',
  /** 支持的文章分类 */
  categories: {
    thinking: {
      name: '思考笔记',
      description: '个人思考与感悟',
      icon: '🤔',
      color: '#1890ff',
    },
    tech: {
      name: '技术分享',
      description: '技术文章与教程',
      icon: '💻',
      color: '#52c41a',
    },
    life: {
      name: '生活感悟',
      description: '生活点滴与感悟',
      icon: '🌱',
      color: '#faad14',
    },
    diary: {
      name: '个人日记',
      description: '日常记录与心情',
      icon: '📝',
      color: '#eb2f96',
    },
  },
  /** 每页显示文章数量 */
  postsPerPage: 10,
  /** 首页显示文章数量 */
  homePostsLimit: 6,
  /** 相关文章推荐数量 */
  relatedPostsLimit: 3,
  /** 热门标签显示数量 */
  popularTagsLimit: 20,
  /** 是否启用文章字数统计 */
  enableWordCount: true,
  /** 是否启用阅读时间估算 */
  enableReadingTime: true,
  /** 阅读速度（字/分钟） */
  readingSpeed: 200,
} as const

/** 工具页面配置 */
export const toolsConfig = {
  /** 工具分类 */
  categories: {
    dev: {
      name: '开发工具',
      description: '开发相关的实用工具',
      icon: '🛠️',
    },
    text: {
      name: '文本处理',
      description: '文本编辑与处理工具',
      icon: '📝',
    },
    converter: {
      name: '格式转换',
      description: '各种格式转换工具',
      icon: '🔄',
    },
    generator: {
      name: '生成器',
      description: '代码与内容生成工具',
      icon: '⚡',
    },
  },
  /** 每页显示工具数量 */
  toolsPerPage: 12,
} as const

/** 主题配置 */
export const themeConfig = {
  /** 默认主题 */
  defaultTheme: 'light' as const,
  /** 是否启用系统主题检测 */
  enableSystemTheme: true,
  /** 主题切换动画时长（毫秒） */
  transitionDuration: 300,
  /** Ant Design 主题配置 */
  antdTheme: {
    light: {
      colorPrimary: '#1890ff',
      colorBgBase: '#ffffff',
      colorTextBase: '#000000',
      borderRadius: 6,
    },
    dark: {
      colorPrimary: '#1890ff',
      colorBgBase: '#141414',
      colorTextBase: '#ffffff',
      borderRadius: 6,
    },
  },
} as const

/** 分析配置 */
export const analyticsConfig = {
  /** Google Analytics ID */
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  /** 是否在开发环境启用分析 */
  enableInDev: false,
  /** 是否启用调试模式 */
  debug: process.env.NODE_ENV === 'development',
} as const

/** 图片配置 */
export const imageConfig = {
  /** 支持的图片格式 */
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
  /** 图片质量 */
  quality: 85,
  /** 图片尺寸配置 */
  sizes: {
    thumbnail: { width: 300, height: 200 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 },
  },
  /** 默认封面图 */
  defaultCover: '/images/common/default-cover.jpg',
} as const

/** API 配置 */
export const apiConfig = {
  /** API 基础路径 */
  baseUrl: '/api',
  /** 请求超时时间（毫秒） */
  timeout: 10000,
  /** 重试次数 */
  retryCount: 3,
  /** 重试延迟（毫秒） */
  retryDelay: 1000,
} as const