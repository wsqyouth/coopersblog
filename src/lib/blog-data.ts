/**
 * 博客数据获取 - 从 markdown 文件读取数据
 */

import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogCategoryData, Tag } from '@/types/blog'
import { getAllCategoriesConfig, getCategorySlug, configToBlogCategoryData } from '@/config/categories'

// 缓存相关
let cachedPosts: BlogPost[] | null = null
let cachedCategories: BlogCategoryData[] | null = null
let cachedTags: Tag[] | null = null
let cacheTimestamp: number = 0
let categoriesTimestamp: number = 0
let tagsTimestamp: number = 0
const CACHE_DURATION = 2 * 60 * 1000 // 2分钟缓存，减少缓存时间提高数据新鲜度

// 生成文件路径的唯一标识 - 使用简单哈希替代crypto
function generateFileId(filePath: string): string {
  // 使用简单的字符串哈希算法替代crypto
  let hash = 0
  if (filePath.length === 0) return hash.toString(36)
  
  for (let i = 0; i < filePath.length; i++) {
    const char = filePath.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36).substring(0, 8)
}

// 从文件路径提取分类
function extractCategoryFromPath(filePath: string): string {
  const pathParts = filePath.split('/')
  // posts/category/filename.md => category
  if (pathParts.length >= 3 && pathParts[0] === 'posts') {
    return pathParts[1]
  }
  // 如果在根目录，默认为 'other'
  return 'other'
}

// 默认兜底文章数据 - 当所有文章被删除时的 Markdown 语法模板
export const defaultPosts: BlogPost[] = [
  {
    id: 'markdown-template',
    slug: 'markdown-template',
    title: 'Markdown 语法演示模板',
    excerpt: '这是一个 Markdown 语法演示模板，展示了 Markdown 的基本语法和格式。',
    content: `# Markdown 语法演示

这是一级标题，用于文档的主标题。

## 二级标题

这是二级标题，用于主要章节。

### 三级标题

这是三级标题，用于子章节。

## 文本格式

**粗体文本**使用两个星号包围。

*斜体文本*使用一个星号包围。

\`行内代码\`使用反引号包围。

~~删除线文本~~使用两个波浪号包围。

## 列表

### 无序列表
- 列表项目 1
- 列表项目 2
  - 嵌套列表项目
  - 另一个嵌套项目
- 列表项目 3

### 有序列表
1. 第一项
2. 第二项
3. 第三项

## 代码块

\`\`\`javascript
// JavaScript 代码示例
function helloWorld() {
  console.log("Hello, World!");
  return "Welcome to Markdown!";
}

helloWorld();
\`\`\`

\`\`\`python
# Python 代码示例
def hello_world():
    print("Hello, World!")
    return "Welcome to Markdown!"

hello_world()
\`\`\`

## 引用

> 这是一个引用块，用于引用他人的话语或重要信息。
> 
> 引用可以跨越多行，保持良好的格式。

## 链接和图片

[这是一个链接](https://example.com)

![图片描述](https://via.placeholder.com/400x200?text=Sample+Image)

## 表格

| 列标题 1 | 列标题 2 | 列标题 3 |
|---------|---------|---------|
| 行 1 列 1 | 行 1 列 2 | 行 1 列 3 |
| 行 2 列 1 | 行 2 列 2 | 行 2 列 3 |
| 行 3 列 1 | 行 3 列 2 | 行 3 列 3 |

## 分割线

---

## 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 另一个未完成的任务

这个模板展示了 Markdown 的主要语法元素，可以作为写作参考。`,
    date: new Date().toISOString().split('T')[0],
    publishedAt: new Date().toISOString().split('T')[0],
    category: {
      name: '示例',
      slug: 'example',
      icon: '📝'
    },
    tags: ['Markdown', '语法', '模板'],
    author: 'System',
    status: 'published' as const,
    featured: false,
    coverImage: '/images/common/markdown.svg',
    wordCount: 320,
    readingTime: 2,
    views: 0,
    filePath: 'default/markdown-template.md'
  }
]

