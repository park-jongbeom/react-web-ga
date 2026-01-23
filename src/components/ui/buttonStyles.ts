export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'inverse'
  | 'muted'
  | 'soft'
  | 'secondary'
  | 'success'
  | 'danger'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonRounded = 'lg' | 'full'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 transition-colors',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors',
  ghost: 'bg-transparent text-gray-600 hover:text-primary-600 transition-colors',
  link: 'bg-transparent text-primary-600 hover:text-primary-700 transition-colors',
  inverse: 'bg-white text-primary-600 hover:bg-gray-100 transition-colors',
  muted: 'bg-transparent text-gray-600 hover:text-gray-700 transition-colors',
  soft: 'bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 transition-colors',
  success: 'bg-green-600 text-white hover:bg-green-700 transition-colors',
  danger: 'bg-red-600 text-white hover:bg-red-700 transition-colors',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-8 py-3 text-lg',
}

const roundedClasses: Record<ButtonRounded, string> = {
  lg: 'rounded-lg',
  full: 'rounded-full',
}

export const getButtonClassNames = ({
  variant,
  size,
  rounded,
  className = '',
}: {
  variant: ButtonVariant
  size: ButtonSize
  rounded: ButtonRounded
  className?: string
}) =>
  [
    'inline-flex items-center justify-center font-semibold disabled:opacity-60 disabled:cursor-not-allowed',
    roundedClasses[rounded],
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')
