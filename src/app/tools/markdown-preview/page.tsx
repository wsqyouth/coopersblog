'use client'

/**
 * Markdown 预览工具页面
 */

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function MarkdownPreviewPage() {
  const [markdownContent, setMarkdownContent] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [editorTheme, setEditorTheme] = useState('light')
  const [previewTheme, setPreviewTheme] = useState('default')
  const [codeTheme, setCodeTheme] = useState('default')
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // 默认内容
  const defaultContent = `# Markdown 预览器

这是一个功能强大的 **Markdown 预览工具**，支持实时预览和多种主题。

## 功能特性

- ✅ 实时预览 Markdown 内容
- ✅ 支持多种编辑器主题（明亮/暗黑）
- ✅ 支持多种预览主题（默认/极客）
- ✅ 支持代码高亮
- ✅ 支持数学公式
- ✅ 支持表格和列表
- ✅ 移动端适配
- ✅ 全屏编辑模式

## 语法示例

### 文本格式

**粗体文本** 和 *斜体文本* 以及 ~~删除线~~

### 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 列表

1. 有序列表项 1
2. 有序列表项 2
   - 无序子项
   - 另一个子项

### 表格

| 名称 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25   | 工程师 |
| 李四 | 30   | 设计师 |

### 引用

> 这是一个引用块，用于展示重要信息或引用内容。

### 链接和图片

[访问 GitHub](https://github.com)

![示例图片](https://via.placeholder.com/400x200?text=示例图片)

开始编辑左侧的 Markdown 内容，右侧会实时显示预览效果！`

  // 初始化
  useEffect(() => {
    setMarkdownContent(defaultContent)
  }, [])

  // 转换Markdown为HTML的简单实现
  const convertMarkdownToHtml = (markdown: string) => {
    let html = markdown
      // 标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // 图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // 列表（简化处理）
      .replace(/^\d+\.\s+(.+)$/gim, '<li>$1</li>')
      .replace(/^-\s+(.+)$/gim, '<li>$1</li>')
      // 引用
      .replace(/^>\s+(.+)$/gim, '<blockquote>$1</blockquote>')
      // 换行
      .replace(/\n/g, '<br>')
      
    // 包装列表项
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    
    return html
  }

  // 更新预览
  useEffect(() => {
    const html = convertMarkdownToHtml(markdownContent)
    setPreviewHtml(html)
  }, [markdownContent])

  // 处理文件导入
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdownContent(content)
      }
      reader.readAsText(file)
    }
  }

  // 导出Markdown
  const exportMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document_${new Date().getTime()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导出HTML
  const exportHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <style>
        body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: -apple-system, sans-serif; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    ${previewHtml}
</body>
</html>`
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document_${new Date().getTime()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 处理Tab键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      setMarkdownContent(newValue)
      
      // 设置光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 面包屑导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <nav className="flex max-w-7xl mx-auto" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                首页
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/tools" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                工具
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 dark:text-gray-300">Markdown 预览器</li>
          </ol>
        </nav>
      </div>

      {/* 工具栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 文件操作 */}
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleFileImport}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded cursor-pointer"
              >
                导入
              </label>
              <button
                onClick={exportMarkdown}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                导出 MD
              </button>
              <button
                onClick={exportHtml}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                导出 HTML
              </button>
            </div>

            {/* 主题切换 */}
            <div className="flex items-center space-x-2">
              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="light">编辑器: 明亮</option>
                <option value="dark">编辑器: 暗黑</option>
              </select>
              <select
                value={previewTheme}
                onChange={(e) => setPreviewTheme(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="default">预览: 默认</option>
                <option value="geek">预览: 极客</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 预览模式 */}
            <div className="flex border rounded">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1 text-sm ${previewMode === 'desktop' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}`}
              >
                🖥️
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 text-sm ${previewMode === 'mobile' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}`}
              >
                📱
              </button>
            </div>

            {/* 全屏按钮 */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isFullscreen ? '退出全屏' : '全屏'}
            </button>
          </div>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div className={`flex h-[calc(100vh-120px)] ${isFullscreen ? 'h-screen fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
        {/* 编辑器 */}
        <div className={`${isFullscreen ? 'w-full' : 'w-1/2'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown 编辑器</h3>
          </div>
          <textarea
            ref={editorRef}
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="在这里输入 Markdown 内容..."
            className={`flex-1 p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed ${
              editorTheme === 'dark' 
                ? 'bg-gray-900 text-gray-100' 
                : 'bg-white text-gray-900'
            }`}
          />
        </div>

        {/* 预览区域 */}
        {!isFullscreen && (
          <div className="w-1/2 flex flex-col">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">预览</h3>
            </div>
            <div className={`flex-1 overflow-auto ${
              previewMode === 'mobile' ? 'bg-gray-100 dark:bg-gray-800 p-4 flex justify-center' : ''
            }`}>
              <div 
                className={`h-full p-6 ${
                  previewMode === 'mobile' 
                    ? 'max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-lg' 
                    : 'bg-white dark:bg-gray-900'
                } ${
                  previewTheme === 'geek' 
                    ? 'markdown-preview-geek' 
                    : 'markdown-preview-default'
                }`}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 样式 */}
      <style jsx global>{`
        .markdown-preview-default h1 { font-size: 2rem; font-weight: bold; margin: 1rem 0; color: #1a202c; }
        .markdown-preview-default h2 { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #2d3748; }
        .markdown-preview-default h3 { font-size: 1.25rem; font-weight: bold; margin: 1rem 0; color: #4a5568; }
        .markdown-preview-default p { margin: 0.5rem 0; line-height: 1.6; }
        .markdown-preview-default code { background: #f7fafc; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: 'Courier New', monospace; }
        .markdown-preview-default pre { background: #f7fafc; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
        .markdown-preview-default pre code { background: none; padding: 0; }
        .markdown-preview-default blockquote { border-left: 4px solid #e2e8f0; margin: 1rem 0; padding-left: 1rem; color: #718096; }
        .markdown-preview-default ul, .markdown-preview-default ol { margin: 1rem 0; padding-left: 2rem; }
        .markdown-preview-default li { margin: 0.25rem 0; }
        .markdown-preview-default a { color: #3182ce; text-decoration: underline; }
        .markdown-preview-default img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
        .markdown-preview-default strong { font-weight: bold; }
        .markdown-preview-default em { font-style: italic; }
        .markdown-preview-default del { text-decoration: line-through; }

        .markdown-preview-geek { background: #0d1117; color: #c9d1d9; }
        .markdown-preview-geek h1 { font-size: 2rem; font-weight: bold; margin: 1rem 0; color: #58a6ff; }
        .markdown-preview-geek h2 { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #7dd3fc; }
        .markdown-preview-geek h3 { font-size: 1.25rem; font-weight: bold; margin: 1rem 0; color: #86efac; }
        .markdown-preview-geek p { margin: 0.5rem 0; line-height: 1.6; }
        .markdown-preview-geek code { background: #161b22; color: #f85149; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: 'Courier New', monospace; }
        .markdown-preview-geek pre { background: #161b22; border: 1px solid #30363d; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
        .markdown-preview-geek pre code { background: none; padding: 0; color: #c9d1d9; }
        .markdown-preview-geek blockquote { border-left: 4px solid #58a6ff; margin: 1rem 0; padding-left: 1rem; color: #8b949e; }
        .markdown-preview-geek ul, .markdown-preview-geek ol { margin: 1rem 0; padding-left: 2rem; }
        .markdown-preview-geek li { margin: 0.25rem 0; }
        .markdown-preview-geek a { color: #58a6ff; text-decoration: underline; }
        .markdown-preview-geek img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
        .markdown-preview-geek strong { font-weight: bold; color: #f0f6fc; }
        .markdown-preview-geek em { font-style: italic; }
        .markdown-preview-geek del { text-decoration: line-through; opacity: 0.6; }
      `}</style>
    </div>
  )
}