import BaseCard from './ui/BaseCard'
import BaseBadge from './ui/BaseBadge'
import BaseButton from './ui/BaseButton'
import { BaseHeading, BaseText } from './ui/Typography'
import type { MatchingResultItem, TopMatchExtras } from '../types/matching'

type TopMatchDetailProps = {
  item: MatchingResultItem
  extras: TopMatchExtras
}

function TopMatchDetail({ item, extras }: TopMatchDetailProps) {
  return (
    <BaseCard variant="outline" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BaseBadge className="bg-neutral-900 text-white">Primary Recommendation</BaseBadge>
        <BaseButton size="sm">Download PDF Report</BaseButton>
      </div>
      <div className="grid gap-6 md:grid-cols-[120px_1fr_auto] items-start">
        <div className="flex items-center justify-center h-24 w-24 rounded-2xl bg-surface-subtle text-foreground font-semibold">
          {item.school.name.split(' ').slice(0, 2).join(' ')}
        </div>
        <div className="space-y-3">
          <div>
            <BaseHeading level={3}>{item.school.name}</BaseHeading>
            <BaseText variant="caption" className="text-foreground-muted">
              {item.program.name} · {item.program.degree}
            </BaseText>
          </div>
          <BaseText variant="caption" className="text-success-700">
            Global Ranking: {extras.globalRanking}
          </BaseText>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <BaseText variant="label">Average Starting Salary</BaseText>
              <BaseText>{extras.averageSalary}</BaseText>
            </div>
            <div>
              <BaseText variant="label">Alumni Network</BaseText>
              <BaseText>{extras.alumniNetwork}</BaseText>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {extras.featureBadges.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full text-xs border border-border text-foreground-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-warning-50 border border-accent-500 rounded-xl px-4 py-3 text-center">
          <BaseText variant="caption" className="text-warning-800 uppercase">
            EST. ROI {extras.estimatedRoi} Yearly
          </BaseText>
        </div>
      </div>
    </BaseCard>
  )
}

export default TopMatchDetail
