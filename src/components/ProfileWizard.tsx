import type { ReactNode } from 'react'
import { BaseContainer, BaseSection } from './ui/Layout'
import BaseCard from './ui/BaseCard'
import { BaseHeading, BaseText } from './ui/Typography'
import WizardProgress, { type WizardStep } from './WizardProgress'

type ProfileWizardProps = {
  title: string
  description?: string
  steps: WizardStep[]
  currentStep: number
  children: ReactNode
}

function ProfileWizard({
  title,
  description,
  steps,
  currentStep,
  children,
}: ProfileWizardProps) {
  return (
    <BaseSection className="bg-surface-subtle min-h-screen">
      <BaseContainer className="max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-2">
            <BaseHeading level={2}>{title}</BaseHeading>
            {description && (
              <BaseText variant="caption" className="text-foreground-muted">
                {description}
              </BaseText>
            )}
          </div>

          <BaseCard variant="outline" size="lg" className="space-y-6">
            <WizardProgress steps={steps} currentStep={currentStep} />
            <div>{children}</div>
          </BaseCard>
        </div>
      </BaseContainer>
    </BaseSection>
  )
}

export default ProfileWizard
