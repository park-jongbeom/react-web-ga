import { BaseText } from './ui/Typography'
import type { IndicatorScores } from '../types/matching'

type MatchingIndicatorBarsProps = {
  scores: IndicatorScores
  description?: string
}

const buildItems = (scores: IndicatorScores) => [
  { label: 'Academic Fit', value: scores.academicFit, tone: 'primary' },
  { label: 'Career Outlook', value: scores.careerOutlook, tone: 'primary' },
  { label: 'Cost Efficiency', value: scores.costEfficiency, tone: 'accent' },
]

function MatchingIndicatorBars({ scores, description }: MatchingIndicatorBarsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {buildItems(scores).map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <BaseText variant="caption" className="text-foreground-muted">
                {item.label}
              </BaseText>
              <BaseText variant="caption" className="text-foreground">
                {item.value}%
              </BaseText>
            </div>
            <div className="h-2 rounded-full bg-surface-subtle">
              <div
                className={`h-2 rounded-full ${
                  item.tone === 'accent' ? 'bg-accent-500' : 'bg-primary-600'
                }`}
                style={{ width: `${item.value}%` }}
                aria-label={`${item.label} ${item.value}%`}
              />
            </div>
          </div>
        ))}
      </div>
      {description && (
        <div className="border border-accent-500 bg-warning-50 rounded-lg p-4">
          <BaseText variant="caption" className="text-warning-800">
            {description}
          </BaseText>
        </div>
      )}
    </div>
  )
}

export default MatchingIndicatorBars
