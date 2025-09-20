'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { BlogCategoryData } from '@/types/blog'

export interface CategoryListProps {
  categories: BlogCategoryData[]
  variant?: 'default' | 'grid' | 'compact' | 'sidebar'
  showCount?: boolean
  showDescription?: boolean
  interactive?: boolean
  className?: string
  onCategoryClick?: (category: BlogCategoryData) => void
}

export function CategoryList({
  categories,
  variant = 'default',
  showCount = true,
  showDescription = true,
  interactive = true,
  className,
  onCategoryClick,
}: CategoryListProps) {
  const renderCategoryItem = (category: BlogCategoryData, index: number) => {
    const categoryContent = (
      <>
        <div className="flex items-center gap-2">
          {category.icon && (
            <span className="text-lg" role="img" aria-label={category.name}>
              {category.icon}
            </span>
          )}
          <span className="font-medium">{category.name}</span>
          {showCount && category.postCount && (
            <Badge variant="secondary" size="sm">
              {category.postCount}
            </Badge>
          )}
        </div>
        {showDescription && category.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {category.description}
          </p>
        )}
      </>
    )

    const key = category.id || category.slug || index
    const baseProps = {
      className: cn(
        'transition-all duration-200',
        variant === 'compact' && 'hover:bg-accent/50',
        variant === 'sidebar' && 'hover:bg-accent'
      ),
      style: category.color ? { '--category-color': category.color } as React.CSSProperties : {},
    }

    if (variant === 'grid') {
      return (
        <Card
          key={key}
          {...baseProps}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => interactive && onCategoryClick?.(category)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {category.icon && (
                <span className="text-xl" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
              )}
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showDescription && category.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {category.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              {showCount && category.postCount && (
                <span className="text-sm text-muted-foreground">
                  {category.postCount} 篇文章
                </span>
              )}
              {interactive && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/categories/${category.slug}`}>
                    查看文章
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    if (variant === 'sidebar') {
      return (
        <div
          key={key}
          {...baseProps}
          className="px-3 py-2 rounded-md cursor-pointer"
        >
          {interactive ? (
            <Link
              href={`/categories/${category.slug}`}
              className="block"
              onClick={() => onCategoryClick?.(category)}
            >
              {categoryContent}
            </Link>
          ) : (
            categoryContent
          )}
        </div>
      )
    }

    if (variant === 'compact') {
      return (
        <Badge
          key={key}
          {...baseProps}
          variant="outline"
          size="md"
          asChild={interactive}
          className="cursor-pointer"
        >
          {interactive ? (
            <Link
              href={`/categories/${category.slug}`}
              onClick={() => onCategoryClick?.(category)}
            >
              {category.icon && (
                <span className="mr-1" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
              )}
              {category.name}
              {showCount && category.postCount && (
                <span className="ml-1">({category.postCount})</span>
              )}
            </Link>
          ) : (
            <>
              {category.icon && (
                <span className="mr-1" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
              )}
              {category.name}
              {showCount && category.postCount && (
                <span className="ml-1">({category.postCount})</span>
              )}
            </>
          )}
        </Badge>
      )
    }

    // Default variant
    return (
      <div
        {...baseProps}
        className="border border-border rounded-lg p-4 hover:shadow-sm cursor-pointer"
      >
        {interactive ? (
          <Link
            href={`/categories/${category.slug}`}
            className="block"
            onClick={() => onCategoryClick?.(category)}
          >
            {categoryContent}
          </Link>
        ) : (
          categoryContent
        )}
      </div>
    )
  }

  const getContainerStyles = () => {
    switch (variant) {
      case 'grid':
        return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
      case 'compact':
        return 'flex flex-wrap gap-2'
      case 'sidebar':
        return 'space-y-1'
      default:
        return 'space-y-3'
    }
  }

  return (
    <div className={cn(getContainerStyles(), className)}>
      {categories.map(renderCategoryItem)}
    </div>
  )
}

// 网格布局分类列表
export function CategoryGrid({
  categories,
  className,
  onCategoryClick,
}: {
  categories: BlogCategoryData[]
  className?: string
  onCategoryClick?: (category: BlogCategoryData) => void
}) {
  return (
    <CategoryList
      categories={categories}
      variant="grid"
      showCount={true}
      showDescription={true}
      interactive={true}
      onCategoryClick={onCategoryClick}
      className={className}
    />
  )
}

// 紧凑分类列表
export function CompactCategoryList({
  categories,
  className,
}: {
  categories: BlogCategoryData[]
  className?: string
}) {
  return (
    <CategoryList
      categories={categories}
      variant="compact"
      showCount={true}
      showDescription={false}
      interactive={true}
      className={className}
    />
  )
}

// 侧边栏分类列表
export function SidebarCategoryList({
  categories,
  className,
  onCategoryClick,
}: {
  categories: BlogCategoryData[]
  className?: string
  onCategoryClick?: (category: BlogCategoryData) => void
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-sm text-foreground">文章分类</h3>
      <CategoryList
        categories={categories}
        variant="sidebar"
        showCount={true}
        showDescription={false}
        interactive={true}
        onCategoryClick={onCategoryClick}
      />
    </div>
  )
}

// 热门分类列表
export function PopularCategoryList({
  categories,
  limit = 5,
  className,
}: {
  categories: BlogCategoryData[]
  limit?: number
  className?: string
}) {
  // 按文章数量排序
  const sortedCategories = [...categories]
    .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
    .slice(0, limit)

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-sm text-foreground">热门分类</h3>
      <CategoryList
        categories={sortedCategories}
        variant="default"
        showCount={true}
        showDescription={false}
        interactive={true}
      />
    </div>
  )
}

// 分类统计卡片
export function CategoryStatsCard({
  category,
  className,
}: {
  category: BlogCategoryData
  className?: string
}) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {category.icon && (
            <span className="text-2xl" role="img" aria-label={category.name}>
              {category.icon}
            </span>
          )}
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground font-normal">
              {category.description}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">文章数量</span>
            <span className="font-medium">{category.postCount || 0} 篇</span>
          </div>
          {category.slug && (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/categories/${category.slug}`}>
                查看所有文章
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}