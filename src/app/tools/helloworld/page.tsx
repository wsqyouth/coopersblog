/**
 * HelloWorld 示例工具页面
 */

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hello World - 工具示例',
  description: '简单的 Hello World 示例工具，演示工具页面的基础结构',
}

export default function HelloWorldPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              首页
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/tools" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              工具
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700 dark:text-gray-300" aria-current="page">
            Hello World
          </li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* 工具标题和描述 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <span className="text-5xl mr-3">👋</span>
            Hello World
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            一个简单的示例工具，展示工具页面的基础结构和交互功能
          </p>
        </div>

        {/* 工具主体内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Hello, World!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                欢迎使用 Cooper's Blog 工具集合
              </p>
            </div>

            {/* 示例功能区域 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                功能演示
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">⏰</div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    当前时间
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300" id="current-time">
                    {new Date().toLocaleString('zh-CN')}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">🎲</div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    随机数
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.floor(Math.random() * 1000)}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">🌈</div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    随机颜色
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)` }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      HSL 随机颜色
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">💻</div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    用户代理
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* 交互按钮 */}
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => alert('Hello World!')}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                打招呼
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                刷新页面
              </button>
              <Link 
                href="/tools"
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                返回工具列表
              </Link>
            </div>
          </div>
        </div>

        {/* 工具说明 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 关于这个工具
          </h3>
          <div className="text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              • 这是一个简单的示例工具，展示了工具页面的基本结构
            </p>
            <p>
              • 包含工具标题、描述、功能区域和交互元素
            </p>
            <p>
              • 支持响应式设计，在不同设备上都能良好显示
            </p>
            <p>
              • 集成了暗黑模式支持，提供更好的用户体验
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}