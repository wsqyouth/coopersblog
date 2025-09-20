import { Suspense } from 'react'
import { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog-data'
import { PaginatedPostList } from '@/components/blog'
import { Breadcrumb } from '@/components/layout/Navigation'

export const metadata: Metadata = {
  title: '文章列表',
  description: '浏览所有博客文章，包含技术分享、思考笔记和生活感悟。',
}

async function PostsContent() {
  const posts = await getAllPosts()

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="space-y-4">
        <Breadcrumb items={[{ title: '文章' }]} />
        <div>
          <h1 className="text-3xl font-bold">所有文章</h1>
          <p className="text-muted-foreground mt-2">
            浏览 {posts.length} 篇文章，涵盖技术分享、思考笔记和生活感悟
          </p>
        </div>
      </div>

      {/* 文章列表 */}
      <PaginatedPostList posts={posts} postsPerPage={6} />
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-20" />
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <div className="h-48 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-16" />
              <div className="h-6 bg-muted rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostsSkeleton />}>
        <PostsContent />
      </Suspense>
    </div>
  )
}