import { render, screen } from '@testing-library/react'
import Step3StudyPreference from '../Step3StudyPreference'

describe('Step3StudyPreference', () => {
  it('유학 목표 입력 폼이 렌더링된다', () => {
    render(
      <Step3StudyPreference
        values={{
          programType: '',
          major: '',
          budget: 50000,
          locations: [],
          studyDuration: '',
          stayAfterGraduation: '',
        }}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('프로그램 유형')).toBeInTheDocument()
    expect(screen.getByLabelText('희망 전공/직업')).toBeInTheDocument()
    expect(screen.getByText('연간 예산 범위')).toBeInTheDocument()
    expect(screen.getByText('희망 지역 (복수 선택)')).toBeInTheDocument()
    expect(screen.getByText('학업 기간')).toBeInTheDocument()
    expect(screen.getByText('졸업 후 체류 의사 (OPT)')).toBeInTheDocument()
  })
})
