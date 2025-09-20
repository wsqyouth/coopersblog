import { Suspense } from 'react'
import { Metadata } from 'next'
import { getAllTags } from '@/lib/blog-data'
import { TagCloud, PopularTagList } from '@/components/blog'
import { Breadcrumb } from '@/components/layout/Navigation'

export const metadata: Metadata = {
  title: '文章标签',
  description: '浏览所有文章标签，探索不同主题的内容。',
}

async function TagsContent() {
  const tags = await getAllTags()

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumb items={[{ title: '标签' }]} />
        <div>
          <h1 className="text-3xl font-bold">文章标签</h1>
          <p className="text-muted-foreground mt-2">
            浏览 {tags.length} 个标签，探索不同主题的内容
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">标签云</h2>
            <div className="p-6 border rounded-lg">
              <TagCloud tags={tags} />
            </div>
          </div>
        </div>
        
        <div>
          <PopularTagList tags={tags} limit={15} />
        </div>
      </div>
    </div>
  )
}

export default function TagsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <TagsContent />
      </Suspense>
    </div>
  )
}