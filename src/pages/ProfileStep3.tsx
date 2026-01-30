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
} from '../utils/profileStorage'
import { useStep3StudyPreferenceStorage } from '../hooks/useStep3StudyPreferenceStorage'

const steps = [
  { id: 'step-1', label: '학교 정보' },
  { id: 'step-2', label: '개인 정보' },
  { id: 'step-3', label: '진로 정보' },
]

function ProfileStep3() {
  const navigate = useNavigate()
  const { values, setField } = useStep3StudyPreferenceStorage()
  const [errors, setErrors] = useState<Step3StudyPreferenceErrors>({})

  const handleComplete = () => {
    const step1 = loadStep1SchoolInfo() ?? {}
    const step2 = loadStep2PersonalInfo() ?? {}
    const validation = validateProfileSteps({
      step1,
      step2,
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
    navigate('/dashboard')
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

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <BaseButton
            type="button"
            variant="outline"
            onClick={() => navigate('/profile/step2')}
          >
            이전
          </BaseButton>
          <BaseButton type="button" onClick={handleComplete}>
            완료
          </BaseButton>
        </div>
      </div>
    </ProfileWizard>
  )
}

export default ProfileStep3
