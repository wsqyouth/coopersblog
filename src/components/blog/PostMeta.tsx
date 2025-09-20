import { formatDistanceToNow, format } from 'date-fns'
import { CalendarIcon, ClockIcon, EyeIcon, UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculateReadingTime, formatWordCount } from '@/lib/client-utils'

export interface PostMetaProps {
  date: string | Date
  author?: string
  wordCount?: number
  readingTime?: number
  views?: number
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
  showIcons?: boolean
  showRelativeTime?: boolean
}

export function PostMeta({
  date,
  author,
  wordCount,
  readingTime,
  views,
  variant = 'default',
  className,
  showIcons = true,
  showRelativeTime = false,
}: PostMetaProps) {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  const calculatedReadingTime = readingTime ?? (wordCount ? calculateReadingTime(wordCount) : null)

  const formatDate = (date: Date) => {
    if (showRelativeTime) {
      return formatDistanceToNow(date, { addSuffix: true })
    }
    return format(date, 'yyyy-MM-dd')
  }

  const metaItems = [
    {
      key: 'date',
      icon: CalendarIcon,
      label: '发布时间',
      value: formatDate(dateObject),
      show: true,
    },
    {
      key: 'author',
      icon: UserIcon,
      label: '作者',
      value: author,
      show: !!author,
    },
    {
      key: 'wordCount',
      icon: null,
      label: '字数',
      value: wordCount ? formatWordCount(wordCount) : null,
      show: !!wordCount,
    },
    {
      key: 'readingTime',
      icon: ClockIcon,
      label: '阅读时长',
      value: calculatedReadingTime ? `${calculatedReadingTime}分钟` : null,
      show: !!calculatedReadingTime,
    },
    {
      key: 'views',
      icon: EyeIcon,
      label: '阅读量',
      value: views ? `${views.toLocaleString()}次阅读` : null,
      show: !!views,
    },
  ].filter(item => item.show && item.value)

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'text-xs gap-2 flex-wrap'
      case 'detailed':
        return 'text-sm gap-4 flex-col md:flex-row'
      default:
        return 'text-sm gap-3 flex-wrap'
    }
  }

  const getItemStyles = (index: number) => {
    if (variant === 'detailed') {
      return 'flex items-center gap-1.5'
    }
    return 'flex items-center gap-1'
  }

  return (
    <div
      className={cn(
        'flex items-center text-muted-foreground',
        getVariantStyles(),
        className
      )}
    >
      {metaItems.map((item, index) => {
        const Icon = item.icon
        
        return (
          <div
            key={item.key}
            className={getItemStyles(index)}
            title={`${item.label}: ${item.value}`}
          >
            {showIcons && Icon && (
              <Icon className="h-3.5 w-3.5" />
            )}
            <span className={cn(
              'whitespace-nowrap',
              variant === 'compact' && 'hidden sm:inline',
              // 在默认变体中，隐藏部分不太重要的信息
              variant === 'default' && item.key === 'views' && 'hidden lg:inline',
              variant === 'default' && item.key === 'author' && 'hidden md:inline'
            )}>
              {variant === 'detailed' && `${item.label}: `}
              {item.value}
            </span>
            {index < metaItems.length - 1 && variant !== 'detailed' && (
              <span className="mx-1 text-muted-foreground/60">·</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// 简化版本的 PostMeta，只显示基本信息
export function PostMetaSimple({
  date,
  readingTime,
  className,
}: {
  date: string | Date
  readingTime?: number
  className?: string
}) {
  return (
    <PostMeta
      date={date}
      readingTime={readingTime}
      variant="compact"
      showIcons={false}
      showRelativeTime={true}
      className={className}
    />
  )
}

// 详细版本的 PostMeta，显示所有可用信息
export function PostMetaDetailed({
  date,
  author,
  wordCount,
  views,
  className,
}: {
  date: string | Date
  author?: string
  wordCount?: number
  views?: number
  className?: string
}) {
  return (
    <PostMeta
      date={date}
      author={author}
      wordCount={wordCount}
      views={views}
      variant="detailed"
      showIcons={true}
      className={className}
    />
  )
}

// 内联版本的 PostMeta，用于文章内容中
export function PostMetaInline({
  date,
  author,
  className,
}: {
  date: string | Date
  author?: string
  className?: string
}) {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  
  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      发布于 {format(dateObject, 'yyyy-MM-dd')}
      {author && ` · 作者 ${author}`}
    </span>
  )
}