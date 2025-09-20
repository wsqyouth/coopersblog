/**
 * 开发工具分类页面
 */

import Link from 'next/link'

export default function DevToolsPage() {
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
            开发工具
          </li>
        </ol>
      </nav>

      <div className="max-w-2xl mx-auto text-center">
        {/* Coming Soon 内容 */}
        <div className="mb-8">
          <div className="text-8xl mb-6">🛠️</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            开发工具
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            即将推出强大的开发工具集合
          </p>
        </div>

        {/* Coming Soon 状态 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8 mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            我们正在努力开发一系列实用的开发工具，包括：
          </p>
          
          {/* 即将推出的功能列表 */}
          <div className="grid gap-3 md:grid-cols-2 text-left max-w-md mx-auto">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🔧</span>
              JSON 格式化工具
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🎨</span>
              正则表达式测试
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🔍</span>
              代码美化工具
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">⚡</span>
              API 测试工具
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">📱</span>
              响应式测试
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🌈</span>
              颜色选择器
            </div>
          </div>
        </div>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/tools"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            浏览其他工具
          </Link>
          <Link 
            href="/tools/markdown-preview"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            试试 Markdown 编辑器
          </Link>
        </div>

        {/* 进度提示 */}
        <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="flex items-center justify-center text-amber-800 dark:text-amber-200">
            <span className="mr-2">💡</span>
            <span className="text-sm">
              开发进度：规划设计阶段 → 即将开始开发
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}