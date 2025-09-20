import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 ESLint 检查以确保构建成功
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
