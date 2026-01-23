import type { HTMLAttributes, ReactNode } from 'react'

type SectionVariant = 'default' | 'tight'

type BaseSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  variant?: SectionVariant
}

const sectionClasses: Record<SectionVariant, string> = {
  default: 'py-16',
  tight: 'py-8',
}

function BaseSection({
  children,
  variant = 'default',
  className = '',
  ...props
}: BaseSectionProps) {
  return (
    <section className={`${sectionClasses[variant]} ${className}`.trim()} {...props}>
      {children}
    </section>
  )
}

type BaseContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

function BaseContainer({ children, className = '', ...props }: BaseContainerProps) {
  return (
    <div className={`container mx-auto px-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

type GridGap = 'sm' | 'md' | 'lg'
type GridCols = 1 | 2 | 3 | 4

type BaseGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  cols?: GridCols
  gap?: GridGap
}

const gridGapClasses: Record<GridGap, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

const gridColsClasses: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

function BaseGrid({
  children,
  cols = 2,
  gap = 'md',
  className = '',
  ...props
}: BaseGridProps) {
  return (
    <div
      className={`grid ${gridColsClasses[cols]} ${gridGapClasses[gap]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export { BaseSection, BaseContainer, BaseGrid }
