import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '../LoginForm'

describe('LoginForm', () => {
  it('로그인 입력 필드와 버튼이 렌더링된다', () => {
    render(
      <LoginForm
        email=""
        password=""
        errors={{}}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByLabelText('이메일 주소')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('제출 시 onSubmit이 호출된다', () => {
    const handleSubmit = vi.fn()
    render(
      <LoginForm
        email="user@example.com"
        password="Password123"
        errors={{}}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onSubmit={handleSubmit}
        canSubmit
      />
    )

    fireEvent.submit(screen.getByRole('button', { name: '로그인' }))

    expect(handleSubmit).toHaveBeenCalled()
  })
})
