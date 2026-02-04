import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import MatchingRadarChart from '../MatchingRadarChart'
import type { ScoreBreakdown } from '../../types/matching'

describe('MatchingRadarChart', () => {
  const mockScores: ScoreBreakdown = {
    academic: 90,
    english: 85,
    budget: 95,
    location: 88,
    duration: 92,
    career: 87,
  }

  it('Radar Chart를 렌더링해야 한다', () => {
    render(<MatchingRadarChart scores={mockScores} />)
    const container = document.querySelector('.recharts-responsive-container')
    expect(container).toBeInTheDocument()
  })
})
