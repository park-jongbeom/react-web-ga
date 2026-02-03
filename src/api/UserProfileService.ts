/**
 * 사용자 프로필 저장 API 클라이언트
 *
 * 보안 원칙:
 * - Validation+SQLi 방어: 입력값 검증은 호출부에서 수행
 * - 에러 노출 차단: 상세 에러는 호출부에서 일반화 처리
 */

import { userApi } from './axiosInstance'
import type {
  ApiResponse,
  UserEducationRequest,
  UserPreferenceRequest,
  UserProfileRequest,
} from '../types/api'
import { withRetry } from '../utils/retry'

export const saveUserProfile = async (
  payload: UserProfileRequest
): Promise<ApiResponse<unknown>> => {
  return withRetry(async () => {
    const response = await userApi.put<ApiResponse<unknown>>(
      '/api/v1/user/profile',
      payload
    )
    return response.data
  })
}

export const saveUserEducation = async (
  payload: UserEducationRequest
): Promise<ApiResponse<unknown>> => {
  return withRetry(async () => {
    const response = await userApi.post<ApiResponse<unknown>>(
      '/api/v1/user/education',
      payload
    )
    return response.data
  })
}

export const saveUserPreference = async (
  payload: UserPreferenceRequest
): Promise<ApiResponse<unknown>> => {
  return withRetry(async () => {
    const response = await userApi.post<ApiResponse<unknown>>(
      '/api/v1/user/preference',
      payload
    )
    return response.data
  })
}
