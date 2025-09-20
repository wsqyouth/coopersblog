/**
 * 工具卡片组件
 */

import React from 'react'
import Link from 'next/link'

export interface ToolInfo {
  id: string
  title: string
  description: string
  category: string
  icon: string
  href: string
  tags: string[]
  featured?: boolean
}

interface ToolCardProps {
  tool: ToolInfo
  featured?: boolean
}

export default function ToolCard({ tool, featured = false }: ToolCardProps) {
  return (
    <Link href={tool.href} className="group block">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 h-full border ${
        featured 
          ? 'border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900' 
          : 'border-gray-200 dark:border-gray-700'
      } group-hover:border-blue-300 dark:group-hover:border-blue-600`}>
        
        {/* 工具图标和标题 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="text-3xl mr-3 group-hover:scale-110 transition-transform duration-200">
              {tool.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>
              {featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mt-1">
                  ⭐ 推荐
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 工具描述 */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {tool.description}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* 使用按钮 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {getCategoryName(tool.category)}
          </span>
          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            使用工具
            <svg 
              className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

// 获取分类中文名
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    demo: '示例',
    text: '文本处理',
    dev: '开发工具',
    converter: '格式转换',
    generator: '生成器',
  }
  return categoryMap[category] || category
}