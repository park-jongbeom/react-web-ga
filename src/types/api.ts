/**
 * 백엔드 API 응답 타입 정의
 */

export interface ApiResponse<T> {
  success: boolean
  data: T | null
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
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
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
  birthDate: string
  mbti: string
  traits?: string
  introduction?: string
}

export interface UserEducationRequest {
  schoolType: 'high_school' | 'university'
  schoolName: string
  schoolLocation: string
  gpa: number
  englishTestType: 'TOEFL' | 'IELTS'
  englishScore: number
}

export interface UserPreferenceRequest {
  programType: 'Vocational' | 'Community' | 'University'
  major: string
  budget: number
  locations: string[]
  studyDuration: '1_year' | '2_years' | '4_years'
  stayAfterGraduation: 'yes' | 'no'
}

export interface AuthError {
  code: string
  message: string
  timestamp: string
}
