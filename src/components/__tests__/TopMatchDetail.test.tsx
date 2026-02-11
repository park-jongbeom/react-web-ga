import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopMatchDetail from '../TopMatchDetail'
import type { MatchingResultItem } from '../../types/matching'

const itemWithExtras: MatchingResultItem = {
  rank: 1,
  school: {
    id: 'school-1',
    name: 'UC Berkeley',
    type: 'University',
    state: 'CA',
    city: 'Berkeley',
    tuition: 30000,
    image_url: 'https://example.com/image.jpg',
    global_ranking: '#4',
    ranking_field: 'Computer Science',
    average_salary: 85000,
    alumni_network_count: 38000,
    feature_badges: ['OPT STEM ELIGIBLE', 'ON-CAMPUS HOUSING'],
    employment_rate: 87.5,
    facilities: {
      dormitory: true,
      dining: true,
      gym: false,
      library: true,
      lab: false,
      entertainment: false,
    },
    esl_program: {
      available: true,
      description: '레벨별 과정 제공',
    },
  },
  program: {
    id: 'program-1',
    name: 'Computer Science',
    degree: 'Bachelor',
    duration: '4 years',
    opt_available: true,
  },
  total_score: 98,
  score_breakdown: {
    academic: 90,
    english: 88,
    budget: 92,
    location: 95,
    duration: 85,
    career: 91,
  },
  recommendation_type: 'optimal',
  explanation: '최적의 선택입니다.',
  pros: ['장점1'],
  cons: ['단점1'],
  estimated_roi: 12.5,
}

const itemWithNulls: MatchingResultItem = {
  rank: 1,
  school: {
    id: 'school-2',
    name: 'Unknown School',
    type: 'College',
    state: 'NY',
    city: 'New York',
    tuition: 25000,
    image_url: '',
    global_ranking: null,
    ranking_field: null,
    average_salary: null,
    alumni_network_count: null,
    feature_badges: [],
    employment_rate: null,
    facilities: null,
    esl_program: null,
  },
  program: {
    id: 'program-2',
    name: 'MBA',
    degree: 'Master',
    duration: '2 years',
    opt_available: false,
  },
  total_score: 80,
  score_breakdown: {
    academic: 75,
    english: 70,
    budget: 85,
    location: 80,
    duration: 82,
    career: 78,
  },
  recommendation_type: 'good',
  explanation: 'Good fit.',
  pros: [],
  cons: [],
}

describe('TopMatchDetail', () => {
  it('1위 상세 정보를 API 데이터로 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithExtras} />)

    expect(screen.getAllByText('UC Berkeley').length).toBeGreaterThan(0)
    expect(screen.getByText(/예상 ROI 12\.5%.*연간/)).toBeInTheDocument()
    expect(screen.getByText('평균 초봉')).toBeInTheDocument()
    expect(screen.getByText('$85,000')).toBeInTheDocument()
    expect(screen.getByText(/글로벌 랭킹/)).toBeInTheDocument()
    expect(screen.getByText(/#4 \(Computer Science\)/)).toBeInTheDocument()
    expect(screen.getByText('동문 네트워크')).toBeInTheDocument()
    expect(screen.getByText('38,000+')).toBeInTheDocument()
    expect(screen.getByText('취업률')).toBeInTheDocument()
    expect(screen.getByText('87.5%')).toBeInTheDocument()
    expect(screen.getByText('기숙사')).toBeInTheDocument()
    expect(screen.getAllByText('제공').length).toBeGreaterThan(0)
    expect(screen.getByText('ESL 프로그램')).toBeInTheDocument()
  })

  it('배지와 버튼을 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithExtras} />)

    expect(screen.getByText('최우선 추천')).toBeInTheDocument()
    expect(screen.getByText('PDF 리포트 다운로드')).toBeInTheDocument()
    expect(screen.getByText('OPT STEM ELIGIBLE')).toBeInTheDocument()
    expect(screen.getByText('ON-CAMPUS HOUSING')).toBeInTheDocument()
  })

  it('확장 필드가 null일 때 N/A 등 기본값을 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithNulls} />)

    expect(screen.getAllByText('Unknown School').length).toBeGreaterThan(0)
    expect(screen.getByText(/예상 ROI .*연간/)).toBeInTheDocument()
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0)
  })

  it('AI 추천 이유를 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithExtras} />)

    expect(screen.getByText('추천 이유')).toBeInTheDocument()
    expect(screen.getByText('최적의 선택입니다.')).toBeInTheDocument()
  })

  it('장점과 유의 사항을 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithExtras} />)

    expect(screen.getByText('장점')).toBeInTheDocument()
    expect(screen.getByText('장점1')).toBeInTheDocument()
    expect(screen.getByText('유의 사항')).toBeInTheDocument()
    expect(screen.getByText('단점1')).toBeInTheDocument()
  })

  it('장점/유의사항이 비어있으면 해당 섹션을 숨겨야 한다', () => {
    render(<TopMatchDetail item={itemWithNulls} />)

    expect(screen.queryByText('장점')).not.toBeInTheDocument()
    expect(screen.queryByText('유의 사항')).not.toBeInTheDocument()
  })
})
