import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Signup from '../Signup'
import * as AuthService from '../../api/AuthService'

vi.mock('../../api/AuthService', () => ({
  register: vi.fn(),
}))

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

  it('회원가입 제출 시 register API를 호출한다', async () => {
    const registerMock = vi.mocked(AuthService.register)
    registerMock.mockResolvedValue({
      success: false,
      error: '테스트용 실패',
    })

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('이메일 주소'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'Password123' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), {
      target: { value: 'Password123' },
    })

    fireEvent.submit(screen.getByRole('button', { name: '회원가입' }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith(
        'test@example.com',
        'Password123',
        'Password123'
      )
    })
  })
})
