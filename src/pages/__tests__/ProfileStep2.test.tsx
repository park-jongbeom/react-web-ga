import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfileStep2 from '../ProfileStep2'

describe('ProfileStep2', () => {
  it('이전/다음 버튼이 렌더링된다', () => {
    render(
      <MemoryRouter>
        <ProfileStep2 />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument()
  })
})
