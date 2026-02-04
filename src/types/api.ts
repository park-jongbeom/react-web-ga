/**
 * 백엔드 API 응답 타입 정의
 */

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  code?: string | null
  message: string | null
  timestamp: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  passwordConfirm: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    full_name?: string
  }
}

export type SignupResponse = LoginResponse

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface UserProfileRequest {
  mbti?: string
  tags?: string
  bio?: string
}

export interface UserEducationRequest {
  school_name: string
  school_location?: string
  gpa?: number
  gpa_scale?: number
  english_test_type?: 'TOEFL' | 'IELTS'
  english_score?: number
  degree_type?: string
  degree?: string
  major?: string
  graduation_date?: string
  institution?: string
}

export interface UserPreferenceRequest {
  target_program?: string
  target_major?: string
  target_location?: string
  budget_usd?: number
  career_goal?: string
  preferred_track?: string
}

export interface AuthError {
  code: string
  message: string
  timestamp: string
}
