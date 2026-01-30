import { render, screen } from '@testing-library/react'
import Step2PersonalInfo from '../Step2PersonalInfo'

describe('Step2PersonalInfo', () => {
  it('개인 정보 입력 필드가 렌더링된다', () => {
    render(
      <Step2PersonalInfo
        values={{
          birthDate: '',
          mbti: '',
          traits: '',
          introduction: '',
        }}
        onChange={() => {}}
      />
    )

    expect(screen.getByLabelText('생년월일')).toBeInTheDocument()
    expect(screen.getByText('MBTI')).toBeInTheDocument()
    expect(screen.getByLabelText('본인 성향 (선택)')).toBeInTheDocument()
    expect(screen.getByLabelText('자기소개 (선택)')).toBeInTheDocument()
  })
})
