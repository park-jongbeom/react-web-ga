import type { HTMLAttributes } from 'react'

type BaseSpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<BaseSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-[3px]',
}

function BaseSpinner({ size = 'md', className = '', ...props }: BaseSpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-solid border-surface-muted border-t-primary-600 ${sizeClasses[size]} ${className}`.trim()}
      aria-label="로딩 중"
      role="status"
      {...props}
    />
  )
}

export default BaseSpinner
