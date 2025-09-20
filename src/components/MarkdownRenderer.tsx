import { cn } from '@/lib/utils'
import { isImageFile, generateImageHTML } from '@/lib/image-utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 改进版本的 Markdown 渲染器
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // 改进的 Markdown 转换，正确处理列表
  const processContent = (text: string) => {
    // 1. 先处理代码块（避免其内容被后续正则处理）
    let processed = text.replace(/```(\w+)?\n?([\s\S]*?)```/gim, (match, language, code) => {
      const languageLabel = language ? `<div class="text-xs text-muted-foreground mb-2 font-mono">${language}</div>` : ''
      return `<div class="my-6 rounded-lg border border-border overflow-hidden">
        <div class="bg-muted/50 px-4 py-2 border-b border-border">
          ${languageLabel || '<div class="text-xs text-muted-foreground font-mono">代码</div>'}
        </div>
        <pre class="bg-muted/30 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code class="text-foreground">${code.trim()}</code>
        </pre>
      </div>`
    })
    
    // 2. 行内代码
    processed = processed.replace(/`([^`]+)`/gim, '<code class="bg-muted/60 px-2 py-1 rounded text-sm font-mono text-foreground border">$1</code>')
    
    // 3. 处理列表（在处理粗体之前）
    processed = processed.replace(/((?:^- .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(line => {
        const content = line.replace(/^- /, '')
        return `<li class="mb-2 text-foreground flex items-start"><span class="mr-2">•</span><span>${content}</span></li>`
      }).join('')
      return `<ul class="mb-4 space-y-1">${items}</ul>`
    })
    
    // 处理有序列表
    processed = processed.replace(/((?:^\d+\. .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(line => {
        const content = line.replace(/^\d+\. /, '')
        return `<li class="mb-2 text-foreground">${content}</li>`
      }).join('')
      return `<ol class="mb-4 ml-6 space-y-1 list-decimal">${items}</ol>`
    })
    
    // 4. 标题
    processed = processed.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-4 mt-6 text-foreground">$1</h3>')
    processed = processed.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-foreground">$1</h2>')
    processed = processed.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 text-foreground">$1</h1>')
    
    // 5. 粗体和斜体（使用非贪婪匹配）
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    processed = processed.replace(/\*([^*\n]*?)\*/g, '<em class="italic text-foreground">$1</em>')
    
    // 6. 链接和图片处理
    processed = processed.replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, (match, text, url) => {
      if (isImageFile(url)) {
        return generateImageHTML(url, text)
      }
      return match
    })
    processed = processed.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, (match, text, url) => {
      return `<a href="${url}" class="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">${text}</a>`
    })
    
    // 7. 引用
    processed = processed.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary bg-muted/30 pl-6 pr-4 py-3 my-4 rounded-r-lg"><p class="text-muted-foreground italic mb-0">$1</p></blockquote>')
    
    // 8. 段落处理（最后进行）
    processed = processed.replace(/\n\n/gim, '</p><p class="mb-4 text-foreground leading-relaxed">')
    
    return processed
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

// 默认导出
export default MarkdownRenderer