import type { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'default' | 'outline' | 'interactive' | 'accent'
type CardSize = 'sm' | 'md' | 'lg'

type BaseCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  children: ReactNode
  variant?: CardVariant
  size?: CardSize
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border border-gray-200 bg-gray-50',
  outline: 'border border-gray-200 bg-white',
  interactive:
    'border-2 border-primary-500 bg-white hover:border-primary-600 hover:shadow-md transition-all cursor-pointer',
  accent: 'border border-gray-200 bg-white hover:shadow-md transition-shadow',
}

const sizeClasses: Record<CardSize, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

function BaseCard({
  title,
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: BaseCardProps) {
  return (
    <div
      className={`rounded-xl ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      {children}
    </div>
  )
}

export default BaseCard
