import { render, screen } from '@testing-library/react'
import Step1SchoolInfo from '../Step1SchoolInfo'

describe('Step1SchoolInfo', () => {
  it('학교 정보 입력 필드가 렌더링된다', () => {
    render(
      <Step1SchoolInfo
        values={{
          schoolType: 'high_school',
          schoolName: '',
          schoolLocation: '',
          gpa: '',
          englishTestType: 'TOEFL',
          englishScore: '',
        }}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('출신학교 유형')).toBeInTheDocument()
    expect(screen.getByLabelText('학교명')).toBeInTheDocument()
    expect(screen.getByLabelText('지역')).toBeInTheDocument()
    expect(screen.getByLabelText('내신 성적 (GPA)')).toBeInTheDocument()
    expect(screen.getByText('영어 시험 종류')).toBeInTheDocument()
    expect(screen.getByLabelText('영어 점수')).toBeInTheDocument()
  })
})
