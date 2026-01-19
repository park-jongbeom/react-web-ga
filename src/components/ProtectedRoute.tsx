/**
 * Protected Route 컴포넌트
 * 
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 
 * 보안 원칙:
 * - AuthN: 인증 확인 (Context 기반)
 * - AuthZ: 권한 확인 (RBAC)
 * - 최소 권한: 필요한 권한만 확인
 * - 테넌트 격리: 테넌트 정보 확인
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isTokenExpired } from '../utils/security'
import { logUnauthorizedAccess } from '../api/AuditService'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, accessToken, tenantId, refreshAccessToken } = useAuth()
  const location = useLocation()

  // 토큰 만료 확인 및 자동 갱신
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        // 토큰이 만료되었으면 갱신 시도
        await refreshAccessToken()
      }
    }

    checkAndRefreshToken()
  }, [accessToken, refreshAccessToken])

  // 인증 확인 (Context 기반)
  if (!isAuthenticated || !user || !accessToken) {
    // 현재 경로를 state로 전달하여 로그인 후 복귀 가능하도록
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 토큰 만료 확인
  if (isTokenExpired(accessToken)) {
    // 만료된 토큰이면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 권한 확인 (RBAC) - 최소 권한 원칙
  if (requiredRole) {
    if (!user.roles || !user.roles.includes(requiredRole)) {
      // 권한 없음: Audit Log 기록
      logUnauthorizedAccess(
        location.pathname,
        undefined, // resourceId
        user.id,
        tenantId || undefined,
        {
          requiredRole,
          userRoles: user.roles,
        }
      )

      // 권한 없음 페이지로 리다이렉트
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
