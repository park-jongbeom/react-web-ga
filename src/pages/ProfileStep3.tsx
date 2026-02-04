import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileWizard from '../components/ProfileWizard'
import Step3StudyPreference, {
  type Step3StudyPreferenceErrors,
} from '../components/Step3StudyPreference'
import BaseButton from '../components/ui/BaseButton'
import { validateProfileSteps } from '../utils/validation'
import {
  loadStep1SchoolInfo,
  loadStep2PersonalInfo,
  clearStep1SchoolInfo,
  clearStep2PersonalInfo,
  clearStep3StudyPreference,
  type Step1SchoolInfoForm,
  type Step2PersonalInfoForm,
} from '../utils/profileStorage'
import { useStep3StudyPreferenceStorage } from '../hooks/useStep3StudyPreferenceStorage'
import { saveUserEducation, saveUserPreference, saveUserProfile } from '../api/UserProfileService'
import BaseSpinner from '../components/ui/BaseSpinner'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { runMatching } from '../api/MatchingService'
import {
  mapEducationPayload,
  mapPreferencePayload,
  mapProfilePayload,
} from '../utils/apiPayloadMapper'

const steps = [
  { id: 'step-1', label: '학교 정보' },
  { id: 'step-2', label: '개인 정보' },
  { id: 'step-3', label: '진로 정보' },
]

function ProfileStep3() {
  const navigate = useNavigate()
  const { values, setField } = useStep3StudyPreferenceStorage()
  const [errors, setErrors] = useState<Step3StudyPreferenceErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const { pushToast } = useToast()
  const { user } = useAuth()

  const handleComplete = async () => {
    const step1 = loadStep1SchoolInfo()
    const step2 = loadStep2PersonalInfo()
    const validation = validateProfileSteps({
      step1: step1 ?? {},
      step2: step2 ?? {},
      step3: values,
    })

    if (!validation.success) {
      if (validation.stepErrors.step1) {
        navigate('/profile/step1')
        return
      }

      if (validation.stepErrors.step2) {
        navigate('/profile/step2')
        return
      }

      if (validation.stepErrors.step3) {
        setErrors(validation.stepErrors.step3 as Step3StudyPreferenceErrors)
      }
      return
    }

    setErrors({})
    setSaveError(null)
    setIsSaving(true)

    try {
      if (!step1 || !step2) {
        throw new Error('프로필 정보를 찾을 수 없습니다.')
      }

      const typedStep1: Step1SchoolInfoForm = step1
      const typedStep2: Step2PersonalInfoForm = step2

      const educationPayload = mapEducationPayload(typedStep1)
      const preferencePayload = mapPreferencePayload(values)
      const profilePayload = mapProfilePayload(typedStep2)

      await saveUserProfile(profilePayload as any)
      await saveUserEducation(educationPayload as any)
      await saveUserPreference(preferencePayload as any)

      if (!user?.id) {
        throw new Error('사용자 정보를 찾을 수 없습니다.')
      }

      const matchingResult = await runMatching(user.id)
      sessionStorage.setItem('matchingResult', JSON.stringify(matchingResult))

      clearStep1SchoolInfo()
      clearStep2PersonalInfo()
      clearStep3StudyPreference()

      pushToast('프로필 저장 및 매칭이 완료되었습니다.', 'success')
      navigate('/matching/result', {
        state: { matchingResult },
      })
    } catch (error) {
      setSaveError('저장 또는 매칭에 실패했습니다. 잠시 후 다시 시도해주세요.')
      pushToast('작업에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProfileWizard
      title="프로필 정보 입력"
      description="진로 정보를 입력하는 단계입니다."
      steps={steps}
      currentStep={3}
    >
      <div className="space-y-8">
        <Step3StudyPreference
          values={values}
          errors={errors}
          onChange={(field, value) => {
            setField(field, value)
            if (errors[field]) {
              setErrors((prev) => ({ ...prev, [field]: undefined }))
            }
          }}
        />

        {saveError && (
          <div className="rounded-md bg-danger-50 p-4 text-danger-800 text-sm">
            {saveError}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <BaseButton
            type="button"
            variant="outline"
            onClick={() => navigate('/profile/step2')}
          >
            이전
          </BaseButton>
          <BaseButton type="button" onClick={handleComplete} disabled={isSaving}>
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <BaseSpinner size="sm" />
                저장 중...
              </span>
            ) : (
              '완료'
            )}
          </BaseButton>
        </div>
      </div>
    </ProfileWizard>
  )
}

export default ProfileStep3
