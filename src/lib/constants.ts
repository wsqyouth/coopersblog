/**
 * 系统常量定义
 */

/** 系统常量 */
export const SYSTEM_CONSTANTS = {
  /** 应用名称 */
  APP_NAME: "Cooper's Blog",
  /** 应用版本 */
  APP_VERSION: '1.0.0',
  /** 应用描述 */
  APP_DESCRIPTION: '基于 Next.js 15 + React 19 + Ant Design 5.x 技术栈的个人博客网站',
  /** 作者信息 */
  AUTHOR: 'Cooper',
  /** 版权信息 */
  COPYRIGHT: '© 2025 Cooper. All rights reserved.',
  /** 许可证 */
  LICENSE: 'MIT',
} as const

/** 路由常量 */
export const ROUTES = {
  /** 首页 */
  HOME: '/',
  /** 文章列表 */
  POSTS: '/posts',
  /** 文章详情 */
  POST_DETAIL: '/posts/[slug]',
  /** 分类页面 */
  CATEGORIES: '/categories',
  /** 分类详情 */
  CATEGORY_DETAIL: '/categories/[category]',
  /** 标签页面 */
  TAGS: '/tags',
  /** 标签详情 */
  TAG_DETAIL: '/tags/[tag]',
  /** 归档页面 */
  ARCHIVE: '/archive',
  /** 工具页面 */
  TOOLS: '/tools',
  /** 工具详情 */
  TOOL_DETAIL: '/tools/[tool]',
  /** 关于页面 */
  ABOUT: '/about',
  /** 搜索页面 */
  SEARCH: '/search',
  /** 统计页面 */
  STATS: '/stats',
  /** 隐私政策 */
  PRIVACY: '/privacy',
  /** 使用条款 */
  TERMS: '/terms',
  /** 404 页面 */
  NOT_FOUND: '/404',
  /** 500 页面 */
  SERVER_ERROR: '/500',
} as const

/** API 路由常量 */
export const API_ROUTES = {
  /** 获取文章列表 */
  GET_POSTS: '/api/posts',
  /** 获取文章详情 */
  GET_POST: '/api/posts/[slug]',
  /** 获取分类列表 */
  GET_CATEGORIES: '/api/categories',
  /** 获取标签列表 */
  GET_TAGS: '/api/tags',
  /** 获取归档数据 */
  GET_ARCHIVE: '/api/archive',
  /** 获取统计数据 */
  GET_STATS: '/api/stats',
  /** 搜索接口 */
  SEARCH: '/api/search',
  /** 工具接口 */
  TOOLS: '/api/tools',
} as const

/** 文件路径常量 */
export const FILE_PATHS = {
  /** 文章目录 */
  POSTS_DIR: 'posts',
  /** 图片目录 */
  IMAGES_DIR: 'public/images',
  /** 文章图片目录 */
  POST_IMAGES_DIR: 'public/images/posts',
  /** 通用图片目录 */
  COMMON_IMAGES_DIR: 'public/images/common',
  /** 工具图片目录 */
  TOOLS_IMAGES_DIR: 'public/images/tools',
  /** 配置文件目录 */
  CONFIG_DIR: 'src/config',
  /** 组件目录 */
  COMPONENTS_DIR: 'src/components',
  /** 页面目录 */
  PAGES_DIR: 'src/app',
} as const

/** 本地存储键常量 */
export const STORAGE_KEYS = {
  /** 主题设置 */
  THEME: 'cooper-blog-theme',
  /** 语言设置 */
  LANGUAGE: 'cooper-blog-language',
  /** 用户偏好 */
  USER_PREFERENCES: 'cooper-blog-preferences',
  /** 阅读历史 */
  READING_HISTORY: 'cooper-blog-reading-history',
  /** 收藏文章 */
  BOOKMARKS: 'cooper-blog-bookmarks',
  /** 搜索历史 */
  SEARCH_HISTORY: 'cooper-blog-search-history',
} as const

/** 分类常量 */
export const CATEGORIES = {
  /** 思考笔记 */
  THINKING: 'thinking',
  /** 技术分享 */
  TECH: 'tech',
  /** 生活感悟 */
  LIFE: 'life',
  /** 个人日记 */
  DIARY: 'diary',
} as const

/** 工具分类常量 */
export const TOOL_CATEGORIES = {
  /** 开发工具 */
  DEV: 'dev',
  /** 文本处理 */
  TEXT: 'text',
  /** 格式转换 */
  CONVERTER: 'converter',
  /** 生成器 */
  GENERATOR: 'generator',
} as const

/** 主题常量 */
export const THEMES = {
  /** 浅色主题 */
  LIGHT: 'light',
  /** 深色主题 */
  DARK: 'dark',
  /** 自动主题 */
  AUTO: 'auto',
} as const

/** 语言常量 */
export const LANGUAGES = {
  /** 中文 */
  ZH: 'zh',
  /** 英文 */
  EN: 'en',
} as const

