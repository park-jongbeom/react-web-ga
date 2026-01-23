import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  type ButtonRounded,
  type ButtonSize,
  type ButtonVariant,
  getButtonClassNames,
} from './buttonStyles'

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  rounded?: ButtonRounded
  fullWidth?: boolean
}

function BaseButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  fullWidth = false,
  type = 'button',
  ...props
}: BaseButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassNames({
        variant,
        size,
        rounded,
        className: `${fullWidth ? 'w-full' : ''} ${className}`.trim(),
      })}
      {...props}
    >
      {children}
    </button>
  )
}

export default BaseButton
