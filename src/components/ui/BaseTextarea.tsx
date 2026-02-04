import type { TextareaHTMLAttributes } from 'react'

type BaseTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  id: string
  hasError?: boolean
  containerClassName?: string
  helperText?: string
  errorText?: string
  fieldSize?: 'sm' | 'md' | 'lg'
}

function BaseTextarea({
  label,
  id,
  hasError = false,
  className = '',
  containerClassName = '',
  helperText,
  errorText,
  fieldSize = 'md',
  ...props
}: BaseTextareaProps) {
  const showError = hasError || Boolean(errorText)
  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-foreground-muted mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 ${
          showError
            ? 'border-danger-300 focus:border-danger-400 focus:ring-danger-100'
            : 'border-border focus:border-primary-500 focus:ring-primary-200'
        } ${
          fieldSize === 'sm'
            ? 'px-3 py-2 text-sm'
            : fieldSize === 'lg'
              ? 'px-5 py-4 text-base'
              : 'px-4 py-3 text-sm'
        } ${className}`.trim()}
        {...props}
      />
      {errorText && (
        <p className="mt-2 text-xs text-danger-600">{errorText}</p>
      )}
      {!errorText && helperText && (
        <p className="mt-2 text-xs text-foreground-subtle">{helperText}</p>
      )}
    </div>
  )
}

export default BaseTextarea
