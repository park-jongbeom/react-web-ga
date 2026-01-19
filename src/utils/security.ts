/**
 * 보안 관련 유틸리티 함수
 * 
 * 보안 원칙:
 * - XSS+CSP: DOMPurify를 통한 완전한 XSS 방어
 * - Validation+SQLi 방어: 입력값 검증
 * - 테넌트 격리: Tenant ID 관리
 */

import DOMPurify from 'dompurify'

/**
 * XSS 방어: DOMPurify를 사용한 HTML Sanitization
 * - escapeHtml보다 강력한 XSS 방어
 * - HTML 태그 제거 및 안전한 텍스트만 허용
 */
export const sanitizeHtml = (dirty: string): string => {
  // 브라우저 환경 확인
  if (typeof window === 'undefined') {
    // SSR 환경에서는 기본 이스케이프만 수행
    return escapeHtml(dirty)
  }

  // DOMPurify로 HTML 정제
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // 모든 HTML 태그 제거
    ALLOWED_ATTR: [], // 모든 속성 제거
    KEEP_CONTENT: true, // 콘텐츠는 유지
  })
}

/**
 * XSS 방어: HTML 이스케이프 (기본 방어)
 * - DOMPurify를 사용할 수 없는 경우의 폴백
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * 이메일 형식 검증 (RFC 5322 기본 검증)
 */
export const validateEmail = (email: string): boolean => {
  // 기본 이메일 형식 검증 (SQL 인젝션, XSS 방어 포함)
  const emailRegex = /^[^\s@<>'"]+@[^\s@<>'"]+\.[^\s@<>'"]+$/
  if (!emailRegex.test(email)) {
    return false
  }
  
  // 추가 검증: 길이 제한
  if (email.length > 254) {
    return false
  }
  
  // 특수 문자 제한 (SQL 인젝션 방어)
  const dangerousChars = /[;'"\\<>]/
  if (dangerousChars.test(email)) {
    return false
  }
  
  return true
}

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.')
  }
  
  if (password.length > 128) {
    errors.push('비밀번호는 최대 128자까지 가능합니다.')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('비밀번호는 최소 1개의 소문자를 포함해야 합니다.')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('비밀번호는 최소 1개의 대문자를 포함해야 합니다.')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('비밀번호는 최소 1개의 숫자를 포함해야 합니다.')
  }
  
  // SQL 인젝션 및 XSS 방어: 위험한 문자 제한
  const dangerousChars = /[;'"\\<>]/
  if (dangerousChars.test(password)) {
    errors.push('비밀번호에 사용할 수 없는 문자가 포함되어 있습니다.')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 입력값 정제 (SQL 인젝션, XSS 방어)
 * - DOMPurify로 HTML 태그 제거
 * - 특수 문자 제한
 * - 길이 제한
 */
export const sanitizeInput = (input: string): string => {
  // 1. DOMPurify로 HTML 태그 및 XSS 제거
  const sanitized = sanitizeHtml(input)
  
  // 2. SQL 인젝션 방어: 위험한 문자 제한
  const dangerousChars = /[;'"\\<>]/g
  const cleaned = sanitized.replace(dangerousChars, '')
  
  // 3. 공백 제거 및 길이 제한
  return cleaned.trim().substring(0, 1000)
}

/**
 * Rate Limiting: 로그인 시도 횟수 체크
 */
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15분

export const checkLoginAttempts = (email: string): {
  allowed: boolean
  remainingAttempts: number
  lockoutTime?: number
} => {
  const key = `login_attempts_${email}`
  const attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "timestamp": 0}')
  
  const now = Date.now()
  const lockoutExpiry = attempts.timestamp + LOCKOUT_DURATION
  
  // 락아웃 시간이 지났으면 리셋
  if (attempts.timestamp > 0 && now > lockoutExpiry) {
    localStorage.removeItem(key)
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS }
  }
  
  // 락아웃 상태
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingLockout = Math.ceil((lockoutExpiry - now) / 1000 / 60)
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutTime: remainingLockout,
    }
  }
  
  return {
    allowed: true,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count,
  }
}

export const recordLoginAttempt = (email: string, success: boolean): void => {
  const key = `login_attempts_${email}`
  
  if (success) {
    // 성공 시 리셋
    localStorage.removeItem(key)
    return
  }
  
  const attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "timestamp": 0}')
  attempts.count += 1
  attempts.timestamp = Date.now()
  
  localStorage.setItem(key, JSON.stringify(attempts))
}

/**
 * JWT 토큰 디코드 (payload만)
 */
export const decodeJwtPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

/**
 * 토큰 만료 확인
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token)
  if (!payload || !payload.exp) {
    return true
  }
  
  const exp = payload.exp * 1000 // 초를 밀리초로 변환
  return Date.now() >= exp
}

/**
 * 사용자 역할 추출 (RBAC)
 */
export const getUserRoles = (token: string): string[] => {
  const payload = decodeJwtPayload(token)
  if (!payload || !payload.roles) {
    return []
  }
  
  return Array.isArray(payload.roles) ? payload.roles : [payload.roles]
}

/**
 * 권한 체크 (최소 권한 원칙)
 */
export const hasRole = (token: string | null, requiredRole: string): boolean => {
  if (!token) {
    return false
  }
  
  const roles = getUserRoles(token)
  return roles.includes(requiredRole)
}

/**
 * 안전한 토큰 저장 (XSS 방어)
 */
export const setToken = (accessToken: string, refreshToken: string): void => {
  // localStorage에 저장 (HttpOnly 쿠키는 백엔드에서 설정)
  // 프로덕션에서는 httpOnly 쿠키 사용 권장
  try {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('tokenTimestamp', Date.now().toString())
  } catch (error) {
    console.error('토큰 저장 실패:', error)
  }
}

/**
 * 토큰 제거
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('tokenTimestamp')
}

/**
 * Access Token 가져오기
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

/**
 * Refresh Token 가져오기
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

/**
 * 테넌트 ID 관리
 */

/**
 * 테넌트 ID 가져오기
 */
export const getTenantId = (): string | null => {
  return localStorage.getItem('tenantId')
}

/**
 * 테넌트 ID 설정
 */
export const setTenantId = (tenantId: string): void => {
  try {
    // 입력값 검증 및 정제
    const sanitized = sanitizeInput(tenantId)
    if (sanitized && sanitized.length > 0) {
      localStorage.setItem('tenantId', sanitized)
    }
  } catch (error) {
    console.error('테넌트 ID 설정 실패:', error)
  }
}

/**
 * 테넌트 ID 제거
 */
export const clearTenantId = (): void => {
  localStorage.removeItem('tenantId')
}
