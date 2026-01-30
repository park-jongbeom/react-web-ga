import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'success' | 'info' | 'neutral'

type BaseBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-100 text-success-800',
  info: 'bg-info-100 text-info-800',
  neutral: 'bg-surface-muted text-foreground',
}

function BaseBadge({
  variant = 'neutral',
  children,
  className = '',
  ...props
}: BaseBadgeProps) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
}

export default BaseBadge
