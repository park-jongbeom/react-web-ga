import { z } from 'zod'

export type Step1SchoolInfoForm = {
  schoolType: 'high_school' | 'university'
  schoolName: string
  schoolLocation: string
  gpa: string
  englishTestType: 'TOEFL' | 'IELTS'
  englishScore: string
}

export type Step2PersonalInfoForm = {
  birthDate: string
  mbti: string
  traits: string
  introduction: string
}

export type Step3StudyPreferenceForm = {
  programType: 'Vocational' | 'Community' | 'University' | ''
  major: string
  budget: number
  locations: string[]
  studyDuration: '1_year' | '2_years' | '4_years' | ''
  stayAfterGraduation: 'yes' | 'no' | ''
}

const STEP1_STORAGE_KEY = 'profile_step1'
const STEP2_STORAGE_KEY = 'profile_step2'
const STEP3_STORAGE_KEY = 'profile_step3'

const step1SchoolInfoStorageSchema = z.object({
  schoolType: z.enum(['high_school', 'university']),
  schoolName: z.string(),
  schoolLocation: z.string(),
  gpa: z.string(),
  englishTestType: z.enum(['TOEFL', 'IELTS']),
  englishScore: z.string(),
})

const step2PersonalInfoStorageSchema = z.object({
  birthDate: z.string(),
  mbti: z.string(),
  traits: z.string(),
  introduction: z.string(),
})

const step3StudyPreferenceStorageSchema = z.object({
  programType: z.enum(['Vocational', 'Community', 'University', '']),
  major: z.string(),
  budget: z.number(),
  locations: z.array(z.string()),
  studyDuration: z.enum(['1_year', '2_years', '4_years', '']),
  stayAfterGraduation: z.enum(['yes', 'no', '']),
})

export const saveStep1SchoolInfo = (values: Step1SchoolInfoForm): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STEP1_STORAGE_KEY, JSON.stringify(values))
  } catch (error) {
    console.error('Step1 임시 저장 실패:', error)
  }
}

export const loadStep1SchoolInfo = (): Step1SchoolInfoForm | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(STEP1_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const result = step1SchoolInfoStorageSchema.safeParse(parsed)
    if (!result.success) {
      return null
    }
    return result.data
  } catch (error) {
    console.error('Step1 임시 저장 데이터 파싱 실패:', error)
    return null
  }
}

export const clearStep1SchoolInfo = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(STEP1_STORAGE_KEY)
}

export const saveStep2PersonalInfo = (values: Step2PersonalInfoForm): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STEP2_STORAGE_KEY, JSON.stringify(values))
  } catch (error) {
    console.error('Step2 임시 저장 실패:', error)
  }
}

export const loadStep2PersonalInfo = (): Step2PersonalInfoForm | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(STEP2_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const result = step2PersonalInfoStorageSchema.safeParse(parsed)
    if (!result.success) {
      return null
    }
    return result.data
  } catch (error) {
    console.error('Step2 임시 저장 데이터 파싱 실패:', error)
    return null
  }
}

export const clearStep2PersonalInfo = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(STEP2_STORAGE_KEY)
}

export const saveStep3StudyPreference = (
  values: Step3StudyPreferenceForm
): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STEP3_STORAGE_KEY, JSON.stringify(values))
  } catch (error) {
    console.error('Step3 임시 저장 실패:', error)
  }
}

export const loadStep3StudyPreference = (): Step3StudyPreferenceForm | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(STEP3_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const result = step3StudyPreferenceStorageSchema.safeParse(parsed)
    if (!result.success) {
      return null
    }
    return result.data
  } catch (error) {
    console.error('Step3 임시 저장 데이터 파싱 실패:', error)
    return null
  }
}

export const clearStep3StudyPreference = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(STEP3_STORAGE_KEY)
}
