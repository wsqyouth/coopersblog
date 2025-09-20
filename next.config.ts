import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 开发模式：暂时禁用静态导出以支持动态路由
  // output: 'export',  // 开发阶段注释掉
  // trailingSlash: true,  // 开发阶段注释掉
  
  // 图片优化
  images: {
    unoptimized: process.env.NODE_ENV === 'production',  // 只在生产环境禁用优化
  },
  
  // 压缩配置
  compress: true,
  
  // 暂时禁用 ESLint 检查
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 构建优化
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }
    
    // 允许在客户端代码中使用 Node.js 模块
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    
    return config
  },
  
  // 实验性功能
  experimental: {
    optimizePackageImports: ['antd'],
  },
  
  // 重定向配置（静态导出时不可用）
  // async redirects() {
  //   return [
  //     {
  //       source: '/posts',
  //       destination: '/posts/',
  //       permanent: true,
  //     },
  //   ]
  // },
  
  // 安全头配置（静态导出时不可用）
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-DNS-Prefetch-Control',
  //           value: 'on'
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block'
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY'
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff'
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin'
  //         }
  //       ],
  //     },
  //   ]
  // },
};

export default nextConfig;
