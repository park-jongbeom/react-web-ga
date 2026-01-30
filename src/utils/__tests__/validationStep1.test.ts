import { step1SchoolInfoSchema, validateStep1SchoolInfo } from '../validation'

describe('step1SchoolInfoSchema', () => {
  it('정상 입력값은 통과한다', () => {
    const result = step1SchoolInfoSchema.safeParse({
      schoolType: 'high_school',
      schoolName: '서울고등학교',
      schoolLocation: '서울',
      gpa: '3.5',
      englishTestType: 'TOEFL',
      englishScore: '100',
    })

    expect(result.success).toBe(true)
  })

  it('잘못된 입력값은 에러를 반환한다', () => {
    const result = validateStep1SchoolInfo({
      schoolType: 'high_school',
      schoolName: '',
      schoolLocation: '서',
      gpa: '10',
      englishTestType: 'TOEFL',
      englishScore: '',
    })

    expect(result.success).toBe(false)
    expect(result.errors.schoolName).toBeDefined()
    expect(result.errors.gpa).toBeDefined()
    expect(result.errors.englishScore).toBeDefined()
  })
})
