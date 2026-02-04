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
    expect(screen.getByText('EST. ROI 12.5% Yearly')).toBeInTheDocument()
    expect(screen.getByText('Average Starting Salary')).toBeInTheDocument()
    expect(screen.getByText('$85,000')).toBeInTheDocument()
    expect(screen.getByText(/Global Ranking/)).toBeInTheDocument()
    expect(screen.getByText(/#4 \(Computer Science\)/)).toBeInTheDocument()
    expect(screen.getByText('Alumni Network')).toBeInTheDocument()
    expect(screen.getByText('38,000+')).toBeInTheDocument()
  })

  it('배지와 버튼을 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithExtras} />)

    expect(screen.getByText('Primary Recommendation')).toBeInTheDocument()
    expect(screen.getByText('Download PDF Report')).toBeInTheDocument()
    expect(screen.getByText('OPT STEM ELIGIBLE')).toBeInTheDocument()
    expect(screen.getByText('ON-CAMPUS HOUSING')).toBeInTheDocument()
  })

  it('확장 필드가 null일 때 N/A 등 기본값을 표시해야 한다', () => {
    render(<TopMatchDetail item={itemWithNulls} />)

    expect(screen.getAllByText('Unknown School').length).toBeGreaterThan(0)
    expect(screen.getByText(/EST\. ROI .* Yearly/)).toBeInTheDocument()
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0)
  })
})
