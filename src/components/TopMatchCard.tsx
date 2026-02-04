import BaseCard from './ui/BaseCard'
import BaseBadge from './ui/BaseBadge'
import { BaseHeading, BaseText } from './ui/Typography'
import type { MatchingResultItem } from '../types/matching'

type TopMatchCardProps = {
  item: MatchingResultItem
  isPrimary?: boolean
}

function TopMatchCard({ item, isPrimary = false }: TopMatchCardProps) {
  const score = Math.round(item.total_score)
  const matchLabel = isPrimary ? `${score}% MATCH` : `${score}% Match Rate`

  return (
    <BaseCard
      variant="outline"
      className={`flex flex-col gap-3 ${
        isPrimary ? 'border-2 border-primary-600 bg-primary-50' : 'border border-border bg-surface'
      }`.trim()}
    >
      <div className="flex items-start justify-between">
        <BaseBadge variant={isPrimary ? 'success' : 'neutral'}>{matchLabel}</BaseBadge>
        <BaseText
          variant="caption"
          className={isPrimary ? 'text-success-700' : 'text-foreground-muted'}
        >
          {isPrimary ? 'Rank #1 Recommendation' : `Rank #${item.rank}`}
        </BaseText>
      </div>
      <div>
        <BaseHeading level={3} className="text-lg">
          {item.school.name}
        </BaseHeading>
        <BaseText variant="caption" className="text-foreground-muted">
          {item.program.name}
        </BaseText>
      </div>
    </BaseCard>
  )
}

export default TopMatchCard
