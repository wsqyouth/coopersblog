import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PostMeta, PostMetaSimple } from './PostMeta'
import { TagList } from './TagList'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { getTagSlugByName } from '@/lib/client-utils'
import type { BlogPost } from '@/types/blog'

export interface PostCardProps {
  post: BlogPost
  variant?: 'default' | 'featured' | 'compact' | 'minimal'
  showExcerpt?: boolean
  showTags?: boolean
  showMeta?: boolean
  showImage?: boolean
  showCategory?: boolean
  className?: string
}

export function PostCard({
  post,
  variant = 'default',
  showExcerpt = true,
  showTags = true,
  showMeta = true,
  showImage = true,
  showCategory = true,
  className,
}: PostCardProps) {
  const {
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    category,
    tags,
    wordCount,
    readingTime,
    author,
    views,
    featured,
  } = post

  const postUrl = `/posts/${slug}`

  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
      case 'compact':
        return 'p-4'
      case 'minimal':
        return 'shadow-none border-0 hover:bg-accent/50'
      default:
        return 'hover:shadow-lg transition-shadow duration-200'
    }
  }

  const renderImage = () => {
    if (!showImage || !coverImage) return null

    const imageHeight = variant === 'compact' ? 'h-32' : variant === 'featured' ? 'h-48' : 'h-40'

    return (
      <div className={cn('relative overflow-hidden rounded-t-lg', imageHeight)}>
        <Link href={postUrl}>
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Featured Badge */}
        {featured && variant === 'featured' && (
          <Badge
            variant="default"
            className="absolute top-3 left-3 bg-primary text-primary-foreground"
          >
            精选文章
          </Badge>
        )}

        {/* Category Badge */}
        {showCategory && category && (
          <Link href={`/categories/${category.slug}`}>
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              {category.name}
            </Badge>
          </Link>
        )}
      </div>
    )
  }

  const renderContent = () => {
    if (variant === 'minimal') {
      return (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={postUrl}
              className="flex-1 group"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
            {showMeta && (
              <PostMetaSimple
                date={publishedAt}
                readingTime={readingTime}
                className="shrink-0"
              />
            )}
          </div>
          
          {showExcerpt && excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>
      )
    }

    return (
      <>
        <CardHeader className={variant === 'compact' ? 'pb-3' : 'pb-4'}>
          <div className="space-y-2">
            {/* Category */}
            {showCategory && category && variant !== 'featured' && (
              <Badge variant="outline" className="w-fit text-xs">
                {category.name}
              </Badge>
            )}

            {/* Title */}
            <Link href={postUrl} className="group">
              <h3 className={cn(
                'font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2',
                variant === 'featured' ? 'text-xl' : 'text-lg',
                variant === 'compact' && 'text-base'
              )}>
                {title}
              </h3>
            </Link>

            {/* Meta */}
            {showMeta && (
              <PostMeta
                date={publishedAt}
                author={author}
                wordCount={wordCount}
                readingTime={readingTime}
                views={views}
                variant={variant === 'compact' ? 'compact' : 'default'}
              />
            )}
          </div>
        </CardHeader>

        <CardContent className={variant === 'compact' ? 'pt-0' : ''}>
          <div className="space-y-4">
            {/* Excerpt */}
            {showExcerpt && excerpt && (
              <p className="text-muted-foreground line-clamp-3">
                {excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              {/* Tags */}
              {showTags && tags && tags.length > 0 && (
                <TagList
                  tags={tags.map(tag => ({
                    id: getTagSlugByName(tag),
                    name: tag,
                    slug: getTagSlugByName(tag)
                  }))}
                  variant="compact"
                  limit={variant === 'compact' ? 2 : 3}
                />
              )}

              {/* Read More Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="ml-auto"
              >
                <Link href={postUrl}>
                  阅读更多
                  <svg
                    className="ml-1 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </>
    )
  }

  if (variant === 'minimal') {
    return (
      <Card className={cn(getVariantStyles(), className)}>
        <CardContent className="p-4">
          {renderContent()}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(getVariantStyles(), className)}>
      {renderImage()}
      {renderContent()}
    </Card>
  )
}

// 特色文章卡片
export function FeaturedPostCard({
  post,
  className,
}: {
  post: BlogPost
  className?: string
}) {
  return (
    <PostCard
      post={post}
      variant="featured"
      showExcerpt={true}
      showTags={true}
      showMeta={true}
      showImage={true}
      showCategory={true}
      className={className}
    />
  )
}

// 紧凑文章卡片
export function CompactPostCard({
  post,
  className,
}: {
  post: BlogPost
  className?: string
}) {
  return (
    <PostCard
      post={post}
      variant="compact"
      showExcerpt={false}
      showTags={true}
      showMeta={true}
      showImage={true}
      showCategory={true}
      className={className}
    />
  )
}

// 最小化文章卡片
export function MinimalPostCard({
  post,
  className,
}: {
  post: BlogPost
  className?: string
}) {
  return (
    <PostCard
      post={post}
      variant="minimal"
      showExcerpt={true}
      showTags={false}
      showMeta={true}
      showImage={false}
      showCategory={false}
      className={className}
    />
  )
}