import { Suspense } from 'react'
import { Metadata } from 'next'
import { getAllCategories } from '@/lib/blog-data'
import { CategoryGrid } from '@/components/blog'
import { Breadcrumb } from '@/components/layout/Navigation'

export const metadata: Metadata = {
  title: '文章分类',
  description: '浏览所有文章分类，快速找到您感兴趣的内容。',
}

async function CategoriesContent() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="space-y-4">
        <Breadcrumb items={[{ title: '分类' }]} />
        <div>
          <h1 className="text-3xl font-bold">文章分类</h1>
          <p className="text-muted-foreground mt-2">
            浏览 {categories.length} 个分类，快速找到您感兴趣的内容
          </p>
        </div>
      </div>

      {/* 分类网格 */}
      <CategoryGrid categories={categories} />
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-20" />
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded" />
              <div className="h-6 bg-muted rounded w-24" />
            </div>
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-8 bg-muted rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </div>
  )
}