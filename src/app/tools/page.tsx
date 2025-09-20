'use client'

/**
 * 工具首页
 */

import React from 'react'
import ToolCard from '@/components/tools/ToolCard'

// 工具数据配置
const toolsData = [
  {
    id: 'helloworld',
    title: 'Hello World',
    description: '简单的 Hello World 示例工具',
    category: 'demo',
    icon: '👋',
    href: '/tools/helloworld',
    tags: ['示例', '演示'],
    featured: false,
  },
  {
    id: 'markdown-preview',
    title: 'Markdown 预览器',
    description: '实时预览 Markdown 文档，支持多种主题和导出格式',
    category: 'text',
    icon: '📝',
    href: '/tools/markdown-preview',
    tags: ['Markdown', '预览', '编辑器', '文档'],
    featured: true,
  },
]

// 工具分类配置
const categories = [
  { id: 'all', name: '全部工具', icon: '🔧' },
  { id: 'demo', name: '示例工具', icon: '👋' },
  { id: 'text', name: '文本处理', icon: '📝' },
  { id: 'dev', name: '开发工具', icon: '💻' },
  { id: 'converter', name: '格式转换', icon: '🔄' },
  { id: 'generator', name: '生成器', icon: '⚡' },
]

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  // 筛选工具
  const filteredTools = React.useMemo(() => {
    let filtered = toolsData

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory)
    }

    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tool =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  // 推荐工具
  const featuredTools = toolsData.filter(tool => tool.featured)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          实用工具集合
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          精选的在线工具集合，涵盖开发、文本处理、格式转换等多个领域，助力提升工作效率
        </p>
      </div>

      {/* 推荐工具 */}
      {featuredTools.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-2">⭐</span>
            推荐工具
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} featured />
            ))}
          </div>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="mb-8">
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 工具列表 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            所有工具
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredTools.length} 个工具)
            </span>
          </h2>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              没有找到相关工具
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              尝试修改搜索关键词或选择其他分类
            </p>
          </div>
        )}
      </div>

      {/* 工具开发计划 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🚀 即将推出
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • JSON 格式化工具
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • 颜色选择器
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • Base64 编码解码
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • URL 编码解码
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • 二维码生成器
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            • 时间戳转换
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          更多实用工具正在开发中，敬请期待...
        </p>
      </div>
    </div>
  )
}