import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import {
  type ButtonRounded,
  type ButtonSize,
  type ButtonVariant,
  getButtonClassNames,
} from './buttonStyles'

type BaseLinkButtonProps = LinkProps & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  rounded?: ButtonRounded
  fullWidth?: boolean
}

function BaseLinkButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  fullWidth = false,
  ...props
}: BaseLinkButtonProps) {
  return (
    <Link
      className={getButtonClassNames({
        variant,
        size,
        rounded,
        className: `${fullWidth ? 'w-full' : ''} ${className}`.trim(),
      })}
      {...props}
    >
      {children}
    </Link>
  )
}

export default BaseLinkButton
