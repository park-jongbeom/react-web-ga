import {
  clearStep1SchoolInfo,
  loadStep1SchoolInfo,
  saveStep1SchoolInfo,
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
})
