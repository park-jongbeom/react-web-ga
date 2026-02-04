import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopMatchDetail from '../TopMatchDetail'
import type { MatchingResultItem, TopMatchExtras } from '../../types/matching'

const item: MatchingResultItem = {
  rank: 1,
  school: {
    id: 'school-1',
    name: 'UC Berkeley',
    type: 'University',
    state: 'CA',
    city: 'Berkeley',
    tuition: 30000,
    image_url: 'https://example.com/image.jpg',
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
}

const extras: TopMatchExtras = {
  estimatedRoi: '12.5%',
  averageSalary: '$85,000',
  globalRanking: '#4 (Computer Science)',
  alumniNetwork: '38,000+',
  featureBadges: ['OPT STEM ELIGIBLE', 'ON-CAMPUS HOUSING'],
}

describe('TopMatchDetail', () => {
  it('1위 상세 정보를 표시해야 한다', () => {
    render(<TopMatchDetail item={item} extras={extras} />)

    expect(screen.getAllByText('UC Berkeley').length).toBeGreaterThan(0)
    expect(screen.getByText('EST. ROI 12.5% Yearly')).toBeInTheDocument()
    expect(screen.getByText('Average Starting Salary')).toBeInTheDocument()
    expect(screen.getByText('$85,000')).toBeInTheDocument()
    expect(screen.getByText(/Global Ranking/)).toBeInTheDocument()
    expect(screen.getByText(/#4/)).toBeInTheDocument()
    expect(screen.getByText('Alumni Network')).toBeInTheDocument()
    expect(screen.getByText('38,000+')).toBeInTheDocument()
  })

  it('배지와 버튼을 표시해야 한다', () => {
    render(<TopMatchDetail item={item} extras={extras} />)

    expect(screen.getByText('Primary Recommendation')).toBeInTheDocument()
    expect(screen.getByText('Download PDF Report')).toBeInTheDocument()
    expect(screen.getByText('OPT STEM ELIGIBLE')).toBeInTheDocument()
    expect(screen.getByText('ON-CAMPUS HOUSING')).toBeInTheDocument()
  })
})
