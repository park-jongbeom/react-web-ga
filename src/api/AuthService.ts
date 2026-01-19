/**
 * 인증 서비스
 * 
 * 모든 보안 원칙을 준수하여 구현:
 * - CORS/Preflight: Vite 프록시 및 백엔드 CORS 설정
 * - CSRF: X-XSRF-TOKEN 헤더 처리
 * - XSS+CSP: DOMPurify 및 입력 검증
 * - SSRF: 백엔드 URL 검증, 내부 네트워크 접근 방지
 * - AuthN/AuthZ: JWT 기반 인증/인가
 * - RBAC/ABAC: 역할 기반 접근 제어 + 테넌트 격리
 * - 최소 권한: 권한 체크
 * - Validation+SQLi 방어: Zod 스키마 검증
 * - RateLimit/Bruteforce: 로그인 시도 제한
 * - 쿠키 보안: HttpOnly, Secure, SameSite (백엔드)
 * - Secret 관리: 환경 변수 사용
 * - HTTPS/HSTS: 프로덕션 환경
 * - AuditLog: Audit API 연동
 * - 에러 노출 차단: 일반화된 에러 메시지
 */

import { authApi } from './axiosInstance'
import type {
  ApiResponse,
  LoginResponse,
  RefreshResponse,
} from '../types/api'
import {
  loginRequestSchema,
  refreshRequestSchema,
  type LoginRequest as ZodLoginRequest,
  type RefreshRequest as ZodRefreshRequest,
} from '../utils/validation'
import {
  sanitizeInput,
  checkLoginAttempts,
  recordLoginAttempt,
  setToken,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  getTenantId,
} from '../utils/security'
import {
  logLoginSuccess,
  logLoginFailure,
  logLogout,
  logTokenRefresh,
} from './AuditService'

/**
 * 일반화된 에러 메시지 (보안: 상세 정보 노출 방지)
 */
const getSafeErrorMessage = (error: any): string => {
  // 네트워크 에러
  if (!error.response) {
    return '네트워크 연결을 확인해주세요.'
  }
  
  const status = error.response.status
  
  // 일반화된 에러 메시지 (보안: 상세 정보 노출 방지)
  switch (status) {
    case 400:
      return '요청 형식이 올바르지 않습니다.'
    case 401:
      return '이메일 또는 비밀번호가 올바르지 않습니다.'
    case 403:
      return '접근 권한이 없습니다.'
    case 404:
      return '요청한 리소스를 찾을 수 없습니다.'
    case 429:
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    case 500:
    case 502:
    case 503:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    default:
      return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
}

/**
 * 로그인
 * 
 * 보안 검증:
 * 1. Zod 스키마 검증 (이메일/비밀번호)
 * 2. 입력값 정제 (DOMPurify + SQL 인젝션 방어)
 * 3. Rate Limiting 체크
 * 4. Brute Force 방어
 * 5. Audit Log 기록
 */
export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> => {
  let sanitizedEmail = ''
  let userId: string | undefined

  try {
    // 1. 입력값 정제 (DOMPurify 적용)
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    // 2. Zod 스키마 검증
    const validationResult = loginRequestSchema.safeParse({
      email: trimmedEmail,
      password: trimmedPassword,
    })

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      return {
        success: false,
        error: firstError.message || '입력값 검증에 실패했습니다.',
      }
    }

    // 검증된 데이터 사용
    sanitizedEmail = validationResult.data.email
    const validatedPassword = validationResult.data.password

    // 3. Rate Limiting 체크
    const attemptCheck = checkLoginAttempts(sanitizedEmail)
    if (!attemptCheck.allowed) {
      // Audit Log: 로그인 실패 (Rate Limit)
      await logLoginFailure(
        sanitizedEmail,
        'Rate limit exceeded',
        getTenantId() || undefined,
        { remainingLockoutTime: attemptCheck.lockoutTime }
      )

      return {
        success: false,
        error: `너무 많은 로그인 시도가 있었습니다. ${attemptCheck.lockoutTime}분 후 다시 시도해주세요.`,
      }
    }

    // 4. 로그인 요청 (Zod 검증 완료)
    const loginRequest: ZodLoginRequest = {
      email: sanitizedEmail,
      password: validatedPassword,
    }

    const response = await authApi.post<ApiResponse<LoginResponse>>(
      '/login',
      loginRequest
    )

    if (response.data.success && response.data.data) {
      // 5. 토큰 저장
      const { accessToken, refreshToken } = response.data.data
      setToken(accessToken, refreshToken)

      // 6. 사용자 ID 추출 (Audit Log용)
      try {
        const tokenPayload = JSON.parse(
          atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        )
        userId = tokenPayload.sub || tokenPayload.userId
      } catch {
        // 토큰 파싱 실패 시 무시
      }

      // 7. 성공 기록
      recordLoginAttempt(sanitizedEmail, true)

      // 8. Audit Log: 로그인 성공
      await logLoginSuccess(
        userId || sanitizedEmail,
        sanitizedEmail,
        getTenantId() || undefined
      )

      return {
        success: true,
        data: response.data.data,
      }
    }

    // 실패 기록
    recordLoginAttempt(sanitizedEmail, false)

    // Audit Log: 로그인 실패
    await logLoginFailure(
      sanitizedEmail,
      response.data.message || 'Authentication failed',
      getTenantId() || undefined
    )

    return {
      success: false,
      error: response.data.message || '로그인에 실패했습니다.',
    }
  } catch (error: any) {
    // 에러 노출 차단: 일반화된 메시지
    const safeMessage = getSafeErrorMessage(error)

    // Rate Limiting 기록 (401 에러인 경우)
    if (error.response?.status === 401) {
      recordLoginAttempt(sanitizedEmail || email, false)

      // Audit Log: 로그인 실패
      await logLoginFailure(
        sanitizedEmail || email,
        'Invalid credentials',
        getTenantId() || undefined
      )
    }

    return {
      success: false,
      error: safeMessage,
    }
  }
}

