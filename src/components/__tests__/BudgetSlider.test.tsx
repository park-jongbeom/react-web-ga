import { render, screen, fireEvent } from '@testing-library/react'
import BudgetSlider from '../BudgetSlider'

describe('BudgetSlider', () => {
  it('슬라이더 값과 라벨이 렌더링된다', () => {
    render(<BudgetSlider value={50000} onChange={() => {}} />)

    expect(screen.getByText('연간 예산 범위')).toBeInTheDocument()
    expect(screen.getByText('$50,000')).toBeInTheDocument()
  })

  it('슬라이더 변경 시 onChange가 호출된다', () => {
    const handleChange = vi.fn()
    render(<BudgetSlider value={50000} onChange={handleChange} />)

    fireEvent.change(screen.getByRole('slider'), { target: { value: '60000' } })

    expect(handleChange).toHaveBeenCalledWith(60000)
  })
})
