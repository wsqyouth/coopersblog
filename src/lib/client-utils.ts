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

// 模拟标签数据（从blog-data.ts移过来的静态部分）
const mockTags = [
  { id: '1', name: 'React', slug: 'react', count: 5, color: '#61DAFB' },
  { id: '2', name: 'Next.js', slug: 'nextjs', count: 3, color: '#000000' },
  { id: '3', name: 'TypeScript', slug: 'typescript', count: 4, color: '#3178C6' },
  { id: '4', name: 'JavaScript', slug: 'javascript', count: 6, color: '#F7DF1E' },
  { id: '5', name: '思考', slug: 'thinking', count: 2, color: '#8B5CF6' },
  { id: '6', name: '生活', slug: 'life', count: 1, color: '#10B981' },
]

// 标签名称到slug的映射
export function getTagSlugByName(tagName: string): string {
  // 先检查预定义的映射
  const predefinedTag = mockTags.find(t => t.name === tagName)
  if (predefinedTag) return predefinedTag.slug
  
  // 使用与 generateTagSlug 相同的逻辑
  return generateTagSlug(tagName)
}