import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/lib/utils'
import { isImageFile, resolveImagePath } from '@/lib/image-utils'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 基于 react-markdown 的安全渲染器
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // 自定义组件配置，保持原有样式和功能
  const components: Components = {
    // 自定义图片组件，保持原有图片处理逻辑
    img: ({ src, alt, ...props }) => {
      if (src && isImageFile(src)) {
        const resolvedSrc = resolveImagePath(src)
        return (
          <img 
            src={resolvedSrc} 
            alt={alt || ''} 
            className="rounded-lg shadow-md my-6 max-w-full h-auto mx-auto block" 
            loading="lazy"
            {...props}
          />
        )
      }
      return <img src={src} alt={alt} {...props} />
    },
    
    // 自定义代码块样式
    pre: ({ children, ...props }) => (
      <div className="my-6 rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b border-border">
          <div className="text-xs text-muted-foreground font-mono">代码</div>
        </div>
        <pre className="bg-muted/30 p-4 overflow-x-auto text-sm font-mono leading-relaxed" {...props}>
          {children}
        </pre>
      </div>
    ),
    
    // 自定义行内代码样式
    code: ({ children, className, ...props }) => {
      const isInline = !className?.includes('language-')
      if (isInline) {
        return (
          <code 
            className="bg-muted/60 px-2 py-1 rounded text-sm font-mono text-foreground border" 
            {...props}
          >
            {children}
          </code>
        )
      }
      return <code className="text-foreground" {...props}>{children}</code>
    },
    
    // 自定义链接样式
    a: ({ href, children, ...props }) => (
      <a 
        href={href} 
        className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    
    // 自定义引用样式
    blockquote: ({ children, ...props }) => (
      <blockquote 
        className="border-l-4 border-primary bg-muted/30 pl-6 pr-4 py-3 my-4 rounded-r-lg"
        {...props}
      >
        <div className="text-muted-foreground italic">{children}</div>
      </blockquote>
    ),
    
    // 自定义标题样式
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 text-foreground" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold mb-4 mt-6 text-foreground" {...props}>
        {children}
      </h3>
    ),
    
    // 自定义列表样式
    ul: ({ children, ...props }) => (
      <ul className="mb-4 space-y-1 list-none" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-6 space-y-1 list-decimal" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="mb-2 text-foreground flex items-start" {...props}>
        <span className="mr-2">•</span>
        <span>{children}</span>
      </li>
    ),
    
    // 自定义段落样式
    p: ({ children, ...props }) => (
      <p className="mb-4 text-foreground leading-relaxed" {...props}>
        {children}
      </p>
    ),
  }

  return (
    <div 
      className={cn(
        'prose prose-gray dark:prose-invert max-w-none',
        'prose-headings:scroll-mt-20',
        'prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0',
        'prose-code:bg-transparent prose-code:p-0 prose-code:text-current',
        'prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:not-italic',
        'prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-li:marker:text-primary',
        '[&_ul]:list-none [&_ol]:list-decimal [&_ol]:ml-6',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// 默认导出
export default MarkdownRenderer