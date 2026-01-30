import {
  step1SchoolInfoSchema,
  validateProfileSteps,
  validateStep1SchoolInfo,
  validateStep2PersonalInfo,
  validateStep3StudyPreference,
} from '../validation'

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

describe('step2PersonalInfoSchema', () => {
  it('만 18세 이상이면 통과한다', () => {
    const result = validateStep2PersonalInfo({
      birthDate: '2000-01-01',
      mbti: 'INTJ',
      traits: '',
      introduction: '',
    })

    expect(result.success).toBe(true)
  })

  it('만 18세 미만은 에러를 반환한다', () => {
    const result = validateStep2PersonalInfo({
      birthDate: '2010-01-01',
      mbti: 'INTJ',
      traits: '',
      introduction: '',
    })

    expect(result.success).toBe(false)
    expect(result.errors.birthDate).toBeDefined()
  })
})

describe('step3StudyPreferenceSchema', () => {
  it('유학 목표 입력값이 유효하면 통과한다', () => {
    const result = validateStep3StudyPreference({
      programType: 'University',
      major: 'Computer Science',
      budget: 50000,
      locations: ['California'],
      studyDuration: '4_years',
      stayAfterGraduation: 'yes',
    })

    expect(result.success).toBe(true)
  })
})

describe('validateProfileSteps', () => {
  it('전체 단계 검증이 실패하면 stepErrors를 반환한다', () => {
    const result = validateProfileSteps({
      step1: {
        schoolType: 'high_school',
        schoolName: '',
        schoolLocation: '서울',
        gpa: '3.0',
        englishTestType: 'TOEFL',
        englishScore: '100',
      },
      step2: {
        birthDate: '2010-01-01',
        mbti: '',
        traits: '',
        introduction: '',
      },
      step3: {
        programType: '',
        major: '',
        budget: 50000,
        locations: [],
        studyDuration: '',
        stayAfterGraduation: '',
      },
    })

    expect(result.success).toBe(false)
    expect(result.stepErrors.step1).toBeDefined()
    expect(result.stepErrors.step2).toBeDefined()
    expect(result.stepErrors.step3).toBeDefined()
  })
})
