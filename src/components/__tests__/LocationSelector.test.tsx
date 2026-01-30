import { render, screen, fireEvent } from '@testing-library/react'
import LocationSelector from '../LocationSelector'

describe('LocationSelector', () => {
  it('옵션이 렌더링되고 선택 변경이 가능하다', () => {
    const handleChange = vi.fn()
    render(
      <LocationSelector
        options={['California', 'New York']}
        selected={[]}
        onChange={handleChange}
      />
    )

    expect(screen.getByText('희망 지역 (복수 선택)')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('California'))

    expect(handleChange).toHaveBeenCalledWith(['California'])
  })
})
