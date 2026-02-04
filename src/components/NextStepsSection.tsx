import { BaseHeading, BaseText } from './ui/Typography'
import { BaseGrid } from './ui/Layout'
import type { NextStepItem } from '../types/matching'

type NextStepsSectionProps = {
  steps: NextStepItem[]
}

function NextStepsSection({ steps }: NextStepsSectionProps) {
  return (
    <div className="bg-primary-800 text-white rounded-2xl p-8">
      <BaseHeading level={3} className="text-white mb-6">
        HOW TO APPLY: NEXT STEPS
      </BaseHeading>
      <BaseGrid cols={4} gap="md">
        {steps.map((step) => (
          <div key={step.id} className="bg-primary-900/40 rounded-xl p-4 space-y-3">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step.id === 1 ? 'bg-success-600 text-white' : 'bg-white/20 text-white'
              }`}
            >
              {step.id}
            </div>
            <div>
              <BaseText variant="label" className="text-white">
                {step.title}
              </BaseText>
              <BaseText variant="caption" className="text-white/70">
                {step.description}
              </BaseText>
            </div>
          </div>
        ))}
      </BaseGrid>
    </div>
  )
}

export default NextStepsSection
