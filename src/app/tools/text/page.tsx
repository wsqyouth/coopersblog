/**
 * 文本处理工具分类页面
 */

import Link from 'next/link'

export default function TextToolsPage() {
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
            文本处理
          </li>
        </ol>
      </nav>

      <div className="max-w-2xl mx-auto text-center">
        {/* Coming Soon 内容 */}
        <div className="mb-8">
          <div className="text-8xl mb-6">📝</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            文本处理工具
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            强大的文本处理和编辑工具即将上线
          </p>
        </div>

        {/* Coming Soon 状态 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-8 mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            我们正在开发一系列强大的文本处理工具，让您的文本编辑更加高效：
          </p>
          
          {/* 即将推出的功能列表 */}
          <div className="grid gap-3 md:grid-cols-2 text-left max-w-md mx-auto">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">📄</span>
              文本格式转换
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🔤</span>
              大小写转换
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">📊</span>
              字符统计工具
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🧹</span>
              文本清理工具
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">🔍</span>
              文本查找替换
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">📋</span>
              文本合并分割
            </div>
          </div>
        </div>

        {/* 推荐现有工具 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 现在就可以使用
          </h3>
          <div className="space-y-3">
            <Link 
              href="/tools/markdown-preview"
              className="block p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📝</span>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">Markdown 预览器</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">实时编辑和预览 Markdown 文档</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/tools"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            浏览其他工具
          </Link>
          <Link 
            href="/tools/markdown-preview"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            立即使用 Markdown 编辑器
          </Link>
        </div>

        {/* 进度提示 */}
        <div className="mt-12 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center justify-center text-green-800 dark:text-green-200">
            <span className="mr-2">🎯</span>
            <span className="text-sm">
              开发进度：需求分析完成 → 即将进入开发阶段
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}