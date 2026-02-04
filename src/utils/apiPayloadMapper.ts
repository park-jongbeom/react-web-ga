import type {
  Step1SchoolInfoForm,
  Step2PersonalInfoForm,
  Step3StudyPreferenceForm,
} from './profileStorage'
import type {
  UserEducationRequest,
  UserPreferenceRequest,
  UserProfileRequest,
} from '../types/api'

const toNumberOrUndefined = (value: string): number | undefined => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export const mapEducationPayload = (
  step1: Step1SchoolInfoForm
): UserEducationRequest => {
  const isHighSchool = step1.schoolType === 'high_school'

  return {
    school_name: step1.schoolName,
    school_location: step1.schoolLocation || undefined,
    gpa: toNumberOrUndefined(step1.gpa),
    gpa_scale: 4.0,
    english_test_type: step1.englishTestType || undefined,
    english_score: toNumberOrUndefined(step1.englishScore),
    degree_type: isHighSchool ? '고등학교' : '대학교',
    degree: isHighSchool ? '고등학교' : '대학교',
    institution: step1.schoolName,
  }
}

export const mapProfilePayload = (
  step2: Step2PersonalInfoForm
): UserProfileRequest => ({
  mbti: step2.mbti || undefined,
  tags: step2.traits || undefined,
  bio: step2.introduction || undefined,
})

export const mapPreferencePayload = (
  step3: Step3StudyPreferenceForm
): UserPreferenceRequest => {
  const targetProgram =
    step3.programType === 'Community'
      ? 'community_college'
      : step3.programType === 'University'
        ? 'university'
        : step3.programType === 'Vocational'
          ? 'vocational'
          : undefined

  const preferredTrack =
    step3.studyDuration === '2_years'
      ? '2+2'
      : step3.studyDuration === '4_years'
        ? '4_year'
        : step3.studyDuration === '1_year'
          ? '1_year'
          : undefined

  return {
    target_program: targetProgram,
    target_major: step3.major || undefined,
    target_location: step3.locations[0] || undefined,
    budget_usd: step3.budget || undefined,
    career_goal: step3.major || undefined,
    preferred_track: preferredTrack,
  }
}
