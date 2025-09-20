/**
 * 导航配置文件
 */

import type { NavLink, Breadcrumb } from '@/types/common'
import { getNavCategories } from './categories'

/** 动态生成分类导航 */
function generateCategoryNavLinks(): NavLink[] {
  const categories = getNavCategories()
  return [
    {
      title: '所有文章',
      href: '/posts',
    },
    ...categories.map(category => ({
      title: category.name,
      href: `/categories/${category.slug}`,
    }))
  ]
}

/** 主导航菜单配置 */
const mainNavigation: NavLink[] = [
  {
    title: '首页',
    href: '/',
    icon: '🏠',
  },
  {
    title: '文章',
    href: '/posts',
    icon: '📝',
    children: generateCategoryNavLinks(),
  },
  {
    title: '分类',
    href: '/categories',
    icon: '📁',
  },
  {
    title: '标签',
    href: '/tags',
    icon: '🏷️',
  },
  {
    title: '工具',
    href: '/tools',
    icon: '🔧',
    children: [
      {
        title: '所有工具',
        href: '/tools',
      },
      {
        title: '开发工具',
        href: '/tools/dev',
      },
      {
        title: '文本处理',
        href: '/tools/text',
      },
      {
        title: '格式转换',
        href: '/tools/converter',
      },
      {
        title: '生成器',
        href: '/tools/generator',
      },
      {
        title: 'Markdown 预览器',
        href: '/tools/markdown-preview',
      },
    ],
  },
  {
    title: '关于',
    href: '/about',
    icon: '👨‍💻',
  },
]

/** 底部导航配置 */
export const footerNavigation: NavLink[] = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '文章',
    href: '/posts',
  },
  {
    title: '分类',
    href: '/categories',
  },
  {
    title: '标签',
    href: '/tags',
  },
  {
    title: '工具',
    href: '/tools',
  },
  {
    title: '关于',
    href: '/about',
  },
  {
    title: '隐私政策',
    href: '/privacy',
  },
  {
    title: '使用条款',
    href: '/terms',
  },
]

/** 社交媒体导航 */
export const socialNavigation: NavLink[] = [
  {
    title: 'GitHub',
    href: 'https://github.com/cooper',
    icon: '💻',
    external: true,
  },
  {
    title: 'Twitter',
    href: 'https://twitter.com/cooper',
    icon: '🐦',
    external: true,
  },
  {
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/cooper',
    icon: '💼',
    external: true,
  },
  {
    title: 'Email',
    href: 'mailto:cooper@example.com',
    icon: '📧',
    external: true,
  },
]

/** 侧边栏导航配置 */
export const sidebarNavigation: NavLink[] = [
  {
    title: '最新文章',
    href: '/posts?sort=date&order=desc',
    icon: '📰',
  },
  {
    title: '热门文章',
    href: '/posts?sort=views&order=desc',
    icon: '🔥',
  },
  {
    title: '推荐阅读',
    href: '/posts?featured=true',
    icon: '⭐',
  },
  {
    title: '归档',
    href: '/archive',
    icon: '📚',
  },
  {
    title: '统计',
    href: '/stats',
    icon: '📊',
  },
]

/** 管理员导航配置 */
export const adminNavigation: NavLink[] = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: '📊',
  },
  {
    title: '文章管理',
    href: '/admin/posts',
    icon: '📝',
  },
  {
    title: '分类管理',
    href: '/admin/categories',
    icon: '📁',
  },
  {
    title: '标签管理',
    href: '/admin/tags',
    icon: '🏷️',
  },
  {
    title: '工具管理',
    href: '/admin/tools',
    icon: '🔧',
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: '⚙️',
  },
]

/** 移动端导航配置（精简版） */
export const mobileNavigation: NavLink[] = [
  {
    title: '首页',
    href: '/',
    icon: '🏠',
  },
  {
    title: '文章',
    href: '/posts',
    icon: '📝',
  },
  {
    title: '分类',
    href: '/categories',
    icon: '📁',
  },
  {
    title: '工具',
    href: '/tools',
    icon: '🔧',
  },
  {
    title: '关于',
    href: '/about',
    icon: '👨‍💻',
  },
]

/** 面包屑导航配置函数 */
export const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Breadcrumb[] = [
    { title: '首页', href: '/', current: false },
  ]

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    let title = segment

    // 根据路径段生成面包屑标题
    switch (segment) {
      case 'posts':
        title = '文章'
        break
      case 'categories':
        title = '分类'
        break
      case 'tags':
        title = '标签'
        break
      case 'tools':
        title = '工具'
        break
      case 'about':
        title = '关于'
        break
      case 'dev':
        title = '开发工具'
        break
      case 'text':
        title = '文本处理'
        break
      case 'converter':
        title = '格式转换'
        break
      case 'generator':
        title = '生成器'
        break
      case 'markdown-preview':
        title = 'Markdown 预览器'
        break
      default:
        // 尝试从分类配置中查找标题
        const categories = getNavCategories()
        const category = categories.find(c => c.slug === segment)
        if (category) {
          title = category.name
        } else {
          // 如果是文章 slug，尝试获取文章标题
          title = decodeURIComponent(segment)
        }
        break
    }

    breadcrumbs.push({
      title,
      href,
      current: index === segments.length - 1,
    })
  })

  return breadcrumbs
}

/** 导航工具函数 */
export const navigationUtils = {
  /** 检查路径是否激活 */
  isActive: (currentPath: string, linkPath: string) => {
    if (linkPath === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(linkPath)
  },

  /** 获取当前激活的导航项 */
  getActiveNavItem: (currentPath: string, navigation: NavLink[]) => {
    return navigation.find(item => 
      navigationUtils.isActive(currentPath, item.href)
    )
  },

  /** 扁平化导航树 */
  flattenNavigation: (navigation: NavLink[]): NavLink[] => {
    const flattened: NavLink[] = []
    
    const flatten = (items: NavLink[]) => {
      items.forEach(item => {
        flattened.push(item)
        if (item.children) {
          flatten(item.children)
        }
      })
    }
    
    flatten(navigation)
    return flattened
  },

  /** 根据权限过滤导航 */
  filterByPermission: (navigation: NavLink[], userPermissions: string[]) => {
    return navigation.filter(item => {
      // 这里可以添加权限检查逻辑
      return true
    })
  },
}

/** 导航配置对象 */
export const navigationConfig = {
  mainNav: mainNavigation,
  footerNav: footerNavigation,
  socialNav: socialNavigation,
  sidebarNav: sidebarNavigation,
  adminNav: adminNavigation,
  mobileNav: mobileNavigation,
}