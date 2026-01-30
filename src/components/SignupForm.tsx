import { useState } from 'react'
import type { FormEvent } from 'react'
import BaseButton from './ui/BaseButton'
import BaseInput from './ui/BaseInput'
import { BaseText } from './ui/Typography'

export type SignupFormValues = {
  email: string
  password: string
  passwordConfirm: string
}

type SignupFormErrors = Partial<
  Record<keyof SignupFormValues | 'general', string>
>

type SignupFormProps = {
  onSubmit?: (values: SignupFormValues) => void | Promise<void>
  isLoading?: boolean
  disabled?: boolean
  errors?: SignupFormErrors
}

function SignupForm({
  onSubmit,
  isLoading = false,
  disabled = false,
  errors = {},
}: SignupFormProps) {
  const [values, setValues] = useState<SignupFormValues>({
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const handleChange =
    (field: keyof SignupFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit?.(values)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="rounded-md bg-danger-50 p-4">
          <BaseText variant="label" className="text-danger-800">
            {errors.general}
          </BaseText>
        </div>
      )}

      <BaseInput
        id="signup-email"
        name="email"
        type="email"
        label="이메일 주소"
        placeholder="your@email.com"
        autoComplete="email"
        required
        value={values.email}
        onChange={handleChange('email')}
        hasError={Boolean(errors.email)}
        errorText={errors.email}
        disabled={isLoading || disabled}
        className="shadow-sm sm:text-sm"
      />

      <BaseInput
        id="signup-password"
        name="password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        value={values.password}
        onChange={handleChange('password')}
        hasError={Boolean(errors.password)}
        errorText={errors.password}
        disabled={isLoading || disabled}
        className="shadow-sm sm:text-sm"
      />

      <BaseInput
        id="signup-password-confirm"
        name="passwordConfirm"
        type="password"
        label="비밀번호 확인"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        value={values.passwordConfirm}
        onChange={handleChange('passwordConfirm')}
        hasError={Boolean(errors.passwordConfirm)}
        errorText={errors.passwordConfirm}
        disabled={isLoading || disabled}
        className="shadow-sm sm:text-sm"
      />

      <BaseButton
        type="submit"
        className="w-full"
        disabled={isLoading || disabled}
      >
        {isLoading ? '처리 중...' : '회원가입'}
      </BaseButton>
    </form>
  )
}

export default SignupForm
