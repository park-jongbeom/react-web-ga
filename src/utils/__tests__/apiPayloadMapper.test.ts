import { describe, it, expect } from 'vitest'
import {
  mapEducationPayload,
  mapPreferencePayload,
  mapProfilePayload,
} from '../apiPayloadMapper'
import type {
  Step1SchoolInfoForm,
  Step2PersonalInfoForm,
  Step3StudyPreferenceForm,
} from '../profileStorage'

describe('apiPayloadMapper', () => {
  it('학력 정보 payload를 snake_case로 변환해야 한다', () => {
    const step1: Step1SchoolInfoForm = {
      schoolType: 'high_school',
      schoolName: '테스트고등학교',
      schoolLocation: '서울',
      gpa: '3.8',
      englishTestType: 'TOEFL',
      englishScore: '90',
    }

    expect(mapEducationPayload(step1)).toEqual({
      school_name: '테스트고등학교',
      school_location: '서울',
      gpa: 3.8,
      gpa_scale: 4.0,
      english_test_type: 'TOEFL',
      english_score: 90,
      degree_type: '고등학교',
      degree: '고등학교',
      institution: '테스트고등학교',
    })
  })

  it('프로필 payload를 문서 형식으로 변환해야 한다', () => {
    const step2: Step2PersonalInfoForm = {
      birthDate: '2000-01-01',
      mbti: 'INTJ',
      traits: '차분함',
      introduction: '안녕하세요',
    }

    expect(mapProfilePayload(step2)).toEqual({
      mbti: 'INTJ',
      tags: '차분함',
      bio: '안녕하세요',
    })
  })

  it('선호 payload를 snake_case로 변환해야 한다', () => {
    const step3: Step3StudyPreferenceForm = {
      programType: 'Community',
      major: 'Computer Science',
      budget: 60000,
      locations: ['CA', 'NY'],
      studyDuration: '2_years',
      stayAfterGraduation: 'yes',
    }

    expect(mapPreferencePayload(step3)).toEqual({
      target_program: 'community_college',
      target_major: 'Computer Science',
      target_location: 'CA',
      budget_usd: 60000,
      career_goal: 'Computer Science',
      preferred_track: '2+2',
    })
  })
})
