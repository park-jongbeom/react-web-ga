/**
 * Audit Service
 * 
 * 보안 원칙:
 * - AuditLog: 모든 주요 인터랙션 기록
 * - Action, UserID, Timestamp 포함
 * - 민감한 정보 필터링
 * - 비동기 처리 (앱 동작에 영향 없음)
 */

import { auditApi } from './axiosInstance'
import type { ApiResponse } from '../types/api'

/**
 * Audit Action 타입
 */
export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}

/**
 * Audit Log 요청 데이터
 */
export interface AuditLogRequest {
  action: AuditAction
  userId?: string
  tenantId?: string
  resource?: string
  resourceId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp?: string
}

/**
 * Audit Log 응답
 */
export interface AuditLogResponse {
  id: string
  action: AuditAction
  userId?: string
  tenantId?: string
  timestamp: string
}

/**
 * 민감한 정보 필터링
 * - 비밀번호, 토큰 등 민감한 정보 제거
 */
const sanitizeMetadata = (metadata: Record<string, any>): Record<string, any> => {
  const sanitized = { ...metadata }
  
  // 민감한 필드 제거
  const sensitiveFields = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'authorization',
  ]
  
  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      delete sanitized[field]
    }
  })
  
  return sanitized
}

/**
 * Audit Log 전송
 * 
 * @param request Audit Log 요청 데이터
 * @returns 성공 여부
 */
export const logAuditEvent = async (
  request: AuditLogRequest
): Promise<boolean> => {
  try {
    // 민감한 정보 필터링
    const sanitizedRequest: AuditLogRequest = {
      ...request,
      metadata: request.metadata ? sanitizeMetadata(request.metadata) : undefined,
      timestamp: request.timestamp || new Date().toISOString(),
      userAgent: request.userAgent || navigator.userAgent,
      // IP 주소는 백엔드에서 추출하는 것이 일반적이지만, 클라이언트에서도 가능하면 포함
      // ipAddress: request.ipAddress || await getClientIP(),
    }

    // Audit API로 전송
    await auditApi.post<ApiResponse<AuditLogResponse>>('/logs', sanitizedRequest, {
      timeout: 5000, // 타임아웃 설정 (Audit Log는 앱 동작에 영향 없어야 함)
    })

    return true
  } catch (error) {
    // Audit Log 실패 시에도 앱 동작에 영향 없음
    // 개발 환경에서만 로그 출력
    if (import.meta.env.DEV) {
      console.warn('Audit Log 전송 실패:', error)
    }
    return false
  }
}

/**
 * 로그인 성공 Audit Log
 */
export const logLoginSuccess = async (
  userId: string,
  email: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAuditEvent({
    action: AuditAction.LOGIN_SUCCESS,
    userId,
    tenantId,
    resource: 'auth',
    resourceId: 'login',
    metadata: {
      email,
      ...metadata,
    },
  })
}

/**
 * 로그인 실패 Audit Log
 */
export const logLoginFailure = async (
  email: string,
  reason?: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAuditEvent({
    action: AuditAction.LOGIN_FAILURE,
    tenantId,
    resource: 'auth',
    resourceId: 'login',
    metadata: {
      email,
      reason,
      ...metadata,
    },
  })
}

/**
 * 로그아웃 Audit Log
 */
export const logLogout = async (
  userId: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAuditEvent({
    action: AuditAction.LOGOUT,
    userId,
    tenantId,
    resource: 'auth',
    resourceId: 'logout',
    metadata,
  })
}

/**
 * 토큰 갱신 Audit Log
 */
export const logTokenRefresh = async (
  userId: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAuditEvent({
    action: AuditAction.TOKEN_REFRESH,
    userId,
    tenantId,
    resource: 'auth',
    resourceId: 'refresh',
    metadata,
  })
}

/**
 * 무단 접근 시도 Audit Log
 */
export const logUnauthorizedAccess = async (
  resource: string,
  resourceId?: string,
  userId?: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAuditEvent({
    action: AuditAction.UNAUTHORIZED_ACCESS,
    userId,
    tenantId,
    resource,
    resourceId,
    metadata: {
      ...metadata,
      path: window.location.pathname,
    },
  })
}

/**
 * 범용 리소스 액션 Audit Log
 */
export const logResourceAction = async (
  action: AuditAction.CREATE | AuditAction.UPDATE | AuditAction.DELETE | AuditAction.READ,
  resource: string,
  resourceId: string,
  userId: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAuditEvent({
    action,
    userId,
    tenantId,
    resource,
    resourceId,
    metadata,
  })
}
