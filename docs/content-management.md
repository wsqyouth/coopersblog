# 📝 内容管理指南

Cooper's Blog 使用文件系统管理文章内容，所有文章都存储为 Markdown 文件。这种方式既简单又强大，支持版本控制和离线编辑。

## 🗂️ 文件组织结构

### 推荐的目录结构

```
posts/
├── hello-world.md                    # 根目录文章
├── next-js-best-practices.md         # 技术教程
├── react-19-features.md              # 技术分析
├── project-review-blog.md            # 项目复盘
├── tech/                             # 技术分类
│   ├── advanced-react.md
│   ├── node-js-performance.md
│   └── typescript-tips.md
├── thinking/                         # 思考笔记
│   ├── 2025-01-welcome.md
│   ├── tech-career-advice.md
│   └── learning-philosophy.md
├── life/                             # 生活分享
│   ├── reading-notes.md
│   └── travel-diary.md
└── diary/                            # 日记分类
    └── weekly-summary.md
```

### 文件命名规范

- 使用小写字母和连字符：`my-article-title.md`
- 避免特殊字符：`@#$%^&*()`
- 文件名即为文章 URL slug
- 支持中文文件名，但建议使用英文

## ✍️ 创建新文章

### 1. 创建文件

在 `posts/` 目录下创建新的 `.md` 文件：

```bash
# 在根目录创建
touch posts/my-new-article.md

# 在分类目录创建
mkdir -p posts/tech
touch posts/tech/advanced-nextjs.md
```

### 2. 添加 Front Matter

每篇文章都需要包含 YAML Front Matter 元数据：

```yaml
---
title: "文章标题"
excerpt: "简短的文章摘要，用于预览和SEO"
publishedAt: "2025-01-20"
category: 
  name: "技术分享"
  slug: "tech"
  icon: "💻"
tags: ["Next.js", "React", "Web开发"]
author: "Cooper"
featured: false
coverImage: "/images/posts/my-article-cover.jpg"
---
```

### 3. 编写内容

使用标准 Markdown 语法编写文章内容。

## 📋 Front Matter 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `excerpt` | string | ❌ | 文章摘要（不填会自动提取） |
| `publishedAt` | string | ✅ | 发布日期 (YYYY-MM-DD) |
| `category` | object | ✅ | 分类信息 |
| `category.name` | string | ✅ | 分类显示名称 |
| `category.slug` | string | ✅ | 分类URL路径 |
| `category.icon` | string | ❌ | 分类图标 |
| `tags` | array | ❌ | 标签列表 |
| `author` | string | ❌ | 作者（默认 Cooper） |
| `featured` | boolean | ❌ | 是否精选文章 |
| `coverImage` | string | ❌ | 封面图片路径 |
| `wordCount` | number | ❌ | 字数（会自动计算） |
| `readingTime` | number | ❌ | 阅读时间（会自动计算） |

## 🏷️ 分类系统

### 使用现有分类

系统预配置了以下分类，直接使用即可：

```yaml
category:
  name: "思考笔记"
  slug: "thinking"
  icon: "🤔"

# 或使用其他分类
category:
  name: "技术分享"
  slug: "tech" 
  icon: "💻"
```

### 添加新分类

1. 编辑 `src/config/categories.ts`：

```typescript
export const categoryMap: Record<string, CategoryConfig> = {
  // 现有分类...
  
  '读书笔记': {
    name: '读书笔记',
    slug: 'reading-notes',
    description: '书籍阅读心得分享',
    icon: '📚',
    color: '#52c41a',
    showInNav: true,
    order: 6
  }
}
```

2. 在文章中使用：

```yaml
category:
  name: "读书笔记"
  slug: "reading-notes"
  icon: "📚"
```

## 🏷️ 标签系统

### 简单标签格式（推荐）

```yaml
tags: ["React", "Next.js", "TypeScript", "前端开发"]
```

### 详细标签格式

```yaml
tags:
  - name: "React"
    slug: "react"
  - name: "Next.js"
    slug: "nextjs"
```

### 中文标签自动映射

系统会自动为中文标签生成英文 slug：

- `前端开发` → `frontend`
- `项目管理` → `project-management`
- `学习笔记` → `learning-notes`

## 🖼️ 图片管理

### 图片存储位置

```
public/images/posts/
├── hello-world.svg
├── react-19.svg
├── project-review.svg
└── hero.svg
```

### 在文章中使用图片

```markdown
# 方式1：绝对路径（推荐）
![图片描述](/images/posts/my-image.jpg)

# 方式2：相对路径（会自动转换）
![图片描述](my-image.jpg)

# 方式3：外部链接
![图片描述](https://example.com/image.jpg)
```

### 封面图片

在 Front Matter 中设置封面图片：

```yaml
coverImage: "/images/posts/my-article-cover.jpg"
```

## 🔧 高级功能

### 代码语法高亮

支持多种编程语言的语法高亮：

```tsx
import React from 'react'

interface Props {
  title: string
}

export function MyComponent({ title }: Props) {
  return <h1>{title}</h1>
}
```

### 数学公式

支持 LaTeX 数学公式（需要额外配置）：

```markdown
$$E = mc^2$$
```

### 目录生成

长文章会自动生成目录导航。

## 📊 内容统计

系统会自动计算以下指标：

- **字数统计**: 智能识别中英文字符
- **阅读时间**: 基于200字/分钟计算
- **文章摘要**: 自动提取前200字符

## 🚀 发布流程

### 本地预览

```bash
npm run dev
# 访问 http://localhost:3000
```

### 构建检查

```bash
npm run build
npm run start
```

### 部署到生产

```bash
git add .
git commit -m "Add new article: 文章标题"
git push origin main
```

Vercel 会自动检测到推送并重新部署网站。

## 📝 写作建议

### 文章结构

1. **引言**: 简明扼要地介绍主题
2. **正文**: 分段落详细阐述
3. **代码示例**: 提供实际可用的代码
4. **总结**: 概括要点和收获

### SEO 优化

- 使用有意义的文章标题
- 提供准确的摘要描述
- 合理使用标签分类
- 包含相关的关键词

### 可读性

- 使用标题层级组织内容
- 适当使用列表和表格
- 代码示例要完整可运行
- 添加适当的图片说明

## 🐛 常见问题

### Q: 文章不显示怎么办？

A: 检查以下几点：
- Front Matter 格式是否正确
- 文件扩展名是否为 `.md`
- 分类配置是否存在
- 控制台是否有错误信息

### Q: 图片显示404？

A: 确保图片文件存在于 `public/images/posts/` 目录下。

### Q: 中文标签链接不正确？

A: 检查 `src/lib/blog-data.ts` 中的标签映射配置。

### Q: 如何批量导入文章？

A: 直接将 Markdown 文件复制到 `posts/` 目录即可，系统会自动识别。

---

💡 **提示**: 遵循这些规范可以确保内容管理的一致性和网站的稳定性。如有问题，请查看现有文章作为参考。