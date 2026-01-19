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

import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../api/AuthService'
import {
  loginRequestSchema,
  type LoginRequest,
} from '../utils/validation'
import {
  sanitizeInput,
  checkLoginAttempts,
} from '../utils/security'

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <img
            src="/logo.jpg"
            alt="Go Almond"
            className="h-16 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          계정에 로그인
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          또는{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            새 계정 만들기
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Rate Limiting 경고 */}
          {attemptCheck && !attemptCheck.allowed && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                  <h3 className="text-sm font-medium text-red-800">
                    로그인 시도 제한
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      너무 많은 로그인 시도가 있었습니다.{' '}
                      {attemptCheck.lockoutTime}분 후 다시 시도해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 남은 시도 횟수 표시 */}
          {attemptCheck && attemptCheck.allowed && attemptCheck.remainingAttempts < 5 && (
            <div className="mb-4 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    남은 로그인 시도 횟수: {attemptCheck.remainingAttempts}회
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 일반 에러 메시지 */}
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
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
                    <h3 className="text-sm font-medium text-red-800">
                      {errors.general}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일 주소
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm sm:text-sm`}
                  placeholder="your@email.com"
                  disabled={isLoading || (attemptCheck?.allowed === false)}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm sm:text-sm`}
                  placeholder="••••••••"
                  disabled={isLoading || (attemptCheck?.allowed === false)}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* 로그인 버튼 */}
            <div>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !email ||
                  !password ||
                  !!errors.email ||
                  !!errors.password ||
                  (attemptCheck?.allowed === false)
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
              </button>
            </div>

            {/* 비밀번호 찾기 링크 */}
            <div className="text-sm text-center">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
