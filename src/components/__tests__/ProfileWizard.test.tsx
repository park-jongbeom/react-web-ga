import { render, screen } from '@testing-library/react'
import ProfileWizard from '../ProfileWizard'

const steps = [
  { id: 'step-1', label: '학교 정보' },
  { id: 'step-2', label: '개인 정보' },
  { id: 'step-3', label: '진로 정보' },
]

describe('ProfileWizard', () => {
  it('타이틀과 진행 상태가 렌더링된다', () => {
    render(
      <ProfileWizard title="프로필 입력" steps={steps} currentStep={2}>
        <div>폼 내용</div>
      </ProfileWizard>
    )

    expect(screen.getByRole('heading', { name: '프로필 입력' })).toBeInTheDocument()
    expect(screen.getByText('진행 상황')).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText('학교 정보')).toBeInTheDocument()
    expect(screen.getByText('개인 정보')).toBeInTheDocument()
    expect(screen.getByText('진로 정보')).toBeInTheDocument()
    expect(screen.getByText('폼 내용')).toBeInTheDocument()
  })
})
