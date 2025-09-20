/**
 * 数据查询层 - 预留未来扩展
 * 
 * 此文件为数据查询层的入口文件，为未来可能的数据源扩展预留接口。
 * 当前使用本地文件系统作为数据源，未来可以扩展支持：
 * - CMS 系统（如 Strapi、Contentful）
 * - 数据库（如 MongoDB、PostgreSQL）
 * - API 服务
 * - GraphQL 端点
 */

import type { 
  BlogPost, 
  BlogCategory, 
  PostFilter, 
  PaginatedPosts, 
  BlogStats, 
  RelatedPost 
} from '@/types/blog'

// 当前使用本地文件系统实现
import * as fileSystemQueries from '../lib/blog-data'

/** 数据源接口定义 */
export interface DataSource {
  /** 获取所有文章 */
  getAllPosts(forceRefresh?: boolean): Promise<BlogPost[]>
  
  /** 根据 slug 获取文章 */
  getPostBySlug(slug: string): Promise<BlogPost | null>
  
  /** 根据 ID 获取文章 */
  getPostById(id: string): Promise<BlogPost | null>
  
  /** 获取分页文章列表 */
  getPaginatedPosts(filter?: PostFilter): Promise<PaginatedPosts>
  
  /** 获取分类列表 */
  getCategories(): Promise<Array<{ category: BlogCategory; count: number }>>
  
  /** 获取标签列表 */
  getTags(): Promise<Array<{ tag: string; count: number }>>
  
  /** 获取相关文章 */
  getRelatedPosts(postId: string, limit?: number): Promise<RelatedPost[]>
  
  /** 获取热门标签 */
  getPopularTags(limit?: number): Promise<string[]>
  
  /** 获取最新文章 */
  getRecentPosts(limit?: number): Promise<BlogPost[]>
  
  /** 获取置顶文章 */
  getPinnedPosts(): Promise<BlogPost[]>
  
  /** 获取归档数据 */
  getArchiveData(): Promise<Record<string, BlogPost[]>>
  
  /** 获取博客统计信息 */
  getBlogStats(): Promise<BlogStats>
  
  /** 搜索文章 */
  searchPosts(query: string, options?: { limit?: number; includeContent?: boolean }): Promise<BlogPost[]>
  
  /** 清除缓存 */
  clearCache(): void
}

/** 文件系统数据源实现 */
class FileSystemDataSource implements DataSource {
  async getAllPosts(forceRefresh?: boolean): Promise<BlogPost[]> {
    return fileSystemQueries.getAllPosts()
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return fileSystemQueries.getPostBySlug(slug)
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    // 通过 ID 查找文章，如果没有专门的函数，使用 slug
    return fileSystemQueries.getPostBySlug(id)
  }

  async getPaginatedPosts(filter?: PostFilter): Promise<PaginatedPosts> {
    const allPosts = await fileSystemQueries.getAllPosts()
    return {
      posts: allPosts,
      total: allPosts.length,
      page: 1,
      pageSize: allPosts.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  }

  async getCategories(): Promise<Array<{ category: BlogCategory; count: number }>> {
    const categories = await fileSystemQueries.getAllCategories()
    return categories.map(cat => ({
      category: cat.slug as BlogCategory,
      count: cat.postCount || 0
    }))
  }

  async getTags(): Promise<Array<{ tag: string; count: number }>> {
    const tags = await fileSystemQueries.getAllTags()
    return tags.map(tag => ({
      tag: tag.name,
      count: tag.postCount || 0
    }))
  }

  async getRelatedPosts(postId: string, limit?: number): Promise<RelatedPost[]> {
    const post = await fileSystemQueries.getPostBySlug(postId)
    if (!post) return []
    const posts = await fileSystemQueries.getPostsByCategory(post.category.slug)
    return posts
      .filter(p => p.id !== post.id)
      .slice(0, limit || 3)
      .map(p => ({
        id: p.id,
        title: p.title,
        category: p.category.slug as BlogCategory,
        date: p.date,
        description: p.excerpt,
        cover: p.coverImage,
        slug: p.slug
      }))
  }

  async getPopularTags(limit?: number): Promise<string[]> {
    const tags = await fileSystemQueries.getAllTags()
    return tags
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, limit || 10)
      .map(tag => tag.name)
  }

  async getRecentPosts(limit?: number): Promise<BlogPost[]> {
    const posts = await fileSystemQueries.getAllPosts()
    return posts.slice(0, limit || 5)
  }

  async getPinnedPosts(): Promise<BlogPost[]> {
    const posts = await fileSystemQueries.getAllPosts()
    return posts.filter(post => post.featured)
  }

