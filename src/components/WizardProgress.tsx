import type { HTMLAttributes } from 'react'
import { BaseText } from './ui/Typography'

export type WizardStep = {
  id: string
  label: string
  description?: string
}

type WizardProgressProps = HTMLAttributes<HTMLDivElement> & {
  steps: WizardStep[]
  currentStep: number
}

function WizardProgress({
  steps,
  currentStep,
  className = '',
  ...props
}: WizardProgressProps) {
  const totalSteps = Math.max(steps.length, 1)
  const safeCurrent = Math.min(Math.max(currentStep, 1), totalSteps)
  const progressPercent =
    totalSteps === 1 ? 100 : ((safeCurrent - 1) / (totalSteps - 1)) * 100

  return (
    <div className={`space-y-4 ${className}`.trim()} {...props}>
      <div className="flex items-center justify-between">
        <BaseText variant="label" className="text-foreground">
          진행 상황
        </BaseText>
        <BaseText variant="caption">
          {safeCurrent} / {totalSteps}
        </BaseText>
      </div>

      <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary-600 transition-all"
          style={{ width: `${progressPercent}%` }}
          aria-hidden
        />
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === safeCurrent
          const isComplete = stepNumber < safeCurrent

          return (
            <li
              key={step.id}
              className="flex items-start gap-3"
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete
                    ? 'bg-primary-600 text-onPrimary'
                    : isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-surface-muted text-foreground-subtle'
                }`}
              >
                {stepNumber}
              </span>
              <div>
                <BaseText
                  variant="label"
                  className={isActive ? 'text-foreground' : 'text-foreground-muted'}
                >
                  {step.label}
                </BaseText>
                {step.description && (
                  <BaseText variant="caption">{step.description}</BaseText>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default WizardProgress
