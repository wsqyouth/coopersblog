import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/blog'

export interface TagListProps {
  tags: Tag[]
  variant?: 'default' | 'compact' | 'minimal' | 'cloud'
  size?: 'default' | 'sm' | 'lg'
  limit?: number
  showCount?: boolean
  interactive?: boolean
  className?: string
  onTagClick?: (tag: Tag) => void
}

export function TagList({
  tags,
  variant = 'default',
  size = 'sm',
  limit,
  showCount = false,
  interactive = true,
  className,
  onTagClick,
}: TagListProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags
  const hasMore = limit && tags.length > limit

  const getTagStyles = (tag: Tag) => {
    switch (variant) {
      case 'cloud':
        // 标签云效果：根据文章数量调整大小
        const baseSize = size === 'lg' ? 14 : size === 'default' ? 12 : 10
        const sizeMultiplier = tag.postCount ? Math.min(tag.postCount / 5, 2) : 1
        return {
          fontSize: `${baseSize + sizeMultiplier * 2}px`,
          opacity: 0.6 + (sizeMultiplier * 0.4),
        }
      default:
        return {}
    }
  }

  const renderTag = (tag: Tag, index: number) => {
    const tagContent = (
      <>
        {tag.name}
        {showCount && tag.postCount && (
          <span className="ml-1 text-xs opacity-70">
            ({tag.postCount})
          </span>
        )}
      </>
    )

    const key = tag.id || tag.slug || index
    const baseProps = {
      className: cn(
        'transition-all duration-200',
        variant === 'minimal' && 'hover:bg-accent hover:text-accent-foreground',
        variant === 'cloud' && 'hover:opacity-100'
      ),
      style: getTagStyles(tag),
    }

    // Convert size for different components
    const buttonSize = size === 'default' ? 'default' : size
    const badgeSize = size === 'default' ? 'md' : size

    if (interactive && onTagClick) {
      return (
        <Button
          key={key}
          {...baseProps}
          variant={variant === 'minimal' ? 'ghost' : 'outline'}
          size={buttonSize}
          onClick={() => onTagClick(tag)}
        >
          {tagContent}
        </Button>
      )
    }

    if (interactive) {
      return (
        <Badge
          key={key}
          {...baseProps}
          variant={variant === 'minimal' ? 'secondary' : 'outline'}
          size={badgeSize}
          asChild
        >
          <Link href={`/tags/${tag.slug}`}>
            {tagContent}
          </Link>
        </Badge>
      )
    }

    return (
      <Badge
        key={key}
        {...baseProps}
        variant={variant === 'minimal' ? 'secondary' : 'outline'}
        size={badgeSize}
      >
        {tagContent}
      </Badge>
    )
  }

  const getContainerStyles = () => {
    switch (variant) {
      case 'compact':
        return 'flex flex-wrap gap-1'
      case 'minimal':
        return 'flex flex-wrap gap-1'
      case 'cloud':
        return 'flex flex-wrap gap-2 items-center justify-center text-center'
      default:
        return 'flex flex-wrap gap-2'
    }
  }

  return (
    <div className={cn(getContainerStyles(), className)}>
      {displayTags.map(renderTag)}
      
      {hasMore && (
        <Badge
          variant="outline"
          size={size === 'default' ? 'md' : size}
          className="text-muted-foreground cursor-default"
        >
          +{tags.length - limit!}
        </Badge>
      )}
    </div>
  )
}

// 紧凑标签列表
export function CompactTagList({
  tags,
  limit = 3,
  className,
}: {
  tags: Tag[]
  limit?: number
  className?: string
}) {
  return (
    <TagList
      tags={tags}
      variant="compact"
      size="sm"
      limit={limit}
      className={className}
    />
  )
}

// 标签云
export function TagCloud({
  tags,
  className,
  onTagClick,
}: {
  tags: Tag[]
  className?: string
  onTagClick?: (tag: Tag) => void
}) {
  return (
    <TagList
      tags={tags}
      variant="cloud"
      size="default"
      showCount={true}
      interactive={true}
      onTagClick={onTagClick}
      className={className}
    />
  )
}

// 热门标签列表
export function PopularTagList({
  tags,
  limit = 10,
  className,
}: {
  tags: Tag[]
  limit?: number
  className?: string
}) {
  // 按文章数量排序
  const sortedTags = [...tags].sort((a, b) => {
    const aCount = a.postCount || 0
    const bCount = b.postCount || 0
    return bCount - aCount
  })

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-sm text-foreground">热门标签</h3>
      <TagList
        tags={sortedTags}
        variant="default"
        size="sm"
        limit={limit}
        showCount={true}
        interactive={true}
      />
    </div>
  )
}

// 文章标签列表（用于文章详情页）
export function ArticleTagList({
  tags,
  className,
}: {
  tags: Tag[]
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">标签:</span>
      <TagList
        tags={tags}
        variant="default"
        size="sm"
        interactive={true}
      />
    </div>
  )
}