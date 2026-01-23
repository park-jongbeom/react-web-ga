import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'success' | 'info' | 'neutral'

type BaseBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
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
