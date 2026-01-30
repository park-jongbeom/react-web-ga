/**
 * 회원가입 페이지
 *
 * 보안 원칙 준수:
 * - Validation+SQLi 방어: 입력 검증은 SignupForm에서 처리
 * - 에러 노출 차단: 서버 에러는 일반화된 메시지로 노출
 */

import SignupForm from '../components/SignupForm'
import { BaseContainer, BaseSection } from '../components/ui/Layout'
import { BaseHeading, BaseText } from '../components/ui/Typography'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../api/AuthService'
import { signupRequestSchema } from '../utils/validation'
import { useAuth } from '../context/AuthContext'
import { decodeJwtPayload } from '../utils/security'

type SignupErrors = {
  email?: string
  password?: string
  passwordConfirm?: string
  general?: string
}

function Signup() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [errors, setErrors] = useState<SignupErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: {
    email: string
    password: string
    passwordConfirm: string
  }) => {
    setErrors({})
    setIsLoading(true)

    const validationResult = signupRequestSchema.safeParse(values)
    if (!validationResult.success) {
      const fieldError = validationResult.error.errors[0]
      const fieldName = fieldError.path[0] as keyof SignupErrors
      setErrors({ [fieldName]: fieldError.message })
      setIsLoading(false)
      return
    }

    const result = await register(
      validationResult.data.email,
      validationResult.data.password,
      validationResult.data.passwordConfirm
    )

    if (result.success && result.data) {
      const { accessToken, refreshToken } = result.data
      const payload = decodeJwtPayload(accessToken)
      const user = payload
        ? {
            id: payload.sub || payload.userId || '',
            email: payload.email || validationResult.data.email,
            roles: payload.roles
              ? Array.isArray(payload.roles)
                ? payload.roles
                : [payload.roles]
              : [],
            tenantId: payload.tenantId || undefined,
          }
        : {
            id: '',
            email: validationResult.data.email,
            roles: [],
          }

      setAuth(accessToken, refreshToken, user)
      navigate('/dashboard', { replace: true })
      return
    }

    setErrors({
      general: result.error || '회원가입에 실패했습니다.',
    })
    setIsLoading(false)
  }
  return (
    <BaseSection
      variant="tight"
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <BaseContainer className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <img src="/logo.jpg" alt="Go Almond" className="h-16 w-auto" />
        </Link>
        <BaseHeading level={2} className="mt-6 text-center">
          새 계정 만들기
        </BaseHeading>
        <BaseText variant="caption" className="mt-2 text-center">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            로그인
          </Link>
        </BaseText>
      </BaseContainer>

      <BaseContainer className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm
            onSubmit={handleSubmit}
            errors={errors}
            isLoading={isLoading}
          />
        </div>
      </BaseContainer>
    </BaseSection>
  )
}

export default Signup
