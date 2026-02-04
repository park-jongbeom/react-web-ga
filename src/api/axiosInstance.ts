/**
 * Axios 인스턴스 설정
 * 
 * 보안 원칙:
 * - CORS/Preflight: Vite 프록시 활용
 * - CSRF 방어: X-XSRF-TOKEN 헤더 처리
 * - X-Tenant-ID 헤더 자동 주입 (테넌트 격리)
 * - 401 에러 시 자동 토큰 갱신
 * - 에러 노출 차단: 일반화된 에러 메시지
 */

import axios, { type AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// API Base URL (고정)
const API_BASE_URL = 'https://go-almond.ddnsfree.com'
const AUTH_API_BASE = `${API_BASE_URL}/api/v1/auth`
const USER_API_BASE = `${API_BASE_URL}/api/v1/user`
const MATCHING_API_BASE = `${API_BASE_URL}`
const AUDIT_API_BASE = `${API_BASE_URL}/api/audit`

// 전역 토큰 갱신 플래그 (무한 루프 방지)
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
}> = []

/**
 * Access Token 가져오기
 * - 메모리 우선, localStorage 폴백
 */
const getAccessToken = (): string | null => {
  // TODO: AuthContext에서 메모리 토큰을 가져올 수 있도록 전역 참조 추가
  // 현재는 localStorage에서 가져옴 (Step 11에서 Context 통합 시 개선)
  return localStorage.getItem('accessToken')
}

/**
 * Refresh Token 가져오기
 */
const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

/**
 * Tenant ID 가져오기
 */
const getTenantId = (): string | null => {
  return localStorage.getItem('tenantId')
}

/**
 * 토큰 저장 (메모리 + localStorage)
 */
const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token)
  // TODO: AuthContext의 메모리 상태도 업데이트 (Step 11에서 구현)
}

/**
 * 에러 메시지 마스킹 (보안: 상세 정보 노출 방지)
 */
const maskError = (error: AxiosError): AxiosError => {
  // 원본 에러는 보존하되, 응답 데이터는 일반화
  if (error.response?.data) {
    const originalData = error.response.data
    error.response.data = {
      success: false,
      message: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      timestamp: new Date().toISOString(),
      // 개발 환경에서만 상세 정보 포함
      ...(import.meta.env.DEV && { originalError: originalData }),
    }
  }
  return error
}

/**
 * 테넌트 필수 API 경로 목록
 * - 이 경로들은 반드시 Tenant ID가 있어야 함
 */
const TENANT_REQUIRED_PATHS = [
  '/api/v1/user',  // 모든 User API는 테넌트 필수
  '/api/audit', // 모든 Audit API는 테넌트 필수
  '/api/v1/auth/refresh', // 토큰 갱신은 테넌트 필수
  '/api/v1/auth/logout', // 로그아웃은 테넌트 필수
]

/**
 * 경로가 테넌트 필수인지 확인
 */
const isTenantRequired = (url: string): boolean => {
  // baseURL이 포함된 전체 URL에서 경로만 추출
  const path = url.startsWith('http') 
    ? new URL(url).pathname 
    : url
  
  return TENANT_REQUIRED_PATHS.some(requiredPath => 
    path.startsWith(requiredPath)
  )
}

/**
 * 공통 interceptor 설정 함수
 */
const setupInterceptors = (instance: AxiosInstance, requireTenant: boolean = false) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 1. Access Token 주입
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 2. X-Tenant-ID 헤더 자동 주입 (테넌트 격리)
      const tenantId = getTenantId()
      const url = config.url || ''
      const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url
      
      // 테넌트 필수 여부 확인
      const tenantRequired = requireTenant || isTenantRequired(fullUrl)
      
      if (tenantRequired && !tenantId) {
        // 테넌트 필수 API인데 Tenant ID가 없으면 요청 거부
        const error = new Error('Tenant ID is required for this request')
        return Promise.reject(error)
      }
      
      if (tenantId && config.headers) {
        config.headers['X-Tenant-ID'] = tenantId
      }

      // 3. CSRF 방어: X-XSRF-TOKEN 헤더 (쿠키에서 읽어서 설정)
      // 백엔드에서 CSRF 비활성화되어 있으나 표준 준수
      if (config.headers && typeof document !== 'undefined') {
        const xsrfToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1]
        
        if (xsrfToken) {
          config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(maskError(error))
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // 401 에러 처리: 자동 토큰 갱신
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // 이미 갱신 중이면 대기
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => {
              // 토큰 갱신 후 원래 요청 재시도
              const token = getAccessToken()
              if (originalRequest.headers && token) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return instance(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          // Refresh Token이 없으면 로그아웃
          clearAuth()
          return Promise.reject(maskError(error))
        }

        try {
          // 토큰 갱신 요청
          const response = await axios.post(
            `${AUTH_API_BASE}/refresh`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          if (response.data?.success && response.data?.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data
            
            // 새 토큰 저장
            setAccessToken(accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)
            
            // 대기 중인 요청 처리
            failedQueue.forEach((prom) => {
              prom.resolve()
            })
            failedQueue = []
            isRefreshing = false

            // 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }
            return instance(originalRequest)
          } else {
            throw new Error('Token refresh failed')
          }
        } catch (refreshError) {
          // 토큰 갱신 실패
          failedQueue.forEach((prom) => {
            prom.reject(refreshError)
          })
          failedQueue = []
          isRefreshing = false

          clearAuth()
          return Promise.reject(maskError(error))
        }
      }

      // 기타 에러는 마스킹 후 반환
      return Promise.reject(maskError(error))
    }
  )
}

/**
 * 인증 정보 제거
 */
const clearAuth = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('tokenTimestamp')
  
  // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인 페이지가 아닌 경우)
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/login'
  }
}

// Auth API 인스턴스
export const authApi = axios.create({
  baseURL: AUTH_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  // 토큰 기반 인증 사용 (쿠키 불필요)
  withCredentials: false,
  timeout: 10000,
})

// User API 인스턴스
export const userApi = axios.create({
  baseURL: USER_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
})

// Audit API 인스턴스
export const auditApi = axios.create({
  baseURL: AUDIT_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 5000, // Audit Log는 짧은 타임아웃
})

// Matching API 인스턴스
export const matchingApi = axios.create({
  baseURL: MATCHING_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 15000, // 매칭은 상대적으로 시간이 길 수 있음
})

// 모든 인스턴스에 interceptor 설정
// - authApi: 일부 엔드포인트는 테넌트 선택적 (login, register)
// - userApi: 모든 엔드포인트는 테넌트 필수
// - auditApi: 모든 엔드포인트는 테넌트 필수
setupInterceptors(authApi, false) // 경로별로 자동 판단
setupInterceptors(userApi, true)  // 모든 요청에 테넌트 필수
setupInterceptors(auditApi, true) // 모든 요청에 테넌트 필수
setupInterceptors(matchingApi, false)
