import { cn } from '@/lib/utils'
import { isImageFile, generateImageHTML } from '@/lib/image-utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 语言关键字高亮映射
const SYNTAX_HIGHLIGHTING = {
  tsx: {
    keywords: ['import', 'export', 'from', 'interface', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'implements'],
    types: ['string', 'number', 'boolean', 'undefined', 'null', 'React', 'JSX'],
    strings: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    comments: /\/\/.*$/gm
  },
  typescript: {
    keywords: ['import', 'export', 'from', 'interface', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'implements', 'type'],
    types: ['string', 'number', 'boolean', 'undefined', 'null'],
    strings: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    comments: /\/\/.*$/gm
  },
  javascript: {
    keywords: ['import', 'export', 'from', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'extends'],
    types: ['undefined', 'null'],
    strings: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    comments: /\/\/.*$/gm
  }
}

// 语法高亮处理
function applySyntaxHighlighting(code: string, language?: string): string {
  if (!language || !SYNTAX_HIGHLIGHTING[language as keyof typeof SYNTAX_HIGHLIGHTING]) {
    return code
  }

  const config = SYNTAX_HIGHLIGHTING[language as keyof typeof SYNTAX_HIGHLIGHTING]
  let highlighted = code

  // 高亮注释
  highlighted = highlighted.replace(config.comments, (match) => 
    `<span class="text-green-600 dark:text-green-400">${match}</span>`
  )

  // 高亮字符串
  highlighted = highlighted.replace(config.strings, (match) => 
    `<span class="text-amber-600 dark:text-amber-400">${match}</span>`
  )

  // 高亮关键字
  config.keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    highlighted = highlighted.replace(regex, 
      `<span class="text-purple-600 dark:text-purple-400 font-medium">${keyword}</span>`
    )
  })

  // 高亮类型
  config.types.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'g')
    highlighted = highlighted.replace(regex, 
      `<span class="text-blue-600 dark:text-blue-400">${type}</span>`
    )
  })

  return highlighted
}

// 改进版本的 Markdown 渲染器
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // 基本的 Markdown 转换
  const processContent = (text: string) => {
    return text
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-4 mt-6 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 text-foreground">$1</h1>')
      // 粗体
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
      // 斜体
      .replace(/\*(.*)\*/gim, '<em class="italic text-foreground">$1</em>')
      // 代码块（增强版）
      .replace(/```(\w+)?\n?([\s\S]*?)```/gim, (match, language, code) => {
        const highlightedCode = applySyntaxHighlighting(code.trim(), language)
        const languageLabel = language ? `<div class="text-xs text-muted-foreground mb-2 font-mono">${language}</div>` : ''
        return `<div class="my-6 rounded-lg border border-border overflow-hidden">
          <div class="bg-muted/50 px-4 py-2 border-b border-border">
            ${languageLabel || '<div class="text-xs text-muted-foreground font-mono">代码</div>'}
          </div>
          <pre class="bg-muted/30 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
            <code class="text-foreground">${highlightedCode}</code>
          </pre>
        </div>`
      })
      // 行内代码
      .replace(/`([^`]*)`/gim, '<code class="bg-muted/60 px-2 py-1 rounded text-sm font-mono text-foreground border">$1</code>')
      // 链接和图片处理（使用工具函数）
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, (match, text, url) => {
        // 使用工具函数检查是否为图片
        if (isImageFile(url)) {
          return generateImageHTML(url, text)
        }
        // 普通链接处理
        return `<a href="${url}" class="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">${text}</a>`
      })
      // 列表项
      .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2 text-foreground">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 text-foreground list-decimal">$1</li>')
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary bg-muted/30 pl-6 pr-4 py-3 my-4 rounded-r-lg"><p class="text-muted-foreground italic mb-0">$1</p></blockquote>')
      // 段落
      .replace(/\n\n/gim, '</p><p class="mb-4 text-foreground leading-relaxed">')
  }

  const processedContent = `<p class="mb-4 text-foreground leading-relaxed">${processContent(content)}</p>`

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
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}

// 同步版本的 Markdown 渲染器（用于客户端组件）
export function MarkdownRendererSync({ content, className }: MarkdownRendererProps) {
  return <MarkdownRenderer content={content} className={className} />
}