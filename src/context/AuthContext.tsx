/**
 * 인증 Context
 * 
 * 보안 원칙:
 * - Access Token 메모리 관리: localStorage 대신 메모리/상태 관리
 * - 테넌트 격리: X-Tenant-ID 관리
 * - 전역 인증 상태 관리
 * - 최소 권한 원칙
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getAccessToken, getRefreshToken, clearTokens as clearTokensUtil, setToken as setTokenUtil, decodeJwtPayload } from '../utils/security'

interface User {
  id: string
  email: string
  roles: string[]
  tenantId?: string
}

interface AuthContextType {
  // 인증 상태
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  
  // 테넌트 정보
  tenantId: string | null
  
  // 메서드
  setAuth: (accessToken: string, refreshToken: string, user?: User) => void
  clearAuth: () => void
  setTenantId: (tenantId: string) => void
  hasRole: (role: string) => boolean
  refreshAccessToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Access Token은 메모리에만 저장 (보안 강화)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [tenantId, setTenantIdState] = useState<string | null>(() => {
    // 초기 로드 시 localStorage에서 테넌트 ID 가져오기
    return localStorage.getItem('tenantId')
  })

  // 초기 로드 시 토큰 복원 (메모리로)
  // Access Token만 있어도 복원 (백엔드가 단일 토큰만 반환하는 경우 대응)
  useEffect(() => {
    const storedAccessToken = getAccessToken()
    
    if (storedAccessToken) {
      // 토큰 유효성 검증
      try {
        const payload = decodeJwtPayload(storedAccessToken)
        if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
          // 토큰이 유효하면 메모리에 로드
          setAccessToken(storedAccessToken)
          
          // 사용자 정보 추출 (JWT payload 구조는 백엔드마다 상이할 수 있음)
          const userData: User = {
            id: payload.sub || payload.userId || payload.id || '',
            email: payload.email || '',
            roles: payload.roles ? (Array.isArray(payload.roles) ? payload.roles : [payload.roles]) : [],
            tenantId: payload.tenantId || tenantId || null,
          }
          setUser(userData)
          
          // 테넌트 ID 설정
          if (payload.tenantId && !tenantId) {
            setTenantIdState(payload.tenantId)
            localStorage.setItem('tenantId', payload.tenantId)
          }
        } else {
          // 토큰이 만료되었으면 제거
          clearTokensUtil()
        }
      } catch (error) {
        // 토큰 파싱 실패 시 제거
        clearTokensUtil()
      }
    }
  }, [])

  /**
   * 인증 정보 설정
   * - Access Token: 메모리에만 저장
   * - Refresh Token: localStorage에 저장 (백엔드에서 HttpOnly 쿠키로 전환 예정)
   */
  const setAuth = useCallback((newAccessToken: string, newRefreshToken: string, userData?: User) => {
    // Access Token은 메모리에만 저장
    setAccessToken(newAccessToken)
    
    // Refresh Token은 localStorage에 저장 (추후 HttpOnly 쿠키로 변경)
    // Access Token도 일시적으로 localStorage에 저장 (새로고침 대비)
    // 프로덕션에서는 백엔드가 HttpOnly 쿠키로 Refresh Token을 제공하도록 변경 필요
    setTokenUtil(newAccessToken, newRefreshToken)
    
    // 사용자 정보 설정
    if (userData) {
      setUser(userData)
      
      // 테넌트 ID 설정
      if (userData.tenantId) {
        setTenantIdState(userData.tenantId)
        localStorage.setItem('tenantId', userData.tenantId)
      }
    } else {
      // 토큰에서 사용자 정보 추출
      try {
        const payload = decodeJwtPayload(newAccessToken)
        if (payload) {
          const extractedUser: User = {
            id: payload.sub || payload.userId || '',
            email: payload.email || '',
            roles: payload.roles ? (Array.isArray(payload.roles) ? payload.roles : [payload.roles]) : [],
            tenantId: payload.tenantId || tenantId || null,
          }
          setUser(extractedUser)
          
          if (extractedUser.tenantId) {
            setTenantIdState(extractedUser.tenantId)
            localStorage.setItem('tenantId', extractedUser.tenantId)
          }
        }
      } catch (error) {
        console.error('토큰에서 사용자 정보 추출 실패:', error)
      }
    }
  }, [tenantId])

  /**
   * 인증 정보 제거
   */
  const clearAuth = useCallback(() => {
    setAccessToken(null)
    setUser(null)
    clearTokensUtil()
    // 테넌트 ID는 유지 (선택적)
    // localStorage.removeItem('tenantId')
  }, [])

  /**
   * 테넌트 ID 설정
   */
  const setTenantId = useCallback((newTenantId: string) => {
    setTenantIdState(newTenantId)
    localStorage.setItem('tenantId', newTenantId)
  }, [])

  /**
   * 권한 체크 (RBAC)
   * - 최소 권한 원칙 적용
   */
  const hasRole = useCallback((role: string): boolean => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false
    }
    return user.roles.includes(role)
  }, [user])

  /**
   * Access Token 갱신
   * - Refresh Token을 사용하여 자동 갱신
   */
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearAuth()
        return false
      }

      // 백엔드에 토큰 갱신 요청
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // 새 토큰으로 인증 정보 업데이트
          setAuth(data.data.accessToken, data.data.refreshToken)
          return true
        }
      }

      // 갱신 실패 시 인증 정보 제거
      clearAuth()
      return false
    } catch (error) {
      console.error('토큰 갱신 실패:', error)
      clearAuth()
      return false
    }
  }, [setAuth, clearAuth])

  const value: AuthContextType = {
    isAuthenticated: !!accessToken && !!user,
    user,
    accessToken,
    tenantId,
    setAuth,
    clearAuth,
    setTenantId,
    hasRole,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Auth Context Hook
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
