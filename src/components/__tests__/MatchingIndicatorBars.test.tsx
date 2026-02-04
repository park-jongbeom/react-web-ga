import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchingIndicatorBars from '../MatchingIndicatorBars'

describe('MatchingIndicatorBars', () => {
  it('지표 라벨을 표시해야 한다', () => {
    render(
      <MatchingIndicatorBars
        scores={{ academicFit: 90, careerOutlook: 85, costEfficiency: 78 }}
      />
    )

    expect(screen.getByText('Academic Fit')).toBeInTheDocument()
    expect(screen.getByText('Career Outlook')).toBeInTheDocument()
    expect(screen.getByText('Cost Efficiency')).toBeInTheDocument()
  })

  it('점수를 퍼센트로 표시해야 한다', () => {
    render(
      <MatchingIndicatorBars
        scores={{ academicFit: 90, careerOutlook: 85, costEfficiency: 78 }}
      />
    )

    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('78%')).toBeInTheDocument()
  })
})
