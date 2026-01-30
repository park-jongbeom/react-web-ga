/**
 * Zod 기반 입력값 검증 스키마
 * 
 * 보안 원칙:
 * - Validation+SQLi 방어: 런타임 타입 검증
 * - 모든 사용자 입력값 검증
 * - SQL 인젝션 방어를 위한 특수 문자 제한
 * - 타입 안전성 보장
 */

import { z } from 'zod'

/**
 * 이메일 검증 스키마
 * - RFC 5322 기본 검증
 * - SQL 인젝션 방어: 특수 문자 제한
 * - XSS 방어: 길이 제한
 */
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .max(254, '이메일은 최대 254자까지 가능합니다.')
  .email('올바른 이메일 형식을 입력해주세요.')
  .refine(
    (email) => {
      // SQL 인젝션 방어: 위험한 문자 제한
      const dangerousChars = /[;"'\\<>]/
      return !dangerousChars.test(email)
    },
    {
      message: '이메일에는 사용할 수 없는 문자가 포함되어 있습니다.',
    }
  )
  .refine(
    (email) => {
      // 추가 검증: 공백 제한
      return !/\s/.test(email)
    },
    {
      message: '이메일에는 공백을 포함할 수 없습니다.',
    }
  )
  .transform((email) => email.toLowerCase().trim())

/**
 * 비밀번호 검증 스키마
 * - 최소 8자, 최대 128자
 * - 대소문자, 숫자 포함 필수
 * - SQL 인젝션 방어: 위험한 문자 제한
 */
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .max(128, '비밀번호는 최대 128자까지 가능합니다.')
  .refine(
    (password) => /[a-z]/.test(password),
    {
      message: '비밀번호는 최소 1개의 소문자를 포함해야 합니다.',
    }
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    {
      message: '비밀번호는 최소 1개의 대문자를 포함해야 합니다.',
    }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    {
      message: '비밀번호는 최소 1개의 숫자를 포함해야 합니다.',
    }
  )
  .refine(
    (password) => {
      // SQL 인젝션 및 XSS 방어: 위험한 문자 제한
      const dangerousChars = /[;"'\\<>]/
      return !dangerousChars.test(password)
    },
    {
      message: '비밀번호에 사용할 수 없는 문자가 포함되어 있습니다.',
    }
  )

/**
 * 로그인 요청 스키마
 */
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * 회원가입 요청 스키마
 */
export const signupRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })

/**
 * Refresh Token 검증 스키마
 */
export const refreshTokenSchema = z
  .string()
  .min(1, 'Refresh Token이 필요합니다.')
  .refine(
    (token) => {
      // JWT 형식 기본 검증 (3개 부분으로 구성)
      const parts = token.split('.')
      return parts.length === 3
    },
    {
      message: '올바른 토큰 형식이 아닙니다.',
    }
  )

/**
 * Refresh 요청 스키마
 */
export const refreshRequestSchema = z.object({
  refreshToken: refreshTokenSchema,
})

/**
 * 프로필 Step 1 (학교 정보) 스키마
 */
export const step1SchoolInfoSchema = z.object({
  schoolType: z.enum(['high_school', 'university']),
  schoolName: z.string().min(2, '학교명을 입력하세요'),
  schoolLocation: z.string().min(2, '지역을 입력하세요'),
  gpa: z
    .string()
    .min(1, '내신 성적을 입력하세요')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: 'GPA는 숫자여야 합니다.',
    })
    .transform((value) => Number(value))
    .refine((value) => value >= 0 && value <= 4.0, {
      message: 'GPA는 0.0~4.0 범위입니다.',
    }),
  englishTestType: z.enum(['TOEFL', 'IELTS']),
  englishScore: z
    .string()
    .min(1, '영어 점수를 입력하세요')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: '영어 점수는 숫자여야 합니다.',
    })
    .transform((value) => Number(value))
    .refine((value) => value >= 0, {
      message: '영어 점수는 0 이상이어야 합니다.',
    }),
})

/**
 * 프로필 Step 2 (개인 정보) 스키마
 */
export const step2PersonalInfoSchema = z.object({
  birthDate: z
    .string()
    .min(1, '생년월일을 입력하세요')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: '생년월일 형식이 올바르지 않습니다.',
    })
    .refine(
      (value) => {
        const birth = new Date(value)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age -= 1
        }
        return age >= 18
      },
      {
        message: '만 18세 이상만 가능합니다.',
      }
    ),
  mbti: z.string().min(1, 'MBTI를 선택하세요'),
  traits: z.string().optional().default(''),
  introduction: z.string().optional().default(''),
})

/**
 * 프로필 Step 3 (유학 목표) 스키마
 */
