import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', asChild = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    }

    const sizes = {
      sm: 'text-xs px-2.5 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-1.5'
    }

    const badgeClasses = cn(
      'inline-flex items-center rounded-full border border-transparent font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variants[variant],
      sizes[size],
      className
    )

    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<any>
      return React.cloneElement(
        childElement,
        {
          className: cn(badgeClasses, childElement.props?.className),
          ...props,
        } as any
      )
    }

    return (
      <div
        ref={ref}
        className={badgeClasses}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }