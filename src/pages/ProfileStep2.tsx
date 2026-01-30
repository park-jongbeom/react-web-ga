import ProfileWizard from '../components/ProfileWizard'
import { BaseText } from '../components/ui/Typography'

const steps = [
  { id: 'step-1', label: '학교 정보' },
  { id: 'step-2', label: '개인 정보' },
  { id: 'step-3', label: '진로 정보' },
]

function ProfileStep2() {
  return (
    <ProfileWizard
      title="프로필 정보 입력"
      description="개인 정보를 입력하는 단계입니다."
      steps={steps}
      currentStep={2}
    >
      <BaseText variant="body">Step 2 화면은 준비 중입니다.</BaseText>
    </ProfileWizard>
  )
}

export default ProfileStep2
