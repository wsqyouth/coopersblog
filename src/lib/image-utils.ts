/**
 * 图片路径处理工具
 */

// 图片路径映射配置
const IMAGE_PATH_MAP: Record<string, string> = {
  '/hero.jpg': '/images/posts/hero.svg',
  '/hero.png': '/images/posts/hero.svg',
  '/hero.svg': '/images/posts/hero.svg',
  'hero.jpg': '/images/posts/hero.svg',
  'hero.png': '/images/posts/hero.svg',
  'hero.svg': '/images/posts/hero.svg',
}

/**
 * 处理图片路径，确保图片能正确加载
 * @param originalPath 原始图片路径
 * @returns 处理后的图片路径
 */
export function resolveImagePath(originalPath: string): string {
  // 检查是否有预定义的映射
  if (IMAGE_PATH_MAP[originalPath]) {
    return IMAGE_PATH_MAP[originalPath]
  }

  // 如果是相对路径，添加 /images/posts/ 前缀
  if (!originalPath.startsWith('http') && !originalPath.startsWith('/')) {
    return `/images/posts/${originalPath}`
  }

  // 如果已经是绝对路径且存在，直接返回
  return originalPath
}

/**
 * 检查是否为图片文件
 * @param url 文件URL
 * @returns 是否为图片
 */
export function isImageFile(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

/**
 * 为Markdown中的图片生成HTML
 * @param src 图片源
 * @param alt 图片描述
 * @returns 图片HTML字符串
 */
export function generateImageHTML(src: string, alt: string): string {
  const resolvedSrc = resolveImagePath(src)
  return `<img src="${resolvedSrc}" alt="${alt}" class="rounded-lg shadow-md my-6 max-w-full h-auto mx-auto block" loading="lazy" />`
}

/**
 * 检查图片文件是否存在（开发环境提示）
 * @param imagePath 图片路径
 */
export function validateImagePath(imagePath: string): boolean {
  // 在实际应用中，这里可以添加文件存在性检查
  // 目前返回 true，避免阻塞渲染
  return true
}