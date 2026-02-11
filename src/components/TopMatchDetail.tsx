import BaseCard from './ui/BaseCard'
import BaseBadge from './ui/BaseBadge'
import BaseButton from './ui/BaseButton'
import { BaseHeading, BaseText } from './ui/Typography'
import {
  formatRoi,
  formatSalary,
  formatRanking,
  formatNetwork,
} from '../utils/matchingDataHelper'
import type { MatchingResultItem } from '../types/matching'

type TopMatchDetailProps = {
  item: MatchingResultItem
}

function TopMatchDetail({ item }: TopMatchDetailProps) {
  const { school, explanation, pros, cons } = item
  const roiText = formatRoi(item.estimated_roi ?? null)
  const salaryText = formatSalary(school.average_salary ?? null)
  const rankingText = formatRanking(school.global_ranking ?? null, school.ranking_field ?? null)
  const networkText = formatNetwork(school.alumni_network_count ?? null)
  const badges = school.feature_badges ?? []
  const employmentRateText =
    typeof school.employment_rate === 'number' ? `${school.employment_rate}%` : 'N/A'
  const hasDormitory = school.facilities?.dormitory ? '제공' : '미제공'
  const eslText = school.esl_program?.available ? '제공' : '미제공'

  return (
    <BaseCard variant="outline" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BaseBadge className="bg-neutral-900 text-white">최우선 추천</BaseBadge>
        <BaseButton size="sm">PDF 리포트 다운로드</BaseButton>
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
            글로벌 랭킹: {rankingText}
          </BaseText>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <BaseText variant="label">평균 초봉</BaseText>
              <BaseText>{salaryText}</BaseText>
            </div>
            <div>
              <BaseText variant="label">동문 네트워크</BaseText>
              <BaseText>{networkText}</BaseText>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <BaseText variant="label">취업률</BaseText>
              <BaseText>{employmentRateText}</BaseText>
            </div>
            <div>
              <BaseText variant="label">기숙사</BaseText>
              <BaseText>{hasDormitory}</BaseText>
            </div>
            <div>
              <BaseText variant="label">ESL 프로그램</BaseText>
              <BaseText>{eslText}</BaseText>
            </div>
          </div>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full text-xs border border-border text-foreground-muted"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="bg-warning-50 border border-accent-500 rounded-xl px-4 py-3 text-center">
          <BaseText variant="caption" className="text-warning-800">
            예상 ROI {roiText} (연간)
          </BaseText>
        </div>
      </div>

      {explanation && (
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
          <BaseHeading level={3} className="text-base mb-2">
            추천 이유
          </BaseHeading>
          <BaseText variant="caption" className="text-primary-800">
            {explanation}
          </BaseText>
        </div>
      )}

      {pros.length > 0 && (
        <div>
          <BaseHeading level={3} className="text-base mb-2">
            장점
          </BaseHeading>
          <ul className="list-disc list-inside space-y-1">
            {pros.map((pro, index) => (
              <li key={`pro-${index}`}>
                <BaseText variant="caption" className="text-success-700 inline">
                  {pro}
                </BaseText>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cons.length > 0 && (
        <div>
          <BaseHeading level={3} className="text-base mb-2">
            유의 사항
          </BaseHeading>
          <ul className="list-disc list-inside space-y-1">
            {cons.map((con, index) => (
              <li key={`con-${index}`}>
                <BaseText variant="caption" className="text-danger-700 inline">
                  {con}
                </BaseText>
              </li>
            ))}
          </ul>
        </div>
      )}
    </BaseCard>
  )
}

export default TopMatchDetail
