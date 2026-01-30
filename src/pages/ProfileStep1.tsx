/**
 * 프로필 입력 Step 1 페이지
 *
 * 보안 원칙 준수:
 * - Validation+SQLi 방어: Zod 기반 검증 사용
 * - 에러 노출 차단: 화면에는 필드 수준 메시지로만 표시
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileWizard from '../components/ProfileWizard'
import Step1SchoolInfo, {
  type Step1SchoolInfoErrors,
} from '../components/Step1SchoolInfo'
import BaseButton from '../components/ui/BaseButton'
import { validateStep1SchoolInfo } from '../utils/validation'
import { useStep1SchoolInfoStorage } from '../hooks/useStep1SchoolInfoStorage'

const steps = [
  { id: 'step-1', label: '학교 정보' },
  { id: 'step-2', label: '개인 정보' },
  { id: 'step-3', label: '진로 정보' },
]

function ProfileStep1() {
  const navigate = useNavigate()
  const { values, setField } = useStep1SchoolInfoStorage()
  const [errors, setErrors] = useState<Step1SchoolInfoErrors>({})

  const handleNext = () => {
    const validation = validateStep1SchoolInfo(values)
    if (!validation.success) {
      setErrors(validation.errors as Step1SchoolInfoErrors)
      return
    }

    setErrors({})
    navigate('/profile/step2')
  }

  return (
    <ProfileWizard
      title="프로필 정보 입력"
      description="AI 매칭을 위한 기본 학교 정보를 입력해주세요."
      steps={steps}
      currentStep={1}
    >
      <div className="space-y-8">
        <Step1SchoolInfo
          values={values}
          errors={errors}
          onChange={(field, value) => {
            setField(field, value)
            if (errors[field]) {
              setErrors((prev) => ({ ...prev, [field]: undefined }))
            }
          }}
        />

        <div className="flex justify-end">
          <BaseButton type="button" onClick={handleNext}>
            다음
          </BaseButton>
        </div>
      </div>
    </ProfileWizard>
  )
}

export default ProfileStep1
