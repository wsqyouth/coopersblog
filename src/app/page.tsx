import Link from 'next/link'
import { getAllPosts } from '@/lib/blog-data'

export default async function Home() {
  const allPosts = await getAllPosts()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Posts</h1>
      </div>

      {/* 文章列表 */}
      <div className="space-y-12">
        {allPosts.map((post) => (
          <article key={post.id} className="group space-y-3">
            <Link 
              href={`/posts/${post.slug}`}
              className="block"
            >
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <Link 
              href={`/posts/${post.slug}`}
              className="block"
            >
              <p className="text-muted-foreground leading-relaxed hover:text-foreground transition-colors">
                {post.excerpt}
              </p>
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime} 分钟</span>
              <span>·</span>
              <span>{post.wordCount?.toLocaleString()} 字</span>
              <span>·</span>
              <span>{post.author}</span>
              {post.category && (
                <>
                  <span>·</span>
                  <Link 
                    href={`/categories/${post.category.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.category.name}
                  </Link>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* 空状态 */}
      {allPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p>暂无文章</p>
          </div>
        </div>
      )}
    </div>
  )
}
