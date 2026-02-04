import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfileStep3 from '../ProfileStep3'
import { runMatching } from '../../api/MatchingService'
import {
  saveUserEducation,
  saveUserPreference,
  saveUserProfile,
} from '../../api/UserProfileService'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  )
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}))

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ pushToast: vi.fn() }),
}))

vi.mock('../../utils/validation', () => ({
  validateProfileSteps: () => ({
    success: true,
    stepErrors: {},
  }),
}))

vi.mock('../../utils/profileStorage', () => ({
  loadStep1SchoolInfo: () => ({
    schoolType: 'high_school',
    schoolName: 'Test High School',
    schoolLocation: 'Seoul',
    gpa: '3.8',
    englishTestType: 'TOEFL',
    englishScore: '90',
  }),
  loadStep2PersonalInfo: () => ({
    mbti: 'INTJ',
    traits: '차분함',
    introduction: '안녕하세요',
  }),
  loadStep3StudyPreference: () => null,
  saveStep3StudyPreference: vi.fn(),
  clearStep1SchoolInfo: vi.fn(),
  clearStep2PersonalInfo: vi.fn(),
  clearStep3StudyPreference: vi.fn(),
}))

vi.mock('../../api/UserProfileService', () => ({
  saveUserProfile: vi.fn(),
  saveUserEducation: vi.fn(),
  saveUserPreference: vi.fn(),
}))

vi.mock('../../api/MatchingService', () => ({
  runMatching: vi.fn(),
}))

describe('ProfileStep3', () => {
  it('Step3 화면이 렌더링된다', () => {
    render(
      <MemoryRouter>
        <ProfileStep3 />
      </MemoryRouter>
    )

    expect(screen.getByText('진로 정보를 입력하는 단계입니다.')).toBeInTheDocument()
    expect(screen.getByText('프로그램 유형')).toBeInTheDocument()
  })

  it('완료 클릭 시 매칭 실행 후 결과 페이지로 이동한다', async () => {
    vi.mocked(saveUserProfile).mockResolvedValue({} as any)
    vi.mocked(saveUserEducation).mockResolvedValue({} as any)
    vi.mocked(saveUserPreference).mockResolvedValue({} as any)
    vi.mocked(runMatching).mockResolvedValue({
      matching_id: 'm1',
      user_id: 'user-1',
      total_matches: 0,
      execution_time_ms: 1000,
      results: [],
      created_at: '2024-01-01T00:00:00Z',
    })

    render(
      <MemoryRouter>
        <ProfileStep3 />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: '완료' }))

    await waitFor(() => {
      expect(saveUserProfile).toHaveBeenCalledWith({
        mbti: 'INTJ',
        tags: '차분함',
        bio: '안녕하세요',
      })
      expect(saveUserEducation).toHaveBeenCalledWith({
        school_name: 'Test High School',
        school_location: 'Seoul',
        gpa: 3.8,
        gpa_scale: 4.0,
        english_test_type: 'TOEFL',
        english_score: 90,
        degree_type: '고등학교',
        degree: '고등학교',
        institution: 'Test High School',
      })
      expect(saveUserPreference).toHaveBeenCalledWith({
        target_program: undefined,
        target_major: undefined,
        target_location: undefined,
        budget_usd: 50000,
        career_goal: undefined,
        preferred_track: undefined,
      })
      expect(runMatching).toHaveBeenCalledWith('user-1')
    })
  })
})
