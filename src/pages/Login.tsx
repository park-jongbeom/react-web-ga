/**
 * 로그인 페이지
 * 
 * 보안 원칙 준수:
 * - XSS+CSP: DOMPurify 및 입력 검증
 * - CSRF: 백엔드 JWT 기반 인증
 * - Validation+SQLi 방어: Zod 스키마 검증
 * - Rate Limiting: 로그인 시도 제한
 * - Bruteforce 방어: 버튼 Disabled 처리
 * - 에러 노출 차단: 일반화된 에러 메시지
 * - Audit Log: 로그인 시도 기록
 */

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../api/AuthService'
import {
  loginRequestSchema,
} from '../utils/validation'
import {
  sanitizeInput,
  checkLoginAttempts,
} from '../utils/security'
import { BaseContainer, BaseSection } from '../components/ui/Layout'
import { BaseHeading, BaseText } from '../components/ui/Typography'
import LoginForm from '../components/LoginForm'

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, setAuth } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [attemptCheck, setAttemptCheck] = useState<{
    allowed: boolean
    remainingAttempts: number
    lockoutTime?: number
  } | null>(null)

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Rate Limiting 체크
  useEffect(() => {
    if (email) {
      // Zod 스키마로 이메일 검증
      const emailValidation = loginRequestSchema.shape.email.safeParse(email.trim())
      if (emailValidation.success) {
        const validatedEmail = emailValidation.data
        const check = checkLoginAttempts(validatedEmail)
        setAttemptCheck(check)
      } else {
        // 이메일이 유효하지 않으면 Rate Limiting 체크 초기화
        setAttemptCheck(null)
      }
    } else {
      setAttemptCheck(null)
    }
  }, [email])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // XSS 방어: 입력값 정제 (DOMPurify 포함)
    const sanitized = sanitizeInput(value)
    setEmail(sanitized)
    
    // Zod 실시간 검증
    if (sanitized) {
      const emailValidation = loginRequestSchema.shape.email.safeParse(sanitized)
      if (!emailValidation.success) {
        setErrors((prev) => ({ 
          ...prev, 
          email: emailValidation.error.errors[0]?.message || '올바른 이메일 형식을 입력해주세요.' 
        }))
      } else {
        setErrors((prev => {
          const newErrors = { ...prev }
          delete newErrors.email
          return newErrors
        }))
      }
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 비밀번호는 정제하지 않음 (해시화되므로)
    setPassword(value)
    
    // Zod 실시간 검증
    if (value) {
      const passwordValidation = loginRequestSchema.shape.password.safeParse(value)
      if (!passwordValidation.success) {
        setErrors((prev) => ({ 
          ...prev, 
          password: passwordValidation.error.errors[0]?.message || '비밀번호 형식이 올바르지 않습니다.' 
        }))
      } else {
        setErrors((prev => {
          const newErrors = { ...prev }
          delete newErrors.password
          return newErrors
        }))
      }
    } else {
      setErrors((prev => {
        const newErrors = { ...prev }
        delete newErrors.password
        return newErrors
      }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // 초기화
    setErrors({})
    setIsLoading(true)

    try {
      // 1. Zod 스키마 검증 (클라이언트 측 검증)
      const validationResult = loginRequestSchema.safeParse({
        email: email.trim(),
        password: password,
      })

      if (!validationResult.success) {
        // 첫 번째 에러 메시지 표시
        const firstError = validationResult.error.errors[0]
        const field = firstError.path[0] as string
        
        setErrors({
          [field]: firstError.message,
        })
        setIsLoading(false)
        return
      }

      // 검증된 이메일 사용
      const validatedEmail = validationResult.data.email

      // 2. Rate Limiting 체크
      const check = checkLoginAttempts(validatedEmail)
      if (!check.allowed) {
        setErrors({
          general: `너무 많은 로그인 시도가 있었습니다. ${check.lockoutTime}분 후 다시 시도해주세요.`,
        })
        setIsLoading(false)
        return
      }

      // 3. 로그인 시도 (Zod 검증 완료, Audit Log는 AuthService에서 처리)
      const result = await login(validatedEmail, validationResult.data.password)

      if (result.success && result.data) {
        // 성공 시 AuthContext에 인증 정보 설정
        const { accessToken, refreshToken } = result.data
        
        // 사용자 정보 추출 (토큰에서)
        let user = undefined
        try {
          const tokenPayload = JSON.parse(
            atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
          )
          user = {
            id: tokenPayload.sub || tokenPayload.userId || '',
            email: tokenPayload.email || validatedEmail,
            roles: tokenPayload.roles ? (Array.isArray(tokenPayload.roles) ? tokenPayload.roles : [tokenPayload.roles]) : [],
            tenantId: tokenPayload.tenantId || undefined,
          }
        } catch {
          // 토큰 파싱 실패 시 기본값 사용
          user = {
            id: '',
            email: validatedEmail,
            roles: [],
          }
        }
        
        // AuthContext에 인증 정보 설정
        setAuth(accessToken, refreshToken, user)
        
        // 성공 시 대시보드로 리다이렉트
        navigate('/dashboard', { replace: true })
      } else {
        // 실패 시 에러 메시지 표시 (일반화된 메시지)
        setErrors({ general: result.error || '로그인에 실패했습니다.' })
      }
    } catch (error) {
      // 예외 처리: 일반화된 에러 메시지 (보안: 상세 정보 노출 방지)
      setErrors({ general: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BaseSection
      variant="tight"
      className="min-h-screen bg-surface-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <BaseContainer className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <img
            src="/logo.jpg"
            alt="Go Almond"
            className="h-16 w-auto"
          />
        </Link>
        <BaseHeading level={2} className="mt-6 text-center">
          계정에 로그인
        </BaseHeading>
        <BaseText variant="caption" className="mt-2 text-center">
          또는{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            새 계정 만들기
          </Link>
        </BaseText>
      </BaseContainer>

      <BaseContainer className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Rate Limiting 경고 */}
          {attemptCheck && !attemptCheck.allowed && (
            <div className="mb-4 rounded-md bg-danger-50 p-4">
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
                  <BaseText
                    variant="label"
                    className="text-danger-800"
                  >
                    로그인 시도 제한
                  </BaseText>
                  <BaseText
                    variant="caption"
                    className="mt-2 text-danger-700"
                  >
                    <p>
                      너무 많은 로그인 시도가 있었습니다.{' '}
                      {attemptCheck.lockoutTime}분 후 다시 시도해주세요.
                    </p>
                  </BaseText>
                </div>
              </div>
            </div>
          )}

          {/* 남은 시도 횟수 표시 */}
          {attemptCheck && attemptCheck.allowed && attemptCheck.remainingAttempts < 5 && (
            <div className="mb-4 rounded-md bg-warning-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <BaseText variant="caption" className="text-warning-800">
                    남은 로그인 시도 횟수: {attemptCheck.remainingAttempts}회
                  </BaseText>
                </div>
              </div>
            </div>
          )}

          <LoginForm
            email={email}
            password={password}
            errors={errors}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={attemptCheck?.allowed === false}
            canSubmit={
              Boolean(email) &&
              Boolean(password) &&
              !errors.email &&
              !errors.password
            }
          />

          {/* 비밀번호 찾기 링크 */}
          <div className="text-sm text-center mt-6">
            <Link
              to="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </div>
      </BaseContainer>
    </BaseSection>
  )
}

export default Login
