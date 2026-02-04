import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopMatchCard from '../TopMatchCard'
import type { MatchingResultItem } from '../../types/matching'

const baseItem: MatchingResultItem = {
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

describe('TopMatchCard', () => {
  it('1위 카드에서 강조 배지와 문구를 표시해야 한다', () => {
    const { container } = render(<TopMatchCard item={baseItem} isPrimary />)

    expect(screen.getByText('98% 매칭')).toBeInTheDocument()
    expect(screen.getByText('1순위 추천')).toBeInTheDocument()
    expect(container.querySelector('.border-primary-600')).toBeInTheDocument()
  })

  it('2-3위 카드에서 기본 문구를 표시해야 한다', () => {
    const secondItem = { ...baseItem, rank: 2, total_score: 92 }
    const { container } = render(<TopMatchCard item={secondItem} isPrimary={false} />)

    expect(screen.getByText('92% 매칭')).toBeInTheDocument()
    expect(container.querySelector('.border-border')).toBeInTheDocument()
  })
})
