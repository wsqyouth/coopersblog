import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: '关于', href: '/about', icon: '👨‍💻' },
    { name: '隐私政策', href: '/privacy', icon: '🔒' },
    { name: '友情链接', href: '/links', icon: '🔗' },
    { name: 'RSS', href: '/rss.xml', icon: '📡' },
  ]

  return (
    <footer className="border-t border-border/20 bg-background mt-24">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 链接区域 */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* 版权信息 */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>© {currentYear} {siteConfig.siteName}. Built with Next.js.</p>
          {/* 备案信息占位符 */}
          <div className="flex flex-col items-center gap-1">
            {/* 部署到腾讯云后记得修改*/}
            <p className="opacity-75">
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                粤ICP备xxxxxxxx号
              </a>
            </p>
          </div>
        </div>

        {/* 技术栈展示 */}
        <div className="mt-4 text-center">
          <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground opacity-60">
            <span>💻</span>
            <span>Powered by</span>
            <span className="font-semibold">Next.js</span>
            <span>•</span>
            <span className="font-semibold">React</span>
            <span>•</span>
            <span className="font-semibold">TypeScript</span>
            <span>•</span>
            <span className="font-semibold">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}