  async getArchiveData(): Promise<Record<string, BlogPost[]>> {
    const posts = await fileSystemQueries.getAllPosts()
    const archive: Record<string, BlogPost[]> = {}
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString()
      if (!archive[year]) {
        archive[year] = []
      }
      archive[year].push(post)
    })
    return archive
  }

  async getBlogStats(): Promise<BlogStats> {
    const posts = await fileSystemQueries.getAllPosts()
    const categories = await fileSystemQueries.getAllCategories()
    const tags = await fileSystemQueries.getAllTags()
    
    const categoryCounts: Record<string, number> = {}
    categories.forEach(cat => {
      categoryCounts[cat.slug] = cat.postCount || 0
    })
    
    const tagCounts: Record<string, number> = {}
    tags.forEach(tag => {
      tagCounts[tag.name] = tag.postCount || 0
    })
    
    return {
      totalPosts: posts.length,
      categoryCounts,
      tagCounts,
      lastUpdated: new Date().toISOString()
    }
  }

  async searchPosts(
    query: string, 
    options?: { limit?: number; includeContent?: boolean }
  ): Promise<BlogPost[]> {
    const allPosts = await fileSystemQueries.getAllPosts()
    const filteredPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
      (options?.includeContent && post.content.toLowerCase().includes(query.toLowerCase()))
    )
    return options?.limit ? filteredPosts.slice(0, options.limit) : filteredPosts
  }

  clearCache(): void {
    fileSystemQueries.clearPostsCache()
  }
}

/** 数据源配置 */
export interface DataSourceConfig {
  type: 'filesystem' | 'cms' | 'database' | 'api'
  options?: Record<string, any>
}

/** 数据源工厂 */
export class DataSourceFactory {
  static create(config: DataSourceConfig): DataSource {
    switch (config.type) {
      case 'filesystem':
        return new FileSystemDataSource()
      
      case 'cms':
        // TODO: 实现 CMS 数据源
        throw new Error('CMS data source not implemented yet')
      
      case 'database':
        // TODO: 实现数据库数据源
        throw new Error('Database data source not implemented yet')
      
      case 'api':
        // TODO: 实现 API 数据源
        throw new Error('API data source not implemented yet')
      
      default:
        throw new Error(`Unsupported data source type: ${config.type}`)
    }
  }
}

/** 默认数据源配置 */
const defaultDataSourceConfig: DataSourceConfig = {
  type: 'filesystem',
}

/** 当前数据源实例 */
let currentDataSource: DataSource = DataSourceFactory.create(defaultDataSourceConfig)

/** 查询接口 - 统一的数据访问层 */
export const queries = {
  /** 配置数据源 */
  configure(config: DataSourceConfig): void {
    currentDataSource = DataSourceFactory.create(config)
  },

  /** 获取当前数据源 */
  getDataSource(): DataSource {
    return currentDataSource
  },

  /** 获取所有文章 */
  getAllPosts(forceRefresh?: boolean): Promise<BlogPost[]> {
    return currentDataSource.getAllPosts(forceRefresh)
  },

  /** 根据 slug 获取文章 */
  getPostBySlug(slug: string): Promise<BlogPost | null> {
    return currentDataSource.getPostBySlug(slug)
  },

  /** 根据 ID 获取文章 */
  getPostById(id: string): Promise<BlogPost | null> {
    return currentDataSource.getPostById(id)
  },

  /** 获取分页文章列表 */
  getPaginatedPosts(filter?: PostFilter): Promise<PaginatedPosts> {
    return currentDataSource.getPaginatedPosts(filter)
  },

  /** 获取分类列表 */
  getCategories(): Promise<Array<{ category: BlogCategory; count: number }>> {
    return currentDataSource.getCategories()
  },

  /** 获取标签列表 */
  getTags(): Promise<Array<{ tag: string; count: number }>> {
    return currentDataSource.getTags()
  },

  /** 获取相关文章 */
  getRelatedPosts(postId: string, limit?: number): Promise<RelatedPost[]> {
    return currentDataSource.getRelatedPosts(postId, limit)
  },

  /** 获取热门标签 */
  getPopularTags(limit?: number): Promise<string[]> {
    return currentDataSource.getPopularTags(limit)
  },

  /** 获取最新文章 */
  getRecentPosts(limit?: number): Promise<BlogPost[]> {
    return currentDataSource.getRecentPosts(limit)
  },

  /** 获取置顶文章 */
  getPinnedPosts(): Promise<BlogPost[]> {
    return currentDataSource.getPinnedPosts()
  },

  /** 获取归档数据 */
  getArchiveData(): Promise<Record<string, BlogPost[]>> {
    return currentDataSource.getArchiveData()
  },

  /** 获取博客统计信息 */
  getBlogStats(): Promise<BlogStats> {
    return currentDataSource.getBlogStats()
  },

  /** 搜索文章 */
  searchPosts(
    query: string, 
    options?: { limit?: number; includeContent?: boolean }
  ): Promise<BlogPost[]> {
    return currentDataSource.searchPosts(query, options)
  },

  /** 清除缓存 */
  clearCache(): void {
    currentDataSource.clearCache()
  },
}

// 默认导出查询接口
export default queries

// 导出数据源类和接口
export { FileSystemDataSource }