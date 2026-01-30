import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfileStep3 from '../ProfileStep3'

describe('ProfileStep3', () => {
  it('Step3 화면이 렌더링된다', () => {
    render(
      <MemoryRouter>
        <ProfileStep3 />
      </MemoryRouter>
    )

    expect(screen.getByText('진로 정보를 입력하는 단계입니다.')).toBeInTheDocument()
    expect(screen.getByText('프로그램 유형')).toBeInTheDocument()
  })
})
