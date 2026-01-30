import type { HTMLAttributes, ReactNode } from 'react'

type BasePanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

function BasePanel({ children, className = '', ...props }: BasePanelProps) {
  return (
    <div
      className={`bg-surface rounded-xl shadow-md p-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default BasePanel
