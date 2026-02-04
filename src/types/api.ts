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
  schoolName: string
  schoolLocation?: string
  gpa?: number
  gpaScale?: number
  englishTestType?: 'TOEFL' | 'IELTS'
  englishScore?: number
  degreeType?: string
  degree?: string
  major?: string
  graduationDate?: string
  institution?: string
}

export interface UserPreferenceRequest {
  targetProgram?: string
  targetMajor?: string
  targetLocation?: string
  budgetUsd?: number
  careerGoal?: string
  preferredTrack?: string
}

export interface AuthError {
  code: string
  message: string
  timestamp: string
}
