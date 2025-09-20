'use client'

import Link from 'next/link'
import { useState } from 'react'
import { siteConfig } from '@/config/site'
import { navigationConfig } from '@/config/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="border-b border-border/20 bg-background">
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold">{siteConfig.siteName}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          {navigationConfig.mainNav.map((item) => (
            <div key={item.href} className="relative">
              {item.children ? (
                <div
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="hover:text-primary transition-colors flex items-center gap-1">
                    {item.icon && <span>{item.icon}</span>}
                    {item.title}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openDropdown === item.href && (
                    <div className="absolute top-full left-0 pt-1 w-48 z-50">
                      <div className="bg-background border border-border rounded-md shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}