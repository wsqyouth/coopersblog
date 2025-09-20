/**
 * Markdown 解析核心库
 */

import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

import type { FrontMatter, BlogPost, BlogCategory } from '@/types/blog'
import { blogConfig } from '@/config/site'
import { POST_STATUS } from '@/lib/constants'

/** Markdown 解析选项 */
export interface MarkdownParseOptions {
  /** 是否提取摘要 */
  extractExcerpt?: boolean
  /** 摘要长度 */
  excerptLength?: number
  /** 是否计算字数 */
  calculateWordCount?: boolean
  /** 是否计算阅读时间 */
  calculateReadingTime?: boolean
  /** 是否解析目录 */
  generateToc?: boolean
}

/** 目录项 */
export interface TocItem {
  /** 标题层级 */
  level: number
  /** 标题文本 */
  title: string
  /** 锚点链接 */
  anchor: string
  /** 子标题 */
  children?: TocItem[]
}

/** Markdown 解析结果 */
export interface MarkdownParseResult {
  /** Front Matter 数据 */
  frontMatter: FrontMatter
  /** Markdown 内容 */
  content: string
  /** HTML 内容 */
  html: string
  /** 摘要 */
  excerpt?: string
  /** 字数统计 */
  wordCount?: number
  /** 阅读时间（分钟） */
  readingTime?: number
  /** 目录 */
  toc?: TocItem[]
}

/** 创建 remark 处理器 */
const createMarkdownProcessor = () => {
  return remark()
    .use(remarkHtml, { sanitize: false }) // 转换为 HTML
}

/** Markdown 处理器实例 */
const markdownProcessor = createMarkdownProcessor()

/**
 * 解析 Markdown 文件内容
 */
export async function parseMarkdown(
  fileContent: string,
  options: MarkdownParseOptions = {}
): Promise<MarkdownParseResult> {
  const {
    extractExcerpt = true,
    excerptLength = 200,
    calculateWordCount = true,
    calculateReadingTime = true,
    generateToc = true,
  } = options

  // 解析 Front Matter
  const { data: frontMatter, content } = matter(fileContent)

  // 验证 Front Matter
  const validatedFrontMatter = validateFrontMatter(frontMatter)

  // 处理 Markdown 内容
  const processedContent = await markdownProcessor.process(content)
  const html = processedContent.toString()

  const result: MarkdownParseResult = {
    frontMatter: validatedFrontMatter,
    content,
    html,
  }

  // 提取摘要
  if (extractExcerpt) {
    result.excerpt = extractExcerpt ? generateExcerpt(content, excerptLength) : undefined
  }

  // 计算字数
  if (calculateWordCount) {
    result.wordCount = countWords(content)
  }

  // 计算阅读时间
  if (calculateReadingTime && result.wordCount) {
    result.readingTime = calculateReadingTimeMinutes(result.wordCount)
  }

  // 生成目录
  if (generateToc) {
    result.toc = generateTableOfContents(content)
  }

  return result
}

/**
 * 验证和标准化 Front Matter 数据
 */
export function validateFrontMatter(data: any): FrontMatter {
  const now = new Date().toISOString().split('T')[0]

  return {
    title: data.title || 'Untitled',
    date: data.date || now,
    category: validateCategory(data.category),
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author || 'Cooper',
    description: data.description || '',
    cover: data.cover || '',
    status: validateStatus(data.status),
    pinned: Boolean(data.pinned),
  }
}

/**
 * 验证分类
 */
function validateCategory(category: any): BlogCategory {
  const validCategories = Object.keys(blogConfig.categories) as BlogCategory[]
  return validCategories.includes(category) ? category : 'thinking'
}

/**
 * 验证文章状态
 */
function validateStatus(status: any) {
  const validStatuses = Object.values(POST_STATUS)
  return validStatuses.includes(status) ? status : POST_STATUS.PUBLISHED
}

/**
 * 生成文章摘要
 */
export function generateExcerpt(content: string, length: number = 200): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/^#{1,6}\s+/gm, '') // 移除标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除行内代码
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/^\s*[-*+]\s+/gm, '') // 移除列表标记
    .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
    .replace(/^\s*>\s+/gm, '') // 移除引用标记
    .replace(/\n+/g, ' ') // 将换行符替换为空格
    .trim()

  // 截取指定长度
  if (plainText.length <= length) {
    return plainText
  }

  return plainText.substring(0, length) + '...'
}

/**
 * 计算文章字数
 */
export function countWords(content: string): number {
  // 移除 Markdown 语法后计算字数
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/[#*`_~\[\]()]/g, '') // 移除 Markdown 标记
    .replace(/\s+/g, ' ') // 标准化空白字符
    .trim()

  // 分别计算中文字符和英文单词
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length

  return chineseChars + englishWords
}

/**
 * 计算阅读时间（分钟）
 */
export function calculateReadingTimeMinutes(wordCount: number): number {
  const readingSpeed = blogConfig.readingSpeed || 200
  return Math.ceil(wordCount / readingSpeed)
}

/**
 * 生成目录
 */
export function generateTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const anchor = generateAnchor(title)

    headings.push({
      level,
      title,
      anchor,
    })
  }

  // 构建嵌套结构
  return buildNestedToc(headings)
}

/**
 * 生成锚点链接
 */
function generateAnchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 替换非字母数字和中文字符为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

/**
 * 构建嵌套目录结构
 */
function buildNestedToc(headings: TocItem[]): TocItem[] {
  const result: TocItem[] = []
  const stack: TocItem[] = []

  for (const heading of headings) {
    // 移除比当前标题级别高的项目
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // 顶级标题
      result.push(heading)
    } else {
      // 子标题
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(heading)
    }

    stack.push(heading)
  }

  return result
}

/**
 * 生成文章 slug
 */
export function generateSlug(title: string, date: string): string {
  const dateStr = date.replace(/-/g, '')
  const titleSlug = title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${dateStr}-${titleSlug}`
}

/**
 * 从文件路径生成 slug
 */
export function getSlugFromFilePath(filePath: string): string {
  const fileName = filePath.split('/').pop() || ''
  return fileName.replace(/\.md$/, '')
}

/**
 * 提取图片信息
 */
export function extractImages(content: string): Array<{ src: string; alt: string }> {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const images: Array<{ src: string; alt: string }> = []
  let match

  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1] || '',
      src: match[2],
    })
  }

  return images
}

/**
 * 提取链接信息
 */
export function extractLinks(content: string): Array<{ text: string; href: string }> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links: Array<{ text: string; href: string }> = []
  let match

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      href: match[2],
    })
  }

  return links
}

/**
 * 验证 Markdown 文件格式
 */
export function validateMarkdownFile(content: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  try {
    // 检查是否有 Front Matter
    const { data } = matter(content)

    // 检查必需字段
    if (!data.title) {
      errors.push('缺少标题 (title)')
    }

    if (!data.date) {
      errors.push('缺少日期 (date)')
    }

    if (!data.category) {
      errors.push('缺少分类 (category)')
    }

    // 检查日期格式
    if (data.date && !isValidDate(data.date)) {
      errors.push('日期格式无效')
    }

    // 检查分类是否有效
    if (data.category && !validateCategory(data.category)) {
      errors.push('分类无效')
    }

  } catch (error) {
    errors.push('Front Matter 解析失败')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 验证日期格式
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/)
}