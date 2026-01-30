import { render, screen, fireEvent } from '@testing-library/react'
import SignupForm from '../SignupForm'

describe('SignupForm', () => {
  it('회원가입 입력 필드와 버튼이 렌더링된다', () => {
    render(<SignupForm />)

    expect(screen.getByLabelText('이메일 주소')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  it('입력값을 제출하면 onSubmit이 호출된다', () => {
    const handleSubmit = vi.fn()
    render(<SignupForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText('이메일 주소'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'Password123' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), {
      target: { value: 'Password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: '회원가입' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123',
      passwordConfirm: 'Password123',
    })
  })
})