// 默认标签数据
export const defaultTags: Tag[] = [
  { id: '1', name: 'Markdown', slug: 'markdown', postCount: 1 },
  { id: '2', name: '语法', slug: 'syntax', postCount: 1 },
  { id: '3', name: '模板', slug: 'template', postCount: 1 }
]

// 扫描所有 markdown 文件
function scanMarkdownFiles(): string[] {
  try {
    const postsDir = path.join(process.cwd(), 'posts')
    const files: string[] = []
    
    function scanDirectory(dir: string, relativePath: string = ''): void {
      const items = fs.readdirSync(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          const newRelativePath = relativePath ? path.join(relativePath, item) : item
          scanDirectory(fullPath, newRelativePath)
        } else if (item.endsWith('.md')) {
          const filePath = relativePath 
            ? path.join('posts', relativePath, item).replace(/\\/g, '/')
            : path.join('posts', item).replace(/\\/g, '/')
          files.push(filePath)
        }
      }
    }
    
    scanDirectory(postsDir)
    return files
  } catch (error) {
    console.error('Error scanning markdown files:', error)
    return []
  }
}

// 自动提取文章摘要
function extractExcerpt(content: string, maxLength: number = 100): string {
  // 移除 markdown 标记和 HTML 标签
  const cleanContent = content
    .replace(/^#+\s+/gm, '') // 移除标题标记
    .replace(/\*\*(.+?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.+?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.+?)`/g, '$1') // 移除行内代码标记
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[.*?\]\(.+?\)/g, '') // 移除图片
    .replace(/>\s+/g, '') // 移除引用标记
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim()
  
  // 截取前 maxLength 个字符
  if (cleanContent.length <= maxLength) {
    return cleanContent
  }
  
  return cleanContent.substring(0, maxLength).trim() + '...'
}

// 从 markdown 文件读取单个文章的函数（异步版本）
async function readMarkdownFile(filePath: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContent = await fsPromises.readFile(fullPath, 'utf8')
    const { data: frontMatter, content } = matter(fileContent)
    
    // 根据新规则：分类由目录名决定
    const categorySlug = extractCategoryFromPath(filePath)
    const categoryConfig = getAllCategoriesConfig().find(c => c.slug === categorySlug)
    const categoryData: BlogCategoryData = categoryConfig ? configToBlogCategoryData(categoryConfig) : {
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      slug: categorySlug,
      icon: '📂'
    }
    
    // 生成唯一标识和 slug
    const fileName = path.basename(filePath, '.md')
    const fileId = generateFileId(filePath)
    
    // 自动生成字段的逻辑
    const id = frontMatter.id || fileId
    const slug = frontMatter.slug || fileName
    const title = frontMatter.title || fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    const excerpt = frontMatter.excerpt || extractExcerpt(content)
    
    // 处理标签数据：支持字符串数组和对象数组两种格式
    let tags: string[] = []
    if (Array.isArray(frontMatter.tags)) {
      tags = frontMatter.tags.map((tag: any) => {
        if (typeof tag === 'string') {
          return tag
        } else if (typeof tag === 'object' && tag.name) {
          return tag.name
        } else {
          console.warn(`Invalid tag format in ${filePath}:`, tag)
          return String(tag)
        }
      })
    } else if (frontMatter.tags) {
      console.warn(`Tags should be an array in ${filePath}, found:`, typeof frontMatter.tags)
      tags = []
    }
    
    // 使用原有的 mock 数据作为默认值
    const defaultPost = defaultPosts.find(post => post.slug === slug) || defaultPosts[0]
    
    return {
      id,
      slug,
      title,
      excerpt,
      content,
      date: frontMatter.date || defaultPost.date,
      publishedAt: frontMatter.publishedAt || frontMatter.date || defaultPost.publishedAt,
      category: categoryData,
      tags: tags.length > 0 ? tags : defaultPost.tags,
      author: frontMatter.author || defaultPost.author,
      status: (frontMatter.status as any) || defaultPost.status,
      featured: frontMatter.featured !== undefined ? frontMatter.featured : defaultPost.featured,
      coverImage: frontMatter.coverImage || defaultPost.coverImage,
      wordCount: frontMatter.wordCount || content.length,
      readingTime: frontMatter.readingTime || calculateReadingTime(content.length),
      views: frontMatter.views || defaultPost.views,
      filePath
    }
  } catch (error) {
    console.error(`Error reading markdown file ${filePath}:`, error)
    return null
  }
}

// 并发读取所有 markdown 文件
async function readAllMarkdownFiles(): Promise<BlogPost[]> {
  const markdownFiles = scanMarkdownFiles()
  
  if (markdownFiles.length === 0) {
    console.warn('No markdown files found, falling back to default template')
    return defaultPosts
  }
  
  console.log(`Found ${markdownFiles.length} markdown files, reading concurrently...`)
  
  // 使用 Promise.allSettled 进行并发读取，避免单个文件失败影响整体
  const results = await Promise.allSettled(
    markdownFiles.map(filePath => readMarkdownFile(filePath))
  )
  
  const posts: BlogPost[] = []
  const idMap = new Map<string, { post: BlogPost; filePath: string }>()
  let successCount = 0
  let errorCount = 0
  let duplicateCount = 0
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      const post = result.value
      const filePath = markdownFiles[index]
      
      // 检查是否有重复的 ID（现在基于文件路径的哈希，应该是唯一的）
      if (idMap.has(post.id)) {
        const existing = idMap.get(post.id)!
        console.warn(`Duplicate ID "${post.id}" found:`)
        console.warn(`  - Existing: ${existing.filePath}`)
        console.warn(`  - Duplicate: ${filePath}`)
        console.warn(`  - This should not happen with path-based IDs`)
        duplicateCount++
      } else {
        idMap.set(post.id, { post, filePath })
        posts.push(post)
        successCount++
      }
    } else {
      errorCount++
      console.error(`Failed to read ${markdownFiles[index]}:`, 
        result.status === 'rejected' ? result.reason : 'Unknown error')
    }
  })
  
  console.log(`Successfully read ${successCount} files, ${errorCount} errors, ${duplicateCount} duplicates skipped`)
  
  // 如果没有成功读取任何文件，回退到默认模板数据
  if (posts.length === 0) {
    console.warn('No markdown files could be read, falling back to default template')
    return defaultPosts
  }
  
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// 博客数据获取函数（带缓存优化）
export async function getAllPosts(forceRefresh: boolean = false): Promise<BlogPost[]> {
  // 检查缓存
  const now = Date.now()
  if (!forceRefresh && cachedPosts && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached posts data')
    return cachedPosts
  }
  
  console.log('Fetching posts from markdown files...')
  const startTime = Date.now()
  
  try {
    // 并发读取所有 markdown 文件
    const posts = await readAllMarkdownFiles()
    
    // 更新缓存
    cachedPosts = posts
    cacheTimestamp = now
    
    const endTime = Date.now()
    console.log(`Loaded ${posts.length} posts in ${endTime - startTime}ms`)
    
    return posts
  } catch (error) {
    console.error('Error loading posts:', error)
    
    // 如果有缓存数据，使用缓存
    if (cachedPosts) {
      console.log('Using stale cached data due to error')
      return cachedPosts
    }
    
    // 最后回退到默认模板数据
    console.log('Falling back to default template')
    return defaultPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // 从所有文章中查找
  const allPosts = await getAllPosts()
  return allPosts.find(post => post.slug === slug) || null
}

export async function getAllCategories(): Promise<BlogCategoryData[]> {
  // 检查分类缓存
  const now = Date.now()
  if (cachedCategories && (now - categoriesTimestamp) < CACHE_DURATION) {
    return cachedCategories
  }
  
  // 从配置生成分类数据，并动态统计文章数量
  const posts = await getAllPosts()
  const categoryConfigs = getAllCategoriesConfig()
  
  const categories = categoryConfigs.map(config => {
    // 统计该分类下的文章数量
    const postCount = posts.filter(post => {
      const postCategorySlug = getCategorySlug(post.category.slug)
      return postCategorySlug === config.slug
    }).length
    
    return configToBlogCategoryData(config, postCount)
  })
  
  // 更新缓存
  cachedCategories = categories
  categoriesTimestamp = now
  
  return categories
}

export async function getAllTags(): Promise<Tag[]> {
  // 检查标签缓存
  const now = Date.now()
  if (cachedTags && (now - tagsTimestamp) < CACHE_DURATION) {
    return cachedTags
  }
  
  // 从所有文章中动态提取标签
  const posts = await getAllPosts()
  const tagMap = new Map<string, { name: string; postCount: number }>()
  
  // 统计每个标签的使用次数
  posts.forEach(post => {
    post.tags.forEach(tagName => {
      // 过滤空标签名
      if (!tagName || typeof tagName !== 'string' || !tagName.trim()) {
        console.warn(`Invalid tag name found in post ${post.slug}:`, tagName)
        return
      }
      
      const cleanTagName = tagName.trim()
      const current = tagMap.get(cleanTagName) || { name: cleanTagName, postCount: 0 }
      tagMap.set(cleanTagName, { ...current, postCount: current.postCount + 1 })
    })
  })
  
  // 生成标签对象，优先使用预定义的slug，否则自动生成
  const tags: Tag[] = Array.from(tagMap.entries()).map(([tagName, data]) => {
    const predefinedTag = defaultTags.find(t => t.name === tagName)
    return {
      id: predefinedTag?.id || generateTagId(tagName),
      name: tagName,
      slug: predefinedTag?.slug || generateTagSlug(tagName),
      postCount: data.postCount,
      description: predefinedTag?.description
    }
  })
  
  const sortedTags = tags.sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
  
  // 更新缓存
  cachedTags = sortedTags
  tagsTimestamp = now
  
  return sortedTags
}

// 生成标签ID
function generateTagId(name: string): string {
  if (typeof name !== 'string') {
    console.warn('generateTagId received non-string value:', name)
    name = String(name)
  }
  
  // 处理空字符串或只有空白字符的情况
  if (!name || !name.trim()) {
    console.warn('generateTagId received empty or whitespace-only name:', name)
    return 'tag-empty'
  }
  
  name = name.trim()
  
  // 生成安全的ID，确保不会产生空字符串或只有连字符
  const safeId = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // 替换非字母数字字符为-
    .replace(/-+/g, '-')         // 合并多个连续的-
    .replace(/^-|-$/g, '')       // 去除首尾的-
  
  // 如果处理后为空，使用稳定的哈希值
  if (!safeId) {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    const positiveHash = Math.abs(hash).toString(36).substring(0, 8)
    return `tag-${positiveHash}`
  }
  
  return `tag-${safeId}`
}

// 生成标签slug
function generateTagSlug(name: string): string {
  if (typeof name !== 'string') {
    console.warn('generateTagSlug received non-string value:', name)
    name = String(name)
  }
  
  // 处理空字符串或只有空白字符的情况
  if (!name || !name.trim()) {
    console.warn('generateTagSlug received empty or whitespace-only name:', name)
    return `tag-empty`
  }
  
  name = name.trim()
  
  // 扩展的中文标签映射，包含更多常用标签
  const slugMap: Record<string, string> = {
    // 基础标签
    '博客': 'blog',
    '复盘': 'review',
    '思考': 'thinking',
    '学习': 'learning',
    '总结': 'summary',
    '随笔': 'essay',
    
    // 项目相关
    '项目管理': 'project-management',
    '项目复盘': 'project-review',
    '博客搭建': 'blog-building',
    '技术选型': 'tech-selection',
    
    // 技术相关
    '技术分享': 'tech-sharing',
    '前端开发': 'frontend-development',
    '性能优化': 'performance-optimization',
    '最佳实践': 'best-practices',
    '开发经验': 'development-experience',
    '代码优化': 'code-optimization',
    
    // 生活相关
    '生活感悟': 'life-insights',
    '个人成长': 'personal-growth',
    '工作经验': 'work-experience',
    '个人': 'personal',
    
    // 英文标签保持小写
    'Welcome': 'welcome',
    'Next.js': 'nextjs',
    'React': 'react',
    'React 19': 'react-19',
    'TypeScript': 'typescript',
    'JavaScript': 'javascript'
  }
  
  // 如果有预设映射，使用预设的
  if (slugMap[name]) {
    return slugMap[name]
  }
  
  // 对于纯英文/数字，转小写并替换特殊字符
  if (/^[a-zA-Z0-9\s\-_.]+$/.test(name)) {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')  // 替换非字母数字字符为-
      .replace(/-+/g, '-')         // 合并多个连续的-
      .replace(/^-|-$/g, '')       // 去除首尾的-
    return slug || generateStableSlug(name)
  }
  
  // 对于包含中文或其他字符的，生成一个稳定的slug
  // 不再使用时间戳，而是基于内容生成稳定的slug
  return generateStableSlug(name)
}

// 生成稳定的标签slug（基于内容，而非时间）
function generateStableSlug(name: string): string {
  // 使用简单的哈希算法生成稳定的slug
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // 转换为正数并生成slug
  const positiveHash = Math.abs(hash).toString(36).substring(0, 8)
  return `tag-${positiveHash}`
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  // 从所有文章中筛选指定分类的文章
  const allPosts = await getAllPosts()
  return allPosts.filter(post => {
    // 支持多种分类匹配方式
    const postCategorySlug = getCategorySlug(post.category.slug)
    return postCategorySlug === categorySlug
  })
}

// 分类名称到slug的映射
export function getCategorySlugByName(categoryName: string): string {
  return getCategorySlug(categoryName)
}

// 根据slug获取分类信息
export async function getCategoryBySlug(slug: string): Promise<BlogCategoryData | null> {
  const allCategories = await getAllCategories()
  return allCategories.find(c => c.slug === slug) || null
}

export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  // 使用动态标签系统查找标签
  const tag = await getTagBySlug(tagSlug)
  if (!tag) return []
  
  // 从所有文章中筛选包含该标签的文章
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.tags.includes(tag.name))
}

// 标签名称到slug的映射
export function getTagSlugByName(tagName: string): string {
  // 先检查预定义的映射
  const predefinedTag = defaultTags.find(t => t.name === tagName)
  if (predefinedTag) return predefinedTag.slug
  
  // 使用与 generateTagSlug 相同的逻辑
  return generateTagSlug(tagName)
}

// 根据slug获取标签信息（异步版本）
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const allTags = await getAllTags()
  return allTags.find(t => t.slug === slug) || null
}

// 清除缓存
export function clearPostsCache(): void {
  cachedPosts = null
  cachedCategories = null
  cachedTags = null
  cacheTimestamp = 0
  categoriesTimestamp = 0
  tagsTimestamp = 0
  console.log('All caches cleared')
}

// 获取缓存状态
export function getCacheStatus(): { 
  posts: { cached: boolean; timestamp: number; count: number }
  categories: { cached: boolean; timestamp: number; count: number }
  tags: { cached: boolean; timestamp: number; count: number }
} {
  return {
    posts: {
      cached: cachedPosts !== null,
      timestamp: cacheTimestamp,
      count: cachedPosts?.length || 0
    },
    categories: {
      cached: cachedCategories !== null,
      timestamp: categoriesTimestamp,
      count: cachedCategories?.length || 0
    },
    tags: {
      cached: cachedTags !== null,
      timestamp: tagsTimestamp,
      count: cachedTags?.length || 0
    }
  }
}

// 工具函数
export function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200 // 中文阅读速度大约 200 字/分钟
  return Math.ceil(wordCount / wordsPerMinute)
}

export function formatWordCount(wordCount: number): string {
  if (wordCount < 1000) {
    return `${wordCount}字`
  }
  return `${(wordCount / 1000).toFixed(1)}k字`
}

// 分类数据（现在从配置动态生成）
export function getMockCategories(): BlogCategoryData[] {
  return getAllCategoriesConfig().map((config, index) => 
    configToBlogCategoryData(config, 0)
  )
}