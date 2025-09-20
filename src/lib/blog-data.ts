/**
 * 博客数据获取 - 从 markdown 文件读取数据
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogCategoryData, Tag } from '@/types/blog'
import { getAllCategoriesConfig, getCategorySlug, configToBlogCategoryData } from '@/config/categories'

// 示例文章数据 - 只保留一份
export const mockPosts: BlogPost[] = [
  {
    id: 'hello-world',
    slug: 'hello-world',
    title: 'Hello World - 我的第一篇博客文章',
    excerpt: '欢迎来到我的博客！这是第一篇文章，介绍了博客的基本功能和特色。',
    content: `# Hello World - 欢迎来到我的博客

欢迎来到我的个人博客！这是我的第一篇文章，我想在这里分享一下创建这个博客的经历和想法。

## 为什么要创建这个博客？

在数字化时代，拥有一个自己的博客就像拥有一个数字化的家。这里是我表达想法、分享知识和记录成长的地方。

### 主要目的：

1. **知识分享** - 分享我在技术领域的学习心得
2. **思考记录** - 记录日常的思考和感悟
3. **技术交流** - 与志同道合的朋友交流技术
4. **个人成长** - 通过写作促进自己的思考和表达能力

## 博客的技术栈

这个博客使用了现代化的技术栈来构建：

### 前端技术
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架

### 内容管理
- **Markdown** - 文章写作格式
- **Gray Matter** - Front Matter 解析
- **Remark** - Markdown 处理

## 代码示例

让我展示一个简单的 React 组件：

\`\`\`tsx
import React from 'react'

interface GreetingProps {
  name: string
}

export function Greeting({ name }: GreetingProps) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h1 className="text-2xl font-bold text-blue-800">
        Hello, {name}!
      </h1>
      <p className="text-blue-600">
        欢迎来到我的博客！
      </p>
    </div>
  )
}
\`\`\`

> 这只是开始，精彩还在后面。让我们一起在技术的道路上前行！`,
    date: '2024-01-15',
    publishedAt: '2024-01-15',
    category: {
      name: '思考笔记',
      slug: 'thinking',
      icon: '🤔'
    },
    tags: ['博客', 'Next.js', 'React'],
    author: 'Cooper',
    status: 'published' as const,
    featured: true,
    coverImage: '/images/posts/hello-world.svg',
    wordCount: 800,
    readingTime: 4,
    views: 1250,
    filePath: 'posts/thinking/hello-world.md'
  }
]

// 标签数据 - 只保留相关的
export const mockTags: Tag[] = [
  { id: '1', name: '博客', slug: 'blog', postCount: 1 },
  { id: '2', name: 'Next.js', slug: 'nextjs', postCount: 1 },
  { id: '3', name: 'React', slug: 'react', postCount: 1 }
]

// 从 markdown 文件读取单个文章的函数
function readMarkdownFile(filePath: string): BlogPost | null {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    const { data: frontMatter, content } = matter(fileContent)
    
    // 获取分类信息
    const categorySlug = frontMatter.category || 'thinking'
    const categoryConfig = getAllCategoriesConfig().find(c => c.slug === categorySlug)
    const categoryData = categoryConfig ? configToBlogCategoryData(categoryConfig) : {
      name: '思考笔记',
      slug: 'thinking',
      icon: '🤔'
    }
    
    return {
      id: frontMatter.slug || path.basename(filePath, '.md'),
      slug: frontMatter.slug || path.basename(filePath, '.md'),
      title: frontMatter.title || '无标题',
      excerpt: frontMatter.excerpt || '',
      content,
      date: frontMatter.date || frontMatter.publishedAt || new Date().toISOString().split('T')[0],
      publishedAt: frontMatter.publishedAt || frontMatter.date || new Date().toISOString().split('T')[0],
      category: categoryData,
      tags: frontMatter.tags || [],
      author: frontMatter.author || 'Cooper',
      status: frontMatter.status || 'published',
      featured: frontMatter.featured || false,
      coverImage: frontMatter.coverImage,
      wordCount: frontMatter.wordCount || content.length,
      readingTime: frontMatter.readingTime || calculateReadingTime(content.length),
      views: frontMatter.views || 0,
      filePath
    }
  } catch (error) {
    console.error(`Error reading markdown file ${filePath}:`, error)
    return null
  }
}

// 博客数据获取函数
export async function getAllPosts(): Promise<BlogPost[]> {
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 尝试从 markdown 文件读取
  const markdownPost = readMarkdownFile('posts/thinking/hello-world.md')
  
  if (markdownPost) {
    return [markdownPost].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
  
  // 如果读取失败，回退到 mock 数据
  return mockPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // 特殊处理已知的 markdown 文件
  if (slug === 'hello-world') {
    const markdownPost = readMarkdownFile('posts/thinking/hello-world.md')
    if (markdownPost) {
      return markdownPost
    }
  }
  
  // 回退到 mock 数据
  return mockPosts.find(post => post.slug === slug) || null
}

export async function getAllCategories(): Promise<BlogCategoryData[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // 从配置生成分类数据，并动态统计文章数量
  const posts = await getAllPosts()
  const categoryConfigs = getAllCategoriesConfig()
  
  return categoryConfigs.map(config => {
    // 统计该分类下的文章数量
    const postCount = posts.filter(post => {
      const postCategorySlug = getCategorySlug(post.category.slug)
      return postCategorySlug === config.slug
    }).length
    
    return configToBlogCategoryData(config, postCount)
  })
}

export async function getAllTags(): Promise<Tag[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // 从所有文章中动态提取标签
  const posts = await getAllPosts()
  const tagMap = new Map<string, { name: string; postCount: number }>()
  
  // 统计每个标签的使用次数
  posts.forEach(post => {
    post.tags.forEach(tagName => {
      const current = tagMap.get(tagName) || { name: tagName, postCount: 0 }
      tagMap.set(tagName, { ...current, postCount: current.postCount + 1 })
    })
  })
  
  // 生成标签对象，优先使用预定义的slug，否则自动生成
  const tags: Tag[] = Array.from(tagMap.entries()).map(([tagName, data]) => {
    const predefinedTag = mockTags.find(t => t.name === tagName)
    return {
      id: predefinedTag?.id || generateTagId(tagName),
      name: tagName,
      slug: predefinedTag?.slug || generateTagSlug(tagName),
      postCount: data.postCount,
      description: predefinedTag?.description
    }
  })
  
  return tags.sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
}

// 生成标签ID
function generateTagId(name: string): string {
  return `tag-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
}

// 生成标签slug
function generateTagSlug(name: string): string {
  // 中文标签的特殊处理
  const slugMap: Record<string, string> = {
    '博客': 'blog',
    '复盘': 'review',
    '思考': 'thinking',
    '学习': 'learning',
    '总结': 'summary',
    '随笔': 'essay',
    '项目管理': 'project-management',
    '项目复盘': 'project-review',
    '技术分享': 'tech-sharing',
    '生活感悟': 'life-insights',
    '个人成长': 'personal-growth',
    '工作经验': 'work-experience'
  }
  
  // 如果有预设映射，使用预设的
  if (slugMap[name]) {
    return slugMap[name]
  }
  
  // 对于纯英文/数字，转小写并替换特殊字符
  if (/^[a-zA-Z0-9\s\-_.]+$/.test(name)) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  }
  
  // 对于包含中文的，使用拼音或自定义映射
  // 如果没有预设映射，生成一个基于内容的slug
  return `tag-${Date.now().toString(36)}`
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return mockPosts.filter(post => {
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
  await new Promise(resolve => setTimeout(resolve, 50))
  // 使用动态标签系统查找标签
  const tag = await getTagBySlug(tagSlug)
  if (!tag) return []
  
  // 使用标签名称来匹配文章的 tags 数组
  return mockPosts.filter(post => post.tags.includes(tag.name))
}

// 标签名称到slug的映射
export function getTagSlugByName(tagName: string): string {
  // 先检查预定义的映射
  const predefinedTag = mockTags.find(t => t.name === tagName)
  if (predefinedTag) return predefinedTag.slug
  
  // 使用与 generateTagSlug 相同的逻辑
  return generateTagSlug(tagName)
}

// 根据slug获取标签信息（异步版本）
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const allTags = await getAllTags()
  return allTags.find(t => t.slug === slug) || null
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