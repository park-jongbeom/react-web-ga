import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runMatching, getMatchingResult } from '../MatchingService'
import { matchingApi } from '../axiosInstance'
import type { ApiResponse } from '../../types/api'
import type { MatchingResponse } from '../../types/matching'

vi.mock('../axiosInstance', () => ({
  matchingApi: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('MatchingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('매칭 실행 성공 시 MatchingResponse를 반환해야 한다', async () => {
    const mockResponse: ApiResponse<MatchingResponse> = {
      success: true,
      data: {
        matching_id: 'test-matching-id',
        user_id: 'test-user-id',
        total_matches: 1,
        execution_time_ms: 2000,
        results: [
          {
            rank: 1,
            school: {
              id: 'school-1',
              name: 'Test School',
              type: 'Vocational',
              state: 'CA',
              city: 'Los Angeles',
              tuition: 20000,
              image_url: 'https://example.com/image.jpg',
            },
            program: {
              id: 'program-1',
              name: 'Computer Science',
              degree: 'Associate',
              duration: '2 years',
              opt_available: true,
            },
            total_score: 95,
            score_breakdown: {
              academic: 90,
              english: 85,
              budget: 95,
              location: 100,
              duration: 88,
              career: 92,
            },
            recommendation_type: 'optimal',
            explanation: '예산과 전공이 완벽하게 일치합니다.',
            pros: ['높은 취업률'],
            cons: ['경쟁률이 높음'],
          },
        ],
        created_at: '2024-01-01T00:00:00Z',
      },
      message: null,
      timestamp: '2024-01-01T00:00:00Z',
    }

    vi.mocked(matchingApi.post).mockResolvedValue({ data: mockResponse })

    const result = await runMatching('test-user-id')

    expect(matchingApi.post).toHaveBeenCalledWith('/api/v1/matching/run', {
      user_id: 'test-user-id',
    })
    expect(result.total_matches).toBe(1)
    expect(result.results[0].school.name).toBe('Test School')
  })

  it('매칭 실행 실패 시 에러를 던져야 한다', async () => {
    const mockResponse: ApiResponse<MatchingResponse> = {
      success: false,
      data: null,
      message: '매칭 실행 실패',
      timestamp: '2024-01-01T00:00:00Z',
    }

    vi.mocked(matchingApi.post).mockResolvedValue({ data: mockResponse })

    await expect(runMatching('test-user-id')).rejects.toThrow('매칭 실행 실패')
  })

  it('최신 매칭 결과 조회 성공 시 데이터를 반환해야 한다', async () => {
    const mockResponse: ApiResponse<MatchingResponse> = {
      success: true,
      data: {
        matching_id: 'test-matching-id',
        user_id: 'test-user-id',
        total_matches: 0,
        execution_time_ms: 1500,
        results: [],
        created_at: '2024-01-01T00:00:00Z',
      },
      message: null,
      timestamp: '2024-01-01T00:00:00Z',
    }

    vi.mocked(matchingApi.get).mockResolvedValue({ data: mockResponse })

    const result = await getMatchingResult()

    expect(matchingApi.get).toHaveBeenCalledWith('/api/v1/matching/result')
    expect(result.total_matches).toBe(0)
  })
})
