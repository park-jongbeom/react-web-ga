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
  1: 'text-title-lg font-bold',
  2: 'text-title font-bold',
  3: 'text-section font-semibold',
  4: 'text-body font-semibold',
}

const headingToneClasses: Record<HeadingTone, string> = {
  primary: 'text-foreground',
  muted: 'text-foreground-muted',
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
  body: 'text-foreground-muted text-body',
  subtitle: 'text-foreground-muted text-section font-medium',
  caption: 'text-foreground-subtle text-caption',
  label: 'text-foreground-muted text-body-sm font-medium',
  overline: 'text-caption uppercase tracking-widest text-foreground-subtle font-semibold',
  helper: 'text-caption text-foreground-subtle',
  error: 'text-caption text-danger-600',
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
