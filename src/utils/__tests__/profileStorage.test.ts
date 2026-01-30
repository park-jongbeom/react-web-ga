import {
  clearStep1SchoolInfo,
  clearStep2PersonalInfo,
  clearStep3StudyPreference,
  loadStep1SchoolInfo,
  loadStep2PersonalInfo,
  loadStep3StudyPreference,
  saveStep1SchoolInfo,
  saveStep2PersonalInfo,
  saveStep3StudyPreference,
} from '../profileStorage'

describe('profileStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('저장한 Step1 데이터는 다시 불러올 수 있다', () => {
    saveStep1SchoolInfo({
      schoolType: 'high_school',
      schoolName: '서울고등학교',
      schoolLocation: '서울',
      gpa: '3.5',
      englishTestType: 'TOEFL',
      englishScore: '100',
    })

    const result = loadStep1SchoolInfo()

    expect(result).toEqual({
      schoolType: 'high_school',
      schoolName: '서울고등학교',
      schoolLocation: '서울',
      gpa: '3.5',
      englishTestType: 'TOEFL',
      englishScore: '100',
    })
  })

  it('저장 데이터를 삭제하면 null을 반환한다', () => {
    saveStep1SchoolInfo({
      schoolType: 'high_school',
      schoolName: '서울고등학교',
      schoolLocation: '서울',
      gpa: '3.5',
      englishTestType: 'TOEFL',
      englishScore: '100',
    })

    clearStep1SchoolInfo()

    expect(loadStep1SchoolInfo()).toBeNull()
  })

  it('Step2 데이터는 저장 및 불러오기가 가능하다', () => {
    saveStep2PersonalInfo({
      birthDate: '2000-01-01',
      mbti: 'INTJ',
      traits: '차분함',
      introduction: '안녕하세요',
    })

    expect(loadStep2PersonalInfo()).toEqual({
      birthDate: '2000-01-01',
      mbti: 'INTJ',
      traits: '차분함',
      introduction: '안녕하세요',
    })

    clearStep2PersonalInfo()
    expect(loadStep2PersonalInfo()).toBeNull()
  })

  it('Step3 데이터는 저장 및 불러오기가 가능하다', () => {
    saveStep3StudyPreference({
      programType: 'University',
      major: 'Computer Science',
      budget: 60000,
      locations: ['California'],
      studyDuration: '4_years',
      stayAfterGraduation: 'yes',
    })

    expect(loadStep3StudyPreference()).toEqual({
      programType: 'University',
      major: 'Computer Science',
      budget: 60000,
      locations: ['California'],
      studyDuration: '4_years',
      stayAfterGraduation: 'yes',
    })

    clearStep3StudyPreference()
    expect(loadStep3StudyPreference()).toBeNull()
  })
})
