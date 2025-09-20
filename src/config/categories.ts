/**
 * 分类配置映射文件
 * 通过这个文件可以轻松添加新分类，无需修改代码
 */

import type { BlogCategoryData } from '@/types/blog'

/** 分类配置映射 */
export interface CategoryConfig {
  /** 分类显示名称 */
  name: string
  /** URL slug（英文，用于路由） */
  slug: string
  /** 分类描述 */
  description?: string
  /** 分类图标 */
  icon?: string
  /** 分类颜色 */
  color?: string
  /** 是否在导航中显示 */
  showInNav?: boolean
  /** 排序权重（数字越小越靠前） */
  order?: number
}

/**
 * 分类配置映射
 * 
 * 添加新分类的方法：
 * 1. 在下面的对象中添加新的映射
 * 2. key: 可以是中文或英文，用于在 markdown frontmatter 中使用
 * 3. value: 配置对象，定义显示名称、slug、图标等
 * 
 * 示例：
 * '项目复盘': {
 *   name: '项目复盘',
 *   slug: 'project-review',
 *   description: '项目总结与经验分享',
 *   icon: '🔄',
 *   color: '#722ed1',
 *   showInNav: true,
 *   order: 5
 * }
 */
export const categoryMap: Record<string, CategoryConfig> = {
  // 现有分类（保持兼容性）
  'thinking': {
    name: '思考笔记',
    slug: 'thinking',
    description: '个人思考与感悟',
    icon: '🤔',
    color: '#1890ff',
    showInNav: true,
    order: 1
  },
  
  'tech': {
    name: '技术分享',
    slug: 'tech',
    description: '技术文章与教程',
    icon: '💻',
    color: '#52c41a',
    showInNav: true,
    order: 2
  },
  
  'life': {
    name: '生活感悟',
    slug: 'life',
    description: '生活点滴与感悟',
    icon: '🌱',
    color: '#faad14',
    showInNav: true,
    order: 3
  },
  
  'diary': {
    name: '个人日记',
    slug: 'diary',
    description: '日常记录与心情',
    icon: '📝',
    color: '#eb2f96',
    showInNav: true,
    order: 4
  },

  // 新增分类示例（用户可以轻松添加）
  '项目复盘': {
    name: '项目复盘',
    slug: 'project-review',
    description: '项目总结与经验分享',
    icon: '🔄',
    color: '#722ed1',
    showInNav: true,
    order: 5
  },

  // 支持多种key格式
  'project-review': {
    name: '项目复盘',
    slug: 'project-review',
    description: '项目总结与经验分享',
    icon: '🔄',
    color: '#722ed1',
    showInNav: true,
    order: 5
  }
}

/** 
 * 根据分类key获取配置
 */
export function getCategoryConfig(key: string): CategoryConfig | null {
  return categoryMap[key] || null
}

/**
 * 获取分类的slug
 */
export function getCategorySlug(key: string): string {
  const config = getCategoryConfig(key)
  return config?.slug || key.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

/**
 * 根据slug获取分类配置
 */
export function getCategoryBySlug(slug: string): CategoryConfig | null {
  return Object.values(categoryMap).find(config => config.slug === slug) || null
}

/**
 * 获取所有分类配置（按order排序）
 */
export function getAllCategoriesConfig(): CategoryConfig[] {
  // 去重（因为可能有多个key指向同一个分类）
  const uniqueCategories = Object.values(categoryMap).reduce((acc, config) => {
    if (!acc.find(c => c.slug === config.slug)) {
      acc.push(config)
    }
    return acc
  }, [] as CategoryConfig[])
  
  return uniqueCategories.sort((a, b) => (a.order || 999) - (b.order || 999))
}

/**
 * 获取在导航中显示的分类
 */
export function getNavCategories(): CategoryConfig[] {
  return getAllCategoriesConfig().filter(config => config.showInNav !== false)
}

/**
 * 转换为 BlogCategoryData 格式
 */
export function configToBlogCategoryData(config: CategoryConfig, postCount = 0): BlogCategoryData {
  return {
    id: config.slug,
    name: config.name,
    slug: config.slug,
    description: config.description,
    icon: config.icon,
    color: config.color,
    postCount
  }
}