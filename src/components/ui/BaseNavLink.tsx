import type { AnchorHTMLAttributes, ReactNode } from 'react'

type BaseNavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
}

function BaseNavLink({ children, className = '', ...props }: BaseNavLinkProps) {
  return (
    <a
      className={`py-4 text-gray-600 hover:text-primary-600 font-medium border-b-2 border-transparent hover:border-primary-600 transition-colors ${className}`.trim()}
      {...props}
    >
      {children}
    </a>
  )
}

export default BaseNavLink
