'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { navigationConfig } from '@/config/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {navigationConfig.mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              isActiveLink(item.href)
                ? 'text-foreground'
                : 'text-foreground/60'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="打开菜单"
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </Button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-background p-4 shadow-lg md:hidden">
            <nav className="flex flex-col space-y-3">
              {navigationConfig.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 rounded-md hover:bg-accent',
                    isActiveLink(item.href)
                      ? 'text-foreground bg-accent'
                      : 'text-foreground/70'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="pt-2 border-t border-border">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  搜索文章...
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}

// 面包屑导航组件
export function Breadcrumb({ items }: { items: Array<{ title: string; href?: string }> }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        首页
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span className="text-foreground">{item.title}</span>
          )}
        </div>
      ))}
    </nav>
  )
}