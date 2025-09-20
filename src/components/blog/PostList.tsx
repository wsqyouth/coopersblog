'use client'

import { useState, useMemo } from 'react'
import { PostCard, FeaturedPostCard, CompactPostCard, MinimalPostCard } from './PostCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { BlogPost } from '@/types/blog'

export interface PostListProps {
  posts: BlogPost[]
  variant?: 'default' | 'grid' | 'compact' | 'minimal'
  showFeatured?: boolean
  showPagination?: boolean
  showLoadMore?: boolean
  postsPerPage?: number
  initialLoad?: number
  className?: string
  emptyMessage?: string
  loading?: boolean
}

export function PostList({
  posts,
  variant = 'default',
  showFeatured = true,
  showPagination = false,
  showLoadMore = false,
  postsPerPage = 10,
  initialLoad = 10,
  className,
  emptyMessage = '暂无文章',
  loading = false,
}: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedCount, setLoadedCount] = useState(initialLoad)

  // 分离特色文章和普通文章
  const { featuredPosts, regularPosts } = useMemo(() => {
    const featured = showFeatured ? posts.filter(post => post.featured) : []
    const regular = posts.filter(post => !showFeatured || !post.featured)
    
    return {
      featuredPosts: featured,
      regularPosts: regular,
    }
  }, [posts, showFeatured])

  // 分页逻辑
  const totalPages = Math.ceil(regularPosts.length / postsPerPage)
  const paginatedPosts = useMemo(() => {
    if (showPagination) {
      const start = (currentPage - 1) * postsPerPage
      const end = start + postsPerPage
      return regularPosts.slice(start, end)
    } else if (showLoadMore) {
      return regularPosts.slice(0, loadedCount)
    } else {
      return regularPosts
    }
  }, [regularPosts, currentPage, postsPerPage, showPagination, showLoadMore, loadedCount])

  const hasMore = showLoadMore && loadedCount < regularPosts.length

  const handleLoadMore = () => {
    setLoadedCount(prev => Math.min(prev + postsPerPage, regularPosts.length))
  }

  const getContainerStyles = () => {
    switch (variant) {
      case 'grid':
        return 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
      case 'compact':
        return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'minimal':
        return 'space-y-2'
      default:
        return 'space-y-6'
    }
  }

  const renderPost = (post: BlogPost, index: number) => {
    // 生成唯一的 key，结合 index 避免重复
    const baseKey = post.id || post.slug || `post-${index}`
    const key = `${baseKey}-${index}`
    
    switch (variant) {
      case 'compact':
        return <CompactPostCard key={key} post={post} />
      case 'minimal':
        return <MinimalPostCard key={key} post={post} />
      default:
        return <PostCard key={key} post={post} />
    }
  }

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          上一页
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1
            
            if (totalPages > 5) {
              if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          下一页
        </Button>
      </div>
    )
  }

  const renderLoadMore = () => {
    if (!showLoadMore || !hasMore) return null

    return (
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? '加载中...' : `加载更多 (还有 ${regularPosts.length - loadedCount} 篇)`}
        </Button>
      </div>
    )
  }

  const renderLoading = () => {
    if (!loading) return null

    return (
      <div className={getContainerStyles()}>
        {Array.from({ length: variant === 'compact' ? 8 : 3 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderEmpty = () => {
    if (posts.length > 0) return null

    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="space-y-3">
            <div className="text-4xl">📝</div>
            <h3 className="text-lg font-semibold">暂无内容</h3>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading && posts.length === 0) {
    return renderLoading()
  }

  if (posts.length === 0) {
    return renderEmpty()
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* 特色文章 */}
      {featuredPosts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">精选文章</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredPosts.slice(0, 2).map((post, index) => (
              <FeaturedPostCard
                key={post.id || post.slug || `featured-${index}`}
                post={post}
              />
            ))}
          </div>
        </div>
      )}

      {/* 普通文章列表 */}
      {paginatedPosts.length > 0 && (
        <div className="space-y-6">
          {featuredPosts.length > 0 && (
            <h2 className="text-2xl font-bold">最新文章</h2>
          )}
          <div className={getContainerStyles()}>
            {paginatedPosts.map(renderPost)}
          </div>
        </div>
      )}

      {/* 分页控件 */}
      {renderPagination()}

      {/* 加载更多按钮 */}
      {renderLoadMore()}
    </div>
  )
}

// 网格布局文章列表
export function PostGrid({
  posts,
  className,
}: {
  posts: BlogPost[]
  className?: string
}) {
  return (
    <PostList
      posts={posts}
      variant="grid"
      showFeatured={false}
      className={className}
    />
  )
}

// 紧凑文章列表
export function CompactPostList({
  posts,
  limit = 12,
  className,
}: {
  posts: BlogPost[]
  limit?: number
  className?: string
}) {
  return (
    <PostList
      posts={posts.slice(0, limit)}
      variant="compact"
      showFeatured={false}
      className={className}
    />
  )
}

// 最小化文章列表（侧边栏使用）
export function MinimalPostList({
  posts,
  limit = 5,
  className,
}: {
  posts: BlogPost[]
  limit?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-sm text-foreground">最新文章</h3>
      <PostList
        posts={posts.slice(0, limit)}
        variant="minimal"
        showFeatured={false}
      />
    </div>
  )
}

// 分页文章列表
export function PaginatedPostList({
  posts,
  postsPerPage = 10,
  className,
}: {
  posts: BlogPost[]
  postsPerPage?: number
  className?: string
}) {
  return (
    <PostList
      posts={posts}
      variant="default"
      showFeatured={true}
      showPagination={true}
      postsPerPage={postsPerPage}
      className={className}
    />
  )
}

// 无限滚动文章列表
export function InfinitePostList({
  posts,
  initialLoad = 6,
  loadMore = 6,
  className,
}: {
  posts: BlogPost[]
  initialLoad?: number
  loadMore?: number
  className?: string
}) {
  return (
    <PostList
      posts={posts}
      variant="default"
      showFeatured={true}
      showLoadMore={true}
      postsPerPage={loadMore}
      initialLoad={initialLoad}
      className={className}
    />
  )
}