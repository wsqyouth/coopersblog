import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, getTagSlugByName } from '@/lib/blog-data'
import { PostMetaDetailed, ArticleTagList } from '@/components/blog'
import { Breadcrumb } from '@/components/layout/Navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    
    // 确保至少返回现有的 mock 数据路径
    const params = posts.map((post) => ({
      slug: post.slug,
    }))
    
    // 如果没有文章，返回默认的 mock 数据路径
    if (params.length === 0) {
      return [
        { slug: 'hello-world' },
        { slug: 'next-js-best-practices' },
        { slug: 'react-19-features' }
      ]
    }
    
    return params
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    // 返回默认路径以防止构建失败
    return [
      { slug: 'hello-world' },
      { slug: 'next-js-best-practices' },
      { slug: 'react-19-features' }
    ]
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* 面包屑导航 */}
      <Breadcrumb 
        items={[
          { title: '文章', href: '/posts' },
          { title: post.title }
        ]} 
      />

      {/* 文章头部 */}
      <article className="space-y-8">
        <header className="space-y-6">
          {/* 分类标签 */}
          {post.category && (
            <Badge variant="outline" asChild>
              <Link href={`/categories/${post.category.slug}`}>
                {post.category.icon && (
                  <span className="mr-1">{post.category.icon}</span>
                )}
                {post.category.name}
              </Link>
            </Badge>
          )}

          {/* 标题 */}
          <h1 className="text-4xl font-bold leading-tight">
            {post.title}
          </h1>

          {/* 摘要 */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* 元信息 */}
          <PostMetaDetailed
            date={new Date(post.publishedAt)}
            author={post.author}
            wordCount={post.wordCount}
            views={post.views}
          />

          {/* 封面图 */}
          {post.coverImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}

          {/* 特色文章标记 */}
          {post.featured && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <span className="text-primary">⭐</span>
              <span className="text-sm font-medium text-primary">
                这是一篇精选文章
              </span>
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* 文章底部 */}
        <footer className="space-y-6 pt-8 border-t">
          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <ArticleTagList tags={post.tags.map(tag => ({
              id: getTagSlugByName(tag),
              name: tag,
              slug: getTagSlugByName(tag)
            }))} />
          )}

          {/* 文章信息卡片 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    发布于 {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    字数: {post.wordCount?.toLocaleString()} · 
                    阅读时长: {post.readingTime} 分钟
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/posts">
                      ← 返回文章列表
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/categories/${post.category?.slug}`}>
                      更多{post.category?.name}文章
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </footer>
      </article>
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-4 bg-muted rounded w-40" />
      
      <div className="space-y-6">
        <div className="h-6 bg-muted rounded w-20" />
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded w-3/4" />
        </div>
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-6 bg-muted rounded w-80" />
        <div className="aspect-video bg-muted rounded-lg" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-4 bg-muted rounded" />
        ))}
      </div>
    </div>
  )
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Suspense fallback={<PostSkeleton />}>
        <PostContent slug={slug} />
      </Suspense>
    </div>
  )
}