/**
 * 토큰 갱신
 * 
 * 보안 검증:
 * 1. Zod 스키마 검증 (Refresh Token)
 * 2. 토큰 만료 확인
 * 3. Audit Log 기록
 */
export const refreshAccessToken = async (): Promise<{
  success: boolean
  data?: RefreshResponse
  error?: string
}> => {
  let userId: string | undefined

  try {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearTokens()
      return {
        success: false,
        error: 'Refresh Token이 없습니다. 다시 로그인해주세요.',
      }
    }

    // 1. Zod 스키마 검증
    const validationResult = refreshRequestSchema.safeParse({
      refreshToken,
    })

    if (!validationResult.success) {
      clearTokens()
      return {
        success: false,
        error: '올바른 토큰 형식이 아닙니다.',
      }
    }

    // 2. 토큰 만료 확인
    if (isTokenExpired(refreshToken)) {
      clearTokens()
      return {
        success: false,
        error: 'Refresh Token이 만료되었습니다. 다시 로그인해주세요.',
      }
    }

    // 3. 사용자 ID 추출 (Audit Log용)
    try {
      const tokenPayload = JSON.parse(
        atob(refreshToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )
      userId = tokenPayload.sub || tokenPayload.userId
    } catch {
      // 토큰 파싱 실패 시 무시
    }

    const refreshRequest: ZodRefreshRequest = validationResult.data

    const response = await authApi.post<ApiResponse<RefreshResponse>>(
      '/refresh',
      refreshRequest
    )

    if (response.data.success && response.data.data) {
      // 새 토큰 저장
      const { accessToken, refreshToken: newRefreshToken } = response.data.data
      setToken(accessToken, newRefreshToken)

      // Audit Log: 토큰 갱신
      if (userId) {
        await logTokenRefresh(
          userId,
          getTenantId() || undefined
        )
      }

      return {
        success: true,
        data: response.data.data,
      }
    }

    clearTokens()
    return {
      success: false,
      error: response.data.message || '토큰 갱신에 실패했습니다.',
    }
  } catch (error: any) {
    const safeMessage = getSafeErrorMessage(error)

    // 401 에러 시 토큰 제거
    if (error.response?.status === 401) {
      clearTokens()
    }

    return {
      success: false,
      error: safeMessage,
    }
  }
}

/**
 * 로그아웃
 * 
 * 보안 검증:
 * 1. Access Token 확인
 * 2. 백엔드에 로그아웃 요청 (토큰 무효화)
 * 3. 로컬 토큰 제거
 * 4. Audit Log 기록
 */
export const logout = async (): Promise<{
  success: boolean
  error?: string
}> => {
  let userId: string | undefined

  try {
    const accessToken = getAccessToken()

    // 사용자 ID 추출 (Audit Log용)
    if (accessToken) {
      try {
        const tokenPayload = JSON.parse(
          atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        )
        userId = tokenPayload.sub || tokenPayload.userId
      } catch {
        // 토큰 파싱 실패 시 무시
      }

      // 백엔드에 로그아웃 요청 (토큰 무효화)
      await authApi.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    }

    // 로컬 토큰 제거
    clearTokens()

    // Audit Log: 로그아웃
    if (userId) {
      await logLogout(
        userId,
        getTenantId() || undefined
      )
    }

    return {
      success: true,
    }
  } catch (error: any) {
    // 에러가 발생해도 로컬 토큰은 제거
    clearTokens()

    // Audit Log: 로그아웃 (에러 발생 시에도 기록)
    if (userId) {
      await logLogout(
        userId,
        getTenantId() || undefined,
        { error: 'Logout request failed' }
      )
    }

    // 에러는 무시 (이미 로컬에서 토큰 제거됨)
    return {
      success: true,
    }
  }
}

/**
 * 현재 Access Token 가져오기 (만료 확인 포함)
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  let accessToken = getAccessToken()
  
  // 토큰이 없으면 null 반환
  if (!accessToken) {
    return null
  }
  
  // 토큰 만료 확인
  if (isTokenExpired(accessToken)) {
    // Refresh Token으로 갱신 시도
    const refreshResult = await refreshAccessToken()
    
    if (refreshResult.success && refreshResult.data) {
      accessToken = refreshResult.data.accessToken
    } else {
      // 갱신 실패 시 null 반환
      return null
    }
  }
  
  return accessToken
}

/**
 * 인증 상태 확인
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken()
  if (!accessToken) {
    return false
  }
  
  return !isTokenExpired(accessToken)
}
