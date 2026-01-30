import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileWizard from '../components/ProfileWizard'
import Step2PersonalInfo, {
  type Step2PersonalInfoErrors,
} from '../components/Step2PersonalInfo'
import BaseButton from '../components/ui/BaseButton'
import { validateStep2PersonalInfo } from '../utils/validation'
import { useStep2PersonalInfoStorage } from '../hooks/useStep2PersonalInfoStorage'

const steps = [
  { id: 'step-1', label: '학교 정보' },
  { id: 'step-2', label: '개인 정보' },
  { id: 'step-3', label: '진로 정보' },
]

function ProfileStep2() {
  const navigate = useNavigate()
  const { values, setField } = useStep2PersonalInfoStorage()
  const [errors, setErrors] = useState<Step2PersonalInfoErrors>({})

  const handleNext = () => {
    const validation = validateStep2PersonalInfo(values)
    if (!validation.success) {
      setErrors(validation.errors as Step2PersonalInfoErrors)
      return
    }

    setErrors({})
    navigate('/profile/step3')
  }

  return (
    <ProfileWizard
      title="프로필 정보 입력"
      description="개인 정보를 입력하는 단계입니다."
      steps={steps}
      currentStep={2}
    >
      <div className="space-y-8">
        <Step2PersonalInfo
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
            onClick={() => navigate('/profile/step1')}
          >
            이전
          </BaseButton>
          <BaseButton type="button" onClick={handleNext}>
            다음
          </BaseButton>
        </div>
      </div>
    </ProfileWizard>
  )
}

export default ProfileStep2
