/**
 * 博客相关的类型定义
 */

export interface BlogPost {
  /** 文章唯一标识符 */
  id: string
  /** 文章标题 */
  title: string
  /** 文章内容（Markdown 格式） */
  content: string
  /** 文章摘要/描述 */
  description?: string
  /** 文章摘要 */
  excerpt?: string
  /** 发布日期 */
  date: string
  /** 发布日期（ISO 格式） */
  publishedAt: string
  /** 最后修改日期 */
  updatedAt?: string
  /** 文章分类 */
  category: BlogCategoryData
  /** 文章标签 */
  tags: string[]
  /** 作者信息 */
  author: string
  /** 封面图片 URL */
  cover?: string
  /** 封面图片 URL（备用字段） */
  coverImage?: string
  /** 文章状态 */
  status: PostStatus
  /** 是否置顶 */
  pinned?: boolean
  /** 是否为特色文章 */
  featured?: boolean
  /** 文章字数 */
  wordCount?: number
  /** 预计阅读时间（分钟） */
  readingTime?: number
  /** 阅读次数 */
  views?: number
  /** 文章 slug（用于 URL） */
  slug: string
  /** 文件路径 */
  filePath: string
}

/** 博客分类枚举（现在支持动态扩展） */
export type BlogCategory = string

/** 博客分类数据 */
export interface BlogCategoryData {
  id?: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  postCount?: number
}

/** 标签数据 */
export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  postCount?: number
}

/** 文章状态枚举 */
export type PostStatus = 'published' | 'draft' | 'archived'

/** Front Matter 数据结构 */
export interface FrontMatter {
  title: string
  date: string
  category: BlogCategory
  tags: string[]
  author: string
  description?: string
  cover?: string
  status?: PostStatus
  pinned?: boolean
}

/** 博客统计信息 */
export interface BlogStats {
  /** 总文章数 */
  totalPosts: number
  /** 各分类文章数量 */
  categoryCounts: Record<BlogCategory, number>
  /** 标签使用次数 */
  tagCounts: Record<string, number>
  /** 最近更新时间 */
  lastUpdated: string
}

/** 文章筛选参数 */
export interface PostFilter {
  /** 分类筛选 */
  category?: BlogCategory
  /** 标签筛选 */
  tag?: string
  /** 搜索关键词 */
  search?: string
  /** 排序方式 */
  sortBy?: 'date' | 'title' | 'readingTime'
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc'
  /** 分页参数 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/** 分页结果 */
export interface PaginatedPosts {
  /** 文章列表 */
  posts: BlogPost[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
  /** 是否有下一页 */
  hasNext: boolean
  /** 是否有上一页 */
  hasPrev: boolean
}

/** 相关文章推荐 */
export interface RelatedPost {
  id: string
  title: string
  category: BlogCategory
  date: string
  description?: string
  cover?: string
  slug: string
}