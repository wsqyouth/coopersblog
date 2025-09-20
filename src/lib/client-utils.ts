/**
 * 客户端安全的工具函数
 */

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

// 标签相关函数
export function generateTagSlug(tagName: string): string {
  return tagName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')
}

// 默认标签数据（客户端使用）
const defaultClientTags = [
  { id: '1', name: 'Markdown', slug: 'markdown', count: 1, color: '#2563EB' },
  { id: '2', name: '语法', slug: 'syntax', count: 1, color: '#7C3AED' },
  { id: '3', name: '模板', slug: 'template', count: 1, color: '#059669' },
  { id: '4', name: 'React', slug: 'react', count: 0, color: '#61DAFB' },
  { id: '5', name: 'Next.js', slug: 'nextjs', count: 0, color: '#000000' },
  { id: '6', name: 'TypeScript', slug: 'typescript', count: 0, color: '#3178C6' },
]

// 标签名称到slug的映射
export function getTagSlugByName(tagName: string): string {
  // 先检查预定义的映射
  const predefinedTag = defaultClientTags.find(t => t.name === tagName)
  if (predefinedTag) return predefinedTag.slug
  
  // 使用与 generateTagSlug 相同的逻辑
  return generateTagSlug(tagName)
}