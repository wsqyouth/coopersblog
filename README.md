# Cooper's Blog

基于 Next.js 15 + React 19 + Ant Design 5.x 技术栈的个人博客网站，采用 JAMstack 架构模式，支持 Markdown 文章渲染、工具集成和全球化访问。

## ✨ 特性

- 📝 **Markdown 文章渲染** - 支持 Front Matter 元数据和丰富的 Markdown 语法
- 🏷️ **分类标签系统** - 便于内容组织和快速筛选
- 🌙 **主题切换** - 支持明暗主题无缝切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔧 **工具页面** - 集成实用的开发工具
- ⚡ **静态生成** - 极致性能，CDN 友好
- 🔒 **安全可靠** - 零外部依赖，纯静态网站架构

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
# 或者
yarn build
# 或者
pnpm build
```

## 📁 项目结构

```
cooper-blog/
├── posts/                    # 📝 Markdown 文章目录
│   ├── thinking/            # 思考笔记分类
│   ├── tech/                # 技术分类
│   ├── life/                # 生活分类
│   └── diary/               # 日记分类
├── public/                  # 🖼️ 静态资源
│   └── images/              # 图片资源
├── src/                     # 💻 源代码
│   ├── app/                 # 📄 Next.js App Router 页面
│   ├── components/          # 🧩 可复用组件
│   ├── lib/                 # 📚 工具库
│   ├── types/               # 📝 TypeScript 类型定义
│   ├── config/              # ⚙️ 配置文件
│   ├── hooks/               # 🎣 自定义 Hooks
│   └── styles/              # 🎨 样式文件
└── docs/                    # 📖 项目文档
```

## 🛠️ 技术栈

- **框架**: Next.js 15.5.3
- **UI 库**: React 19.1.0
- **类型**: TypeScript 5.x
- **组件库**: Ant Design 5.x
- **样式**: Tailwind CSS 4.x
- **Markdown**: react-markdown + remark/rehype
- **部署**: Vercel + Cloudflare CDN

## 📝 内容管理指南

### 🔥 添加新分类（运营必读）

这是本系统的核心特性！您可以通过简单的配置添加新分类：

**第一步**: 编辑 `src/config/categories.ts`

```typescript
export const categoryMap: Record<string, CategoryConfig> = {
  // 现有分类...
  
  // 🎯 添加新分类 - 只需要这几行！
  '学习笔记': {
    name: '学习笔记',           // 显示名称
    slug: 'learning-notes',    // URL路径 (英文)
    description: '知识学习与总结', // 描述
    icon: '📚',                // 图标
    color: '#52c41a',          // 颜色
    showInNav: true,           // 是否显示在导航中
    order: 6                   // 排序权重
  },
  
  '产品思考': {
    name: '产品思考',
    slug: 'product-thinking',
    description: '产品设计与思考',
    icon: '💡',
    color: '#722ed1',
    showInNav: true,
    order: 7
  },
  
  '工作复盘': {
    name: '工作复盘', 
    slug: 'work-review',
    description: '工作经验总结',
    icon: '🔄',
    color: '#fa8c16',
    showInNav: true,
    order: 8
  }
}
```

**第二步**: 在文章中使用

```markdown
---
title: 我的学习心得
category: 学习笔记  # 直接使用中文名称
tags: ['学习', '总结']
---

# 文章内容...
```

**第三步**: 系统自动生效！

- ✅ 导航菜单自动增加新分类选项
- ✅ 分类页面自动生成 `/categories/learning-notes`
- ✅ 面包屑导航自动识别
- ✅ 文章统计自动更新

### 💡 高级配置技巧

```typescript
// 支持多种配置方式
'学习笔记': { name: '学习笔记', slug: 'learning-notes' },        // 中文key
'learning-notes': { name: '学习笔记', slug: 'learning-notes' }, // 英文key

// 在markdown中都可以使用
---
category: 学习笔记      # ✅ 使用中文名
# 或
category: learning-notes # ✅ 使用英文slug
---
```

### 📝 创建新文章

#### 文件系统架构

所有文章都存放在 `posts/` 目录下，支持任意层级的子目录组织：

```
posts/
├── hello-world.md          # 根目录文章
├── next-js-best-practices.md
├── react-19-features.md
├── tech/                   # 技术分类目录
│   └── advanced-react.md
├── thinking/               # 思考笔记目录
│   └── 2025-01-welcome.md
└── project-review/         # 项目复盘目录
    └── blog-project.md