export const step3StudyPreferenceSchema = z.object({
  programType: z.enum(['Vocational', 'Community', 'University'], {
    required_error: '프로그램 유형을 선택하세요.',
  }),
  major: z.string().min(2, '희망 전공/직업을 입력하세요'),
  budget: z
    .number()
    .min(20000, '예산은 최소 20,000달러 이상이어야 합니다.')
    .max(80000, '예산은 최대 80,000달러 이하이어야 합니다.'),
  locations: z.array(z.string()).min(1, '희망 지역을 최소 1개 선택하세요'),
  studyDuration: z.enum(['1_year', '2_years', '4_years'], {
    required_error: '학업 기간을 선택하세요.',
  }),
  stayAfterGraduation: z.enum(['yes', 'no'], {
    required_error: '체류 의사를 선택하세요.',
  }),
})

/**
 * 일반 문자열 검증 (Sanitization용)
 * - SQL 인젝션 방어
 * - XSS 방어
 * - 길이 제한
 */
export const sanitizedStringSchema = z
  .string()
  .max(1000, '입력값은 최대 1000자까지 가능합니다.')
  .refine(
    (value) => {
      // SQL 인젝션 방어: 위험한 문자 제한
      const dangerousChars = /[;"'\\<>]/
      return !dangerousChars.test(value)
    },
    {
      message: '사용할 수 없는 문자가 포함되어 있습니다.',
    }
  )
  .transform((value) => value.trim())

/**
 * Step 1 입력값 검증 헬퍼
 */
export const validateStep1SchoolInfo = (
  values: Record<string, unknown>
): {
  success: boolean
  errors: Partial<Record<keyof Step1SchoolInfo, string>>
} => {
  const result = step1SchoolInfoSchema.safeParse(values)
  if (result.success) {
    return { success: true, errors: {} }
  }

  const errors: Partial<Record<keyof Step1SchoolInfo, string>> = {}
  for (const issue of result.error.errors) {
    const field = issue.path[0] as keyof Step1SchoolInfo
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }

  return { success: false, errors }
}

export const validateStep2PersonalInfo = (
  values: Record<string, unknown>
): {
  success: boolean
  errors: Partial<Record<keyof Step2PersonalInfo, string>>
} => {
  const result = step2PersonalInfoSchema.safeParse(values)
  if (result.success) {
    return { success: true, errors: {} }
  }

  const errors: Partial<Record<keyof Step2PersonalInfo, string>> = {}
  for (const issue of result.error.errors) {
    const field = issue.path[0] as keyof Step2PersonalInfo
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }

  return { success: false, errors }
}

export const validateStep3StudyPreference = (
  values: Record<string, unknown>
): {
  success: boolean
  errors: Partial<Record<keyof Step3StudyPreference, string>>
} => {
  const result = step3StudyPreferenceSchema.safeParse(values)
  if (result.success) {
    return { success: true, errors: {} }
  }

  const errors: Partial<Record<keyof Step3StudyPreference, string>> = {}
  for (const issue of result.error.errors) {
    const field = issue.path[0] as keyof Step3StudyPreference
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }

  return { success: false, errors }
}

export const validateProfileSteps = (values: {
  step1: Record<string, unknown>
  step2: Record<string, unknown>
  step3: Record<string, unknown>
}): {
  success: boolean
  stepErrors: {
    step1?: Partial<Record<keyof Step1SchoolInfo, string>>
    step2?: Partial<Record<keyof Step2PersonalInfo, string>>
    step3?: Partial<Record<keyof Step3StudyPreference, string>>
  }
} => {
  const step1Result = validateStep1SchoolInfo(values.step1)
  const step2Result = validateStep2PersonalInfo(values.step2)
  const step3Result = validateStep3StudyPreference(values.step3)

  const stepErrors = {
    ...(step1Result.success ? {} : { step1: step1Result.errors }),
    ...(step2Result.success ? {} : { step2: step2Result.errors }),
    ...(step3Result.success ? {} : { step3: step3Result.errors }),
  }

  return {
    success: step1Result.success && step2Result.success && step3Result.success,
    stepErrors,
  }
}

/**
 * 타입 추론을 위한 타입 정의
 */
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type SignupRequest = z.infer<typeof signupRequestSchema>
export type RefreshRequest = z.infer<typeof refreshRequestSchema>
export type SanitizedString = z.infer<typeof sanitizedStringSchema>
export type Step1SchoolInfo = z.infer<typeof step1SchoolInfoSchema>
export type Step2PersonalInfo = z.infer<typeof step2PersonalInfoSchema>
export type Step3StudyPreference = z.infer<typeof step3StudyPreferenceSchema>
