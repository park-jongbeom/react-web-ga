import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MatchingResult from '../MatchingResult'
import type { MatchingResponse } from '../../types/matching'

vi.mock('../../components/MatchingRadarChart', () => ({
  default: () => <div>RadarChartMock</div>,
}))

const mockMatchingResult: MatchingResponse = {
  matching_id: 'test-matching-id',
  user_id: 'test-user-id',
  total_matches: 2,
  execution_time_ms: 2000,
  results: [
    {
      rank: 1,
      estimated_roi: 11.2,
      school: {
        id: 'school-1',
        name: 'Test School 1',
        type: 'Vocational',
        state: 'CA',
        city: 'Los Angeles',
        tuition: 20000,
        image_url: 'https://example.com/image.jpg',
        global_ranking: '#10',
        ranking_field: 'CS',
        average_salary: 72000,
        alumni_network_count: 15000,
        feature_badges: ['STEM', 'OPT'],
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
      explanation: '최적의 선택입니다.',
      pros: ['장점1'],
      cons: ['단점1'],
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
}

const renderWithRouter = (matchingResult?: MatchingResponse) =>
  render(
    <MemoryRouter
      initialEntries={[
        { pathname: '/matching/result', state: { matchingResult } },
      ]}
    >
      <Routes>
        <Route path="/matching/result" element={<MatchingResult />} />
      </Routes>
    </MemoryRouter>
  )

afterEach(() => {
  sessionStorage.clear()
})

describe('MatchingResult', () => {
  it('매칭 결과가 있을 때 리포트 헤더를 표시해야 한다', async () => {
    renderWithRouter(mockMatchingResult)

    await waitFor(() => {
      expect(screen.getByText('맞춤형 학업 리포트')).toBeInTheDocument()
    })
  })

  it('매칭 결과가 없을 때 에러 메시지를 표시해야 한다', async () => {
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText(/매칭 결과가 없습니다/i)).toBeInTheDocument()
    })
  })

  it('Executive Summary 섹션을 표시해야 한다', async () => {
    renderWithRouter(mockMatchingResult)

    await waitFor(() => {
      expect(screen.getByText('종합 요약')).toBeInTheDocument()
    })
  })

  it('Fallback 경고 메시지가 있을 때 표시해야 한다', async () => {
    const fallbackResult: MatchingResponse = {
      ...mockMatchingResult,
      message: 'DB에 데이터가 없어 API 정보만으로 생성한 추천입니다.',
    }

    renderWithRouter(fallbackResult)

    await waitFor(() => {
      expect(screen.getByText(/DB에 데이터가 없어/i)).toBeInTheDocument()
    })
  })

  it('Top Match 카드 정보를 렌더링해야 한다', async () => {
    renderWithRouter(mockMatchingResult)

    await waitFor(() => {
      expect(screen.getAllByText('Test School 1').length).toBeGreaterThan(0)
      expect(screen.getByText('95% 매칭')).toBeInTheDocument()
    })
  })

  it('핵심 섹션 타이틀을 표시해야 한다', async () => {
    renderWithRouter(mockMatchingResult)

    await waitFor(() => {
      expect(screen.getByText('매칭 지표')).toBeInTheDocument()
      expect(screen.getByText('심층 분석: 최고 추천 학교')).toBeInTheDocument()
      expect(screen.getByText('지원 방법: 다음 단계')).toBeInTheDocument()
      expect(screen.getByText('기밀 - 1/1 페이지')).toBeInTheDocument()
    })
  })
})
