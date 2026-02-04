/**
 * 매칭 API 클라이언트
 *
 * 보안 원칙:
 * - AuthN/AuthZ: JWT 기반 인증 (Authorization 헤더)
 * - 에러 노출 차단: 일반화된 메시지 사용
 * - 테넌트 격리: 필요 시 X-Tenant-ID 자동 주입
 */

import { matchingApi } from './axiosInstance'
import type { ApiResponse } from '../types/api'
import type { MatchingResponse, MatchingRunRequest } from '../types/matching'

/**
 * 매칭 실행
 * - POST /api/v1/matching/run
 */
export const runMatching = async (userId: string): Promise<MatchingResponse> => {
  const payload: MatchingRunRequest = { user_id: userId }
  const response = await matchingApi.post<ApiResponse<MatchingResponse>>(
    '/api/v1/matching/run',
    payload
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '매칭 실행에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 최신 매칭 결과 조회
 * - GET /api/v1/matching/result
 * - local/lightsail 프로파일에서는 아직 미구현일 수 있음
 */
export const getMatchingResult = async (): Promise<MatchingResponse> => {
  const response = await matchingApi.get<ApiResponse<MatchingResponse>>(
    '/api/v1/matching/result'
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '매칭 결과를 불러올 수 없습니다.')
  }

  return response.data.data
}