```

#### 添加新文章步骤

1. **在 `posts/` 目录下创建 `.md` 文件**
   - 可以放在根目录：`posts/my-article.md`
   - 可以放在子目录：`posts/tech/my-tech-article.md`
   - 文件名将作为文章的 slug（URL路径）

2. **添加 Front Matter 元数据**：

```yaml
---
title: "文章标题"
excerpt: "文章摘要（可选，不填会自动提取）"
publishedAt: "2025-01-20"
category: 
  name: "技术分享"           # 使用 categories.ts 中配置的分类名
  slug: "tech"              # 分类 slug
  icon: "💻"               # 分类图标（可选）
tags: ["标签1", "标签2"]     # 支持字符串数组
author: "Cooper"
featured: true              # 可选，是否为精选文章
coverImage: "/images/posts/cover.jpg"  # 封面图片（可选）
wordCount: 1200            # 可选，会自动计算
readingTime: 6             # 可选，会自动计算
---
```

3. **使用 Markdown 语法编写内容**

#### 支持的 Front Matter 格式

系统支持两种标签格式：

```yaml
# 简单格式（推荐）
tags: ["React", "Next.js", "TypeScript"]

# 详细格式（兼容旧版本）
tags:
  - name: "React"
    slug: "react"
  - name: "Next.js" 
    slug: "nextjs"
```

#### 自动化功能

- ✅ **自动字数统计**: 智能计算中英文混合字数
- ✅ **自动阅读时间**: 基于200字/分钟计算
- ✅ **自动摘要提取**: 未提供摘要时自动从内容提取
- ✅ **图片路径修复**: 自动处理相对路径图片
- ✅ **分类映射**: 根据配置自动映射分类slug
- ✅ **标签处理**: 中文标签自动生成英文slug

### 🏷️ 标签系统扩展

标签系统是全自动的，但您可以预设常用标签的URL映射：

编辑 `src/lib/blog-data.ts` 中的 `generateTagSlug` 函数：

```typescript
const slugMap: Record<string, string> = {
  // 现有映射...
  
  // 添加新标签映射
  '深度学习': 'deep-learning',
  '算法分析': 'algorithm-analysis', 
  '系统设计': 'system-design',
  '代码重构': 'code-refactoring',
  '项目管理': 'project-management'
}
```

### 支持的 Markdown 功能

- 标题、段落、列表
- 代码块语法高亮
- 表格、引用
- 链接、图片
- GitHub Flavored Markdown

## 🎨 主题定制

项目支持明暗主题切换，主题配置位于：
- `src/styles/globals.css` - 全局样式
- `src/styles/themes.css` - 主题样式
- `src/hooks/useTheme.ts` - 主题管理逻辑

## 📊 性能

- 首屏加载时间 < 2s
- Lighthouse 评分 > 90
- 完全静态化，CDN 友好
- 支持现代浏览器（Chrome 80+, Safari 14+）

## 🚀 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 自动检测 Next.js 配置并部署

### 手动部署

```bash
npm run build
# 生成的静态文件在 out/ 目录
```

## 🤝 开发

### 开发规范

- 遵循 TypeScript 严格模式
- 使用 ESLint + Prettier 代码格式化
- 组件使用函数式组件 + Hooks
- 遵循 Ant Design 设计规范

### 可用脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run format       # 格式化代码
npm run format:check # 检查代码格式
npm run type-check   # TypeScript 类型检查
npm run check-all    # 运行所有检查
npm run fix-all      # 修复所有问题
npm test             # 运行测试
```

### CI/CD 流水线

项目配置了完整的 GitHub Actions CI/CD 流水线：

#### 代码质量检查 (.github/workflows/ci.yml)
- ✅ TypeScript 类型检查
- ✅ ESLint 代码规范检查  
- ✅ Prettier 代码格式检查
- ✅ 构建验证
- ✅ 安全漏洞扫描
- ✅ 依赖项检查
- ✅ Markdown 文件验证

#### 自动部署 (.github/workflows/deploy.yml)
- 🚀 推送到 main 分支自动触发部署
- 🌐 GitHub Pages 自动部署
- 📦 构建产物缓存优化
- 🔄 支持手动触发部署

触发条件：
- 推送到 main/develop 分支
- 创建 Pull Request 到 main 分支

## 📄 许可证

MIT License

## 👨‍💻 作者

**Cooper** - 全栈开发工程师

---

**核心原则：先做能用的，再做完美的。架构为功能服务，不为架构而架构！** ✨