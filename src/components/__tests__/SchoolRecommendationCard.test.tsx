import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SchoolRecommendationCard from '../SchoolRecommendationCard'
import type { MatchingResultItem } from '../../types/matching'

describe('SchoolRecommendationCard', () => {
  const mockItem: MatchingResultItem = {
    rank: 1,
    school: {
      id: 'school-1',
      name: 'California Career Institute',
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
    pros: ['높은 취업률', '저렴한 학비'],
    cons: ['경쟁률이 높음'],
  }

  it('학교 이름을 표시해야 한다', () => {
    render(<SchoolRecommendationCard item={mockItem} />)
    expect(screen.getByText('California Career Institute')).toBeInTheDocument()
  })

  it('매칭 점수를 표시해야 한다', () => {
    render(<SchoolRecommendationCard item={mockItem} />)
    expect(screen.getByText('95%')).toBeInTheDocument()
  })

  it('순위 배지를 표시해야 한다', () => {
    render(<SchoolRecommendationCard item={mockItem} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('위치 정보를 표시해야 한다', () => {
    render(<SchoolRecommendationCard item={mockItem} />)
    expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument()
  })

  it('추천 이유를 표시해야 한다', () => {
    render(<SchoolRecommendationCard item={mockItem} />)
    expect(screen.getByText('예산과 전공이 완벽하게 일치합니다.')).toBeInTheDocument()
  })

  it('장점을 표시해야 한다', () => {
    render(<SchoolRecommendationCard item={mockItem} />)
    expect(screen.getByText('높은 취업률')).toBeInTheDocument()
    expect(screen.getByText('저렴한 학비')).toBeInTheDocument()
  })
})
