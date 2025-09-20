import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCategories, getPostsByCategory } from '@/lib/blog-data'
import { PostGrid, CategoryStatsCard } from '@/components/blog'
import { Breadcrumb } from '@/components/layout/Navigation'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  // 在开发模式下不预生成静态参数，支持动态路由
  if (process.env.NODE_ENV === 'development') {
    return []
  }
  
  try {
    const categories = await getAllCategories()
    
    const params = categories.map((category) => ({
      category: category.slug,
    }))
    
    // 如果没有分类，返回默认路径
    if (params.length === 0) {
      return [
        { category: 'thinking' },
        { category: 'tech' },
        { category: 'life' },
        { category: 'diary' }
      ]
    }
    
    return params
  } catch (error) {
    console.error('Error in generateStaticParams for categories:', error)
    return [
      { category: 'thinking' },
      { category: 'tech' },
      { category: 'life' },
      { category: 'diary' }
    ]
  }
}

// 启用动态路由段的静态生成
export const dynamicParams = true

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const categories = await getAllCategories()
  const category = categories.find(cat => cat.slug === categorySlug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - 分类`,
    description: category.description || `浏览 ${category.name} 分类下的所有文章`,
  }
}

async function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const [categories, posts] = await Promise.all([
    getAllCategories(),
    getPostsByCategory(categorySlug)
  ])
  
  const category = categories.find(cat => cat.slug === categorySlug)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* 面包屑导航 */}
      <Breadcrumb 
        items={[
          { title: '分类', href: '/categories' },
          { title: category.name }
        ]} 
      />

      <div className="grid gap-8 lg:grid-cols-4">
        {/* 主内容区 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 页面标题 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {category.icon && (
                <span className="text-3xl" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
              )}
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            {category.description && (
              <p className="text-muted-foreground text-lg">
                {category.description}
              </p>
            )}
          </div>

          {/* 文章数量统计 */}
          <div className="text-sm text-muted-foreground">
            共找到 {posts.length} 篇文章
          </div>

          {/* 文章列表 */}
          {posts.length > 0 ? (
            <PostGrid posts={posts} />
          ) : (
            <div className="text-center py-12">
              <div className="space-y-3">
                <div className="text-4xl">📝</div>
                <h3 className="text-lg font-semibold">该分类下暂无文章</h3>
                <p className="text-muted-foreground">
                  敬请期待更多 {category.name} 相关内容
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          <CategoryStatsCard category={category} />
          
          {/* 其他分类 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">其他分类</h3>
            <div className="space-y-2">
              {categories
                .filter(cat => cat.slug !== categorySlug)
                .slice(0, 5)
                .map(cat => (
                  <a
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {cat.icon && (
                        <span className="text-lg">{cat.icon}</span>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cat.postCount || 0} 篇文章
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-4 bg-muted rounded w-40" />
      
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="h-8 bg-muted rounded w-48" />
            </div>
            <div className="h-5 bg-muted rounded w-96" />
          </div>
          
          <div className="h-4 bg-muted rounded w-32" />
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="space-y-4 p-6 border rounded-lg">
                <div className="h-48 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryContent categorySlug={category} />
      </Suspense>
    </div>
  )
}