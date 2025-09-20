---
title: "Hello World - 我的第一篇博客文章"
slug: "hello-world"
excerpt: "欢迎来到我的博客！这是第一篇文章，介绍了博客的基本功能和特色。"
date: "2024-01-15"
publishedAt: "2024-01-15"
category: "thinking"
tags: ["博客", "Next.js", "React"]
author: "Cooper"
status: "published"
featured: true
coverImage: "/images/posts/hello-world.svg"
wordCount: 800
readingTime: 4
views: 1250
---

# Hello World - 欢迎来到我的博客

欢迎来到我的个人博客！这是我的第一篇文章，我想在这里分享一下创建这个博客的经历和想法。

## 为什么要创建这个博客？

在数字化时代，拥有一个自己的博客就像拥有一个数字化的家。这里是我表达想法、分享知识和记录成长的地方。

### 主要目的：

1. **知识分享** - 分享我在技术领域的学习心得
2. **思考记录** - 记录日常的思考和感悟
3. **技术交流** - 与志同道合的朋友交流技术
4. **个人成长** - 通过写作促进自己的思考和表达能力

## 博客的技术栈

这个博客使用了现代化的技术栈来构建：

### 前端技术
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架

### 内容管理
- **Markdown** - 文章写作格式
- **Gray Matter** - Front Matter 解析
- **Remark** - Markdown 处理

## 代码示例

让我展示一个简单的 React 组件：

```tsx
import React from 'react'

interface GreetingProps {
  name: string
}

export function Greeting({ name }: GreetingProps) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h1 className="text-2xl font-bold text-blue-800">
        Hello, {name}!
      </h1>
      <p className="text-blue-600">
        欢迎来到我的博客！
      </p>
    </div>
  )
}
```

> 这只是开始，精彩还在后面。让我们一起在技术的道路上前行！