import { z } from 'zod'

export type Step1SchoolInfoForm = {
  schoolType: 'high_school' | 'university'
  schoolName: string
  schoolLocation: string
  gpa: string
  englishTestType: 'TOEFL' | 'IELTS'
  englishScore: string
}

const STEP1_STORAGE_KEY = 'profile_step1'

const step1SchoolInfoStorageSchema = z.object({
  schoolType: z.enum(['high_school', 'university']),
  schoolName: z.string(),
  schoolLocation: z.string(),
  gpa: z.string(),
  englishTestType: z.enum(['TOEFL', 'IELTS']),
  englishScore: z.string(),
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
