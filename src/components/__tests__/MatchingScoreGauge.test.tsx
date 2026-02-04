import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchingScoreGauge from '../MatchingScoreGauge'

describe('MatchingScoreGauge', () => {
  it('매칭 점수를 표시해야 한다', () => {
    render(<MatchingScoreGauge score={87} />)
    expect(screen.getByText('87%')).toBeInTheDocument()
  })

  it('전체 매칭률 라벨을 표시해야 한다', () => {
    render(<MatchingScoreGauge score={75} />)
    expect(screen.getByText('전체 매칭률')).toBeInTheDocument()
  })

  it('80점 이상은 성공 색상이어야 한다', () => {
    const { container } = render(<MatchingScoreGauge score={85} />)
    const scoreElement = container.querySelector('.text-success-600')
    expect(scoreElement).toBeInTheDocument()
  })

  it('60-79점은 경고 색상이어야 한다', () => {
    const { container } = render(<MatchingScoreGauge score={70} />)
    const scoreElement = container.querySelector('.text-warning-600')
    expect(scoreElement).toBeInTheDocument()
  })

  it('60점 미만은 위험 색상이어야 한다', () => {
    const { container } = render(<MatchingScoreGauge score={50} />)
    const scoreElement = container.querySelector('.text-danger-600')
    expect(scoreElement).toBeInTheDocument()
  })
})
