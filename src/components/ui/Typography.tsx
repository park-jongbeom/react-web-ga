import type { HTMLAttributes, ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4
type HeadingTone = 'primary' | 'muted'
type TextVariant = 'body' | 'subtitle' | 'caption' | 'label' | 'overline' | 'helper' | 'error'

type BaseHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel
  tone?: HeadingTone
  children: ReactNode
}

const headingSizeClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
}

const headingToneClasses: Record<HeadingTone, string> = {
  primary: 'text-gray-900',
  muted: 'text-gray-700',
}

function BaseHeading({
  level = 2,
  tone = 'primary',
  className = '',
  children,
  ...props
}: BaseHeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag
      className={`${headingSizeClasses[level]} ${headingToneClasses[tone]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  )
}

type BaseTextProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: TextVariant
  children: ReactNode
}

const textVariantClasses: Record<TextVariant, string> = {
  body: 'text-gray-600 text-base',
  subtitle: 'text-gray-600 text-lg font-medium',
  caption: 'text-gray-500 text-sm',
  label: 'text-gray-700 text-sm font-medium',
  overline: 'text-xs uppercase tracking-widest text-gray-500 font-semibold',
  helper: 'text-xs text-gray-500',
  error: 'text-xs text-red-600',
}

function BaseText({
  variant = 'body',
  className = '',
  children,
  ...props
}: BaseTextProps) {
  return (
    <p
      className={`${textVariantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  )
}

export { BaseHeading, BaseText }
