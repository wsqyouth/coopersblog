/**
 * 通用类型定义
 */

/** 主题类型 */
export type Theme = 'light' | 'dark' | 'auto'

/** 语言类型 */
export type Language = 'zh' | 'en'

/** 通用 API 响应结构 */
export interface ApiResponse<T = any> {
  /** 响应数据 */
  data: T
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success: boolean
  /** 时间戳 */
  timestamp: number
}

/** 错误信息 */
export interface ErrorInfo {
  /** 错误代码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: any
  /** 错误堆栈 */
  stack?: string
}

/** 加载状态 */
export interface LoadingState {
  /** 是否正在加载 */
  loading: boolean
  /** 错误信息 */
  error?: ErrorInfo | null
  /** 重试次数 */
  retryCount?: number
}

/** 分页参数 */
export interface PaginationParams {
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总数量 */
  total?: number
}

/** 排序参数 */
export interface SortParams<T = string> {
  /** 排序字段 */
  field: T
  /** 排序方向 */
  order: 'asc' | 'desc'
}

/** 通用筛选参数 */
export interface FilterParams {
  /** 搜索关键词 */
  search?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 状态筛选 */
  status?: string[]
  /** 自定义筛选条件 */
  [key: string]: any
}

/** 文件信息 */
export interface FileInfo {
  /** 文件名 */
  name: string
  /** 文件大小（字节） */
  size: number
  /** MIME 类型 */
  type: string
  /** 文件路径 */
  path: string
  /** 最后修改时间 */
  lastModified: number
  /** 文件 URL */
  url?: string
}

/** 图片信息 */
export interface ImageInfo extends FileInfo {
  /** 图片宽度 */
  width?: number
  /** 图片高度 */
  height?: number
  /** 图片格式 */
  format?: string
  /** 图片描述 */
  alt?: string
}

/** SEO 元数据 */
export interface SEOData {
  /** 页面标题 */
  title: string
  /** 页面描述 */
  description: string
  /** 关键词 */
  keywords?: string[]
  /** 作者 */
  author?: string
  /** 封面图片 */
  image?: string
  /** 页面 URL */
  url?: string
  /** 文章类型 */
  type?: 'website' | 'article' | 'profile'
  /** 发布时间 */
  publishedTime?: string
  /** 修改时间 */
  modifiedTime?: string
}

/** 导航链接 */
export interface NavLink {
  /** 链接标题 */
  title: string
  /** 链接地址 */
  href: string
  /** 图标 */
  icon?: string
  /** 是否在新窗口打开 */
  external?: boolean
  /** 子菜单 */
  children?: NavLink[]
  /** 是否激活 */
  active?: boolean
}

/** 面包屑导航 */
export interface Breadcrumb {
  /** 标题 */
  title: string
  /** 链接地址 */
  href?: string
  /** 是否为当前页面 */
  current?: boolean
}

/** 工具页面配置 */
export interface ToolConfig {
  /** 工具 ID */
  id: string
  /** 工具名称 */
  name: string
  /** 工具描述 */
  description: string
  /** 工具图标 */
  icon: string
  /** 工具路径 */
  path: string
  /** 工具分类 */
  category: string
  /** 是否启用 */
  enabled: boolean
  /** 排序权重 */
  sort: number
}

/** 统计数据 */
export interface Statistics {
  /** 统计项名称 */
  name: string
  /** 统计值 */
  value: number
  /** 统计单位 */
  unit?: string
  /** 变化率 */
  change?: number
  /** 趋势方向 */
  trend?: 'up' | 'down' | 'stable'
}

/** 全局状态 */
export interface GlobalState {
  /** 主题设置 */
  theme: Theme
  /** 语言设置 */
  language: Language
  /** 用户偏好 */
  preferences: UserPreferences
  /** 系统设置 */
  settings: SystemSettings
}

/** 用户偏好设置 */
export interface UserPreferences {
  /** 每页显示数量 */
  pageSize: number
  /** 默认排序方式 */
  defaultSort: string
  /** 是否显示封面图 */
  showCover: boolean
  /** 是否显示阅读时间 */
  showReadingTime: boolean
  /** 字体大小 */
  fontSize: 'small' | 'medium' | 'large'
}

/** 系统设置 */
export interface SystemSettings {
  /** 站点名称 */
  siteName: string
  /** 站点描述 */
  siteDescription: string
  /** 站点 URL */
  siteUrl: string
  /** 站点作者 */
  siteAuthor: string
  /** 是否启用分析 */
  enableAnalytics: boolean
  /** 分析 ID */
  analyticsId?: string
  /** 关键词 */
  keywords?: string[]
  /** 作者详细信息 */
  author?: {
    name: string
    email: string
    url?: string
    twitter?: string
  }
}