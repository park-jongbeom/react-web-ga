import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Signup from '../Signup'

describe('Signup 페이지', () => {
  it('회원가입 제목과 폼이 렌더링된다', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    )

    expect(screen.getByText('새 계정 만들기')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일 주소')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })
})
