import { siteConfig } from '@/config/site'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/20 bg-background mt-24">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} {siteConfig.siteName}. Built with Next.js.</p>
        </div>
      </div>
    </footer>
  )
}