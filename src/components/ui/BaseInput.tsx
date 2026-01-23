import type { InputHTMLAttributes } from 'react'

type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  id: string
  hasError?: boolean
  containerClassName?: string
  helperText?: string
  errorText?: string
  fieldSize?: 'sm' | 'md' | 'lg'
}

function BaseInput({
  label,
  id,
  hasError = false,
  className = '',
  containerClassName = '',
  helperText,
  errorText,
  fieldSize = 'md',
  ...props
}: BaseInputProps) {
  const showError = hasError || Boolean(errorText)
  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-600 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border focus:outline-none focus:ring-2 ${
          showError
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
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
        <p className="mt-2 text-xs text-red-600">{errorText}</p>
      )}
      {!errorText && helperText && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default BaseInput
