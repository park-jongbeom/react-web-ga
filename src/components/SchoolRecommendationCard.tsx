import BaseCard from './ui/BaseCard'
import BaseBadge from './ui/BaseBadge'
import BaseButton from './ui/BaseButton'
import { BaseHeading, BaseText } from './ui/Typography'
import type { MatchingResultItem } from '../types/matching'

type SchoolRecommendationCardProps = {
  item: MatchingResultItem
}

function SchoolRecommendationCard({ item }: SchoolRecommendationCardProps) {
  const { rank, school, program, total_score, explanation, pros, cons } = item

  return (
    <BaseCard variant="interactive" className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BaseBadge variant="success">#{rank}</BaseBadge>
            <BaseHeading level={3} className="text-lg">
              {school.name}
            </BaseHeading>
          </div>
          <BaseText variant="caption" className="text-foreground-muted">
            {school.city}, {school.state}
          </BaseText>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {Math.round(total_score)}%
          </div>
          <BaseText variant="caption">매칭률</BaseText>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <BaseText variant="label">프로그램</BaseText>
          <BaseText>{program.name}</BaseText>
        </div>
        <div className="flex justify-between">
          <BaseText variant="label">학위</BaseText>
          <BaseText>{program.degree}</BaseText>
        </div>
        <div className="flex justify-between">
          <BaseText variant="label">학비</BaseText>
          <BaseText>${school.tuition.toLocaleString()}</BaseText>
        </div>
      </div>

      <div className="bg-primary-50 p-3 rounded-lg mb-4">
        <BaseText variant="caption" className="text-primary-800">
          {explanation}
        </BaseText>
      </div>

      {pros?.length > 0 && (
        <div className="mb-3">
          <BaseText variant="label" className="mb-1">
            장점
          </BaseText>
          <ul className="list-disc list-inside space-y-1">
            {pros.slice(0, 2).map((pro, index) => (
              <BaseText key={`pro-${index}`} variant="caption" className="text-success-700">
                {pro}
              </BaseText>
            ))}
          </ul>
        </div>
      )}

      {cons?.length > 0 && (
        <div className="mb-4">
          <BaseText variant="label" className="mb-1">
            유의 사항
          </BaseText>
          <ul className="list-disc list-inside space-y-1">
            {cons.slice(0, 2).map((con, index) => (
              <BaseText key={`con-${index}`} variant="caption" className="text-danger-700">
                {con}
              </BaseText>
            ))}
          </ul>
        </div>
      )}

      <BaseButton variant="outline" fullWidth>
        자세히 보기
      </BaseButton>
    </BaseCard>
  )
}

export default SchoolRecommendationCard
