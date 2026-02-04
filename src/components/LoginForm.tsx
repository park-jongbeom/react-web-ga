import type { FormEvent } from 'react'
import BaseButton from './ui/BaseButton'
import BaseInput from './ui/BaseInput'
import { BaseText } from './ui/Typography'

type LoginFormErrors = {
  email?: string
  password?: string
  general?: string
}

type LoginFormProps = {
  email: string
  password: string
  errors: LoginFormErrors
  onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
  disabled?: boolean
  canSubmit?: boolean
}

function LoginForm({
  email,
  password,
  errors,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  canSubmit = true,
}: LoginFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* 일반 에러 메시지 */}
      {errors.general && (
        <div className="rounded-md bg-danger-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-danger-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <BaseText variant="label" className="text-danger-800">
                {errors.general}
              </BaseText>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 입력 */}
      <div>
        <BaseInput
          id="email"
          name="email"
          type="email"
          label="이메일 주소"
          autoComplete="email"
          required
          value={email}
          onChange={onEmailChange}
          placeholder="your@email.com"
          hasError={!!errors.email}
          disabled={isLoading || disabled}
          className="shadow-sm sm:text-sm"
        />
        {errors.email && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.email}
          </BaseText>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <BaseInput
          id="password"
          name="password"
          type="password"
          label="비밀번호"
          autoComplete="current-password"
          required
          value={password}
          onChange={onPasswordChange}
          placeholder="••••••••"
          hasError={!!errors.password}
          disabled={isLoading || disabled}
          className="shadow-sm sm:text-sm"
        />
        {errors.password && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.password}
          </BaseText>
        )}
      </div>

      {/* 로그인 버튼 */}
      <div>
        <BaseButton
          type="submit"
          className="w-full"
          disabled={isLoading || disabled || !canSubmit}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-onPrimary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            '로그인'
          )}
        </BaseButton>
      </div>
    </form>
  )
}

export default LoginForm
