import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfileStep1 from '../ProfileStep1'

describe('ProfileStep1', () => {
  it('프로필 Step1 화면이 렌더링된다', () => {
    render(
      <MemoryRouter>
        <ProfileStep1 />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: '프로필 정보 입력' })).toBeInTheDocument()
    expect(screen.getByText('학교 정보')).toBeInTheDocument()
    expect(screen.getByLabelText('학교명')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument()
  })
})
