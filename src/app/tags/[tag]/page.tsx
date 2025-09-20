import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag } from '@/lib/blog-data'
import { PostGrid } from '@/components/blog'
import { Breadcrumb } from '@/components/layout/Navigation'
import { Badge } from '@/components/ui/Badge'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  // 在开发模式下不预生成静态参数，支持动态路由
  if (process.env.NODE_ENV === 'development') {
    return []
  }
  
  try {
    const tags = await getAllTags()
    
    const params = tags.map((tag) => ({
      tag: tag.slug,
    }))
    
    console.log('Generated tag params:', params.map(p => p.tag))
    
    // 如果没有标签，返回默认路径
    if (params.length === 0) {
      return [
        { tag: 'blog' },
        { tag: 'nextjs' },
        { tag: 'react' },
        { tag: 'frontend' }
      ]
    }
    
    return params
  } catch (error) {
    console.error('Error in generateStaticParams for tags:', error)
    return [
      { tag: 'blog' },
      { tag: 'nextjs' },
      { tag: 'react' },
      { tag: 'frontend' }
    ]
  }
}

// 启用动态路由段的静态生成
export const dynamicParams = true

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params
  const tags = await getAllTags()
  const tag = tags.find(t => t.slug === tagSlug)
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `${tag.name} - 标签`,
    description: `浏览标签 "${tag.name}" 下的所有文章`,
  }
}

async function TagContent({ tagSlug }: { tagSlug: string }) {
  const [tags, posts] = await Promise.all([
    getAllTags(),
    getPostsByTag(tagSlug)
  ])
  
  const tag = tags.find(t => t.slug === tagSlug)
  
  if (!tag) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Breadcrumb 
        items={[
          { title: '标签', href: '/tags' },
          { title: tag.name }
        ]} 
      />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Badge variant="default" size="lg">
            #{tag.name}
          </Badge>
          <span className="text-muted-foreground">
            {posts.length} 篇文章
          </span>
        </div>

        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <div className="text-center py-12">
            <div className="space-y-3">
              <div className="text-4xl">🏷️</div>
              <h3 className="text-lg font-semibold">该标签下暂无文章</h3>
              <p className="text-muted-foreground">
                敬请期待更多相关内容
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <TagContent tagSlug={tag} />
      </Suspense>
    </div>
  )
}