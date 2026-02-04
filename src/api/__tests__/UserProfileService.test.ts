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
      mbti: 'INTJ',
      tags: '차분함',
      bio: '안녕하세요',
    })

    expect(withRetry).toHaveBeenCalled()
    expect(userApiPutMock).toHaveBeenCalledWith(
      '/profile',
      {
        mbti: 'INTJ',
        tags: '차분함',
        bio: '안녕하세요',
      }
    )
  })

  it('학력 저장 API를 호출한다', async () => {
    userApiPostMock.mockResolvedValue({
      data: { success: true, data: null, message: null, timestamp: 'now' },
    })

    await saveUserEducation({
      school_name: '서울고',
      school_location: '서울',
      gpa: 3.5,
      english_test_type: 'TOEFL',
      english_score: 100,
      degree_type: '고등학교',
      degree: '고등학교',
      institution: '서울고',
    })

    expect(withRetry).toHaveBeenCalled()
    expect(userApiPostMock).toHaveBeenCalledWith(
      '/education',
      {
        school_name: '서울고',
        school_location: '서울',
        gpa: 3.5,
        english_test_type: 'TOEFL',
        english_score: 100,
        degree_type: '고등학교',
        degree: '고등학교',
        institution: '서울고',
      }
    )
  })

  it('선호 저장 API를 호출한다', async () => {
    userApiPostMock.mockResolvedValue({
      data: { success: true, data: null, message: null, timestamp: 'now' },
    })

    await saveUserPreference({
      target_program: 'university',
      target_major: 'Computer Science',
      target_location: 'California',
      budget_usd: 60000,
      career_goal: 'Computer Science',
      preferred_track: '4_year',
    })

    expect(withRetry).toHaveBeenCalled()
    expect(userApiPostMock).toHaveBeenCalledWith(
      '/preference',
      {
        target_program: 'university',
        target_major: 'Computer Science',
        target_location: 'California',
        budget_usd: 60000,
        career_goal: 'Computer Science',
        preferred_track: '4_year',
      }
    )
  })
})
