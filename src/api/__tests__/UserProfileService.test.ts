import {
  saveUserEducation,
  saveUserPreference,
  saveUserProfile,
} from '../UserProfileService'
import { withRetry } from '../../utils/retry'

const userApiPutMock = vi.fn()
const userApiPostMock = vi.fn()

vi.mock('../axiosInstance', () => ({
  userApi: {
    put: (...args: unknown[]) => userApiPutMock(...args),
    post: (...args: unknown[]) => userApiPostMock(...args),
  },
}))

vi.mock('../../utils/retry', () => ({
  withRetry: vi.fn((fn: () => Promise<unknown>) => fn()),
}))

describe('UserProfileService', () => {
  beforeEach(() => {
    userApiPutMock.mockReset()
    userApiPostMock.mockReset()
  })

  it('프로필 저장 API를 호출한다', async () => {
    userApiPutMock.mockResolvedValue({
      data: { success: true, data: null, message: null, timestamp: 'now' },
    })

    await saveUserProfile({
      birthDate: '2000-01-01',
      mbti: 'INTJ',
      traits: '차분함',
      introduction: '안녕하세요',
    })

    expect(withRetry).toHaveBeenCalled()
    expect(userApiPutMock).toHaveBeenCalledWith(
      '/profile',
      {
        birthDate: '2000-01-01',
        mbti: 'INTJ',
        traits: '차분함',
        introduction: '안녕하세요',
      }
    )
  })

  it('학력 저장 API를 호출한다', async () => {
    userApiPostMock.mockResolvedValue({
      data: { success: true, data: null, message: null, timestamp: 'now' },
    })

    await saveUserEducation({
      schoolType: 'high_school',
      schoolName: '서울고',
      schoolLocation: '서울',
      gpa: 3.5,
      englishTestType: 'TOEFL',
      englishScore: 100,
    })

    expect(withRetry).toHaveBeenCalled()
    expect(userApiPostMock).toHaveBeenCalledWith(
      '/education',
      {
        schoolType: 'high_school',
        schoolName: '서울고',
        schoolLocation: '서울',
        gpa: 3.5,
        englishTestType: 'TOEFL',
        englishScore: 100,
      }
    )
  })

  it('선호 저장 API를 호출한다', async () => {
    userApiPostMock.mockResolvedValue({
      data: { success: true, data: null, message: null, timestamp: 'now' },
    })

    await saveUserPreference({
      programType: 'University',
      major: 'Computer Science',
      budget: 60000,
      locations: ['California'],
      studyDuration: '4_years',
      stayAfterGraduation: 'yes',
    })

    expect(withRetry).toHaveBeenCalled()
    expect(userApiPostMock).toHaveBeenCalledWith(
      '/preference',
      {
        programType: 'University',
        major: 'Computer Science',
        budget: 60000,
        locations: ['California'],
        studyDuration: '4_years',
        stayAfterGraduation: 'yes',
      }
    )
  })
})