/** 文章状态常量 */
export const POST_STATUS = {
  /** 已发布 */
  PUBLISHED: 'published',
  /** 草稿 */
  DRAFT: 'draft',
  /** 已归档 */
  ARCHIVED: 'archived',
} as const

/** 排序方式常量 */
export const SORT_OPTIONS = {
  /** 按日期排序 */
  DATE: 'date',
  /** 按标题排序 */
  TITLE: 'title',
  /** 按阅读时间排序 */
  READING_TIME: 'readingTime',
  /** 按字数排序 */
  WORD_COUNT: 'wordCount',
} as const

/** 排序顺序常量 */
export const SORT_ORDERS = {
  /** 升序 */
  ASC: 'asc',
  /** 降序 */
  DESC: 'desc',
} as const

/** 分页常量 */
export const PAGINATION = {
  /** 默认页面大小 */
  DEFAULT_PAGE_SIZE: 10,
  /** 最大页面大小 */
  MAX_PAGE_SIZE: 100,
  /** 首页文章数量 */
  HOME_POSTS_LIMIT: 6,
  /** 相关文章数量 */
  RELATED_POSTS_LIMIT: 3,
  /** 热门标签数量 */
  POPULAR_TAGS_LIMIT: 20,
  /** 最新文章数量（侧边栏） */
  RECENT_POSTS_LIMIT: 5,
} as const

/** 图片常量 */
export const IMAGES = {
  /** 默认封面图 */
  DEFAULT_COVER: '/images/common/default-cover.jpg',
  /** 默认头像 */
  DEFAULT_AVATAR: '/images/common/default-avatar.jpg',
  /** OG 图片 */
  OG_IMAGE: '/images/common/og-image.jpg',
  /** Favicon */
  FAVICON: '/favicon.ico',
  /** Apple Touch Icon */
  APPLE_TOUCH_ICON: '/apple-touch-icon.png',
} as const

/** 验证规则常量 */
export const VALIDATION = {
  /** 最小标题长度 */
  MIN_TITLE_LENGTH: 1,
  /** 最大标题长度 */
  MAX_TITLE_LENGTH: 100,
  /** 最小描述长度 */
  MIN_DESCRIPTION_LENGTH: 0,
  /** 最大描述长度 */
  MAX_DESCRIPTION_LENGTH: 300,
  /** 最小内容长度 */
  MIN_CONTENT_LENGTH: 1,
  /** 最大标签数量 */
  MAX_TAGS_COUNT: 10,
  /** 最大标签长度 */
  MAX_TAG_LENGTH: 20,
} as const

/** 时间格式常量 */
export const DATE_FORMATS = {
  /** 完整日期时间 */
  FULL: 'YYYY-MM-DD HH:mm:ss',
  /** 日期 */
  DATE: 'YYYY-MM-DD',
  /** 时间 */
  TIME: 'HH:mm:ss',
  /** 简短时间 */
  SHORT_TIME: 'HH:mm',
  /** 相对时间格式 */
  RELATIVE: 'relative',
  /** ISO 格式 */
  ISO: 'iso',
} as const

/** 错误代码常量 */
export const ERROR_CODES = {
  /** 通用错误 */
  GENERIC_ERROR: 'GENERIC_ERROR',
  /** 网络错误 */
  NETWORK_ERROR: 'NETWORK_ERROR',
  /** 文件未找到 */
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  /** 解析错误 */
  PARSE_ERROR: 'PARSE_ERROR',
  /** 验证错误 */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** 权限错误 */
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  /** 服务器错误 */
  SERVER_ERROR: 'SERVER_ERROR',
} as const

/** 成功代码常量 */
export const SUCCESS_CODES = {
  /** 操作成功 */
  SUCCESS: 'SUCCESS',
  /** 创建成功 */
  CREATED: 'CREATED',
  /** 更新成功 */
  UPDATED: 'UPDATED',
  /** 删除成功 */
  DELETED: 'DELETED',
} as const

/** 缓存时间常量（秒） */
export const CACHE_TIMES = {
  /** 1分钟 */
  ONE_MINUTE: 60,
  /** 5分钟 */
  FIVE_MINUTES: 300,
  /** 15分钟 */
  FIFTEEN_MINUTES: 900,
  /** 1小时 */
  ONE_HOUR: 3600,
  /** 1天 */
  ONE_DAY: 86400,
  /** 1周 */
  ONE_WEEK: 604800,
  /** 1个月 */
  ONE_MONTH: 2592000,
} as const

/** 环境常量 */
export const ENVIRONMENTS = {
  /** 开发环境 */
  DEVELOPMENT: 'development',
  /** 测试环境 */
  TEST: 'test',
  /** 生产环境 */
  PRODUCTION: 'production',
} as const

/** 设备断点常量 */
export const BREAKPOINTS = {
  /** 手机 */
  MOBILE: 576,
  /** 平板 */
  TABLET: 768,
  /** 桌面 */
  DESKTOP: 992,
  /** 大屏桌面 */
  LARGE_DESKTOP: 1200,
} as const