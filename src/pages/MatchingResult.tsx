import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BaseContainer, BaseSection, BaseGrid } from '../components/ui/Layout'
import { BaseHeading, BaseText } from '../components/ui/Typography'
import BaseButton from '../components/ui/BaseButton'
import BaseSpinner from '../components/ui/BaseSpinner'
import BasePanel from '../components/ui/BasePanel'
import MatchingRadarChart from '../components/MatchingRadarChart'
import MatchingScoreGauge from '../components/MatchingScoreGauge'
import MatchingIndicatorBars from '../components/MatchingIndicatorBars'
import NextStepsSection from '../components/NextStepsSection'
import ReportFooter from '../components/ReportFooter'
import TopMatchCard from '../components/TopMatchCard'
import TopMatchDetail from '../components/TopMatchDetail'
import {
  buildExecutiveSummary,
  buildIndicatorScores,
  buildReportMeta,
  matchingReportMock,
} from '../data/matchingReportMock'
import type { MatchingResponse } from '../types/matching'

const SESSION_KEY = 'matchingResult'

const loadMatchingResultFromSession = (): MatchingResponse | null => {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (!stored) return null
    return JSON.parse(stored) as MatchingResponse
  } catch {
    return null
  }
}

function MatchingResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const [result, setResult] = useState<MatchingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stateResult = location.state?.matchingResult as MatchingResponse | undefined
    const sessionResult = loadMatchingResultFromSession()

    if (stateResult) {
      setResult(stateResult)
      setIsLoading(false)
      return
    }

    if (sessionResult) {
      setResult(sessionResult)
      setIsLoading(false)
      return
    }

    setError('매칭 결과가 없습니다. 프로필을 먼저 입력해주세요.')
    setIsLoading(false)
  }, [location.state])

  const getRepresentativeScore = () => {
    if (!result || result.results.length === 0) return 0
    return Math.round(result.results[0].total_score)
  }

  if (isLoading) {
    return (
      <BaseContainer>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <BaseSpinner size="lg" />
          <BaseText className="mt-4">매칭 결과를 분석 중입니다...</BaseText>
        </div>
      </BaseContainer>
    )
  }

  if (error || !result) {
    return (
      <BaseContainer>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <BaseText className="text-danger-600 mb-4">
            {error || '결과를 찾을 수 없습니다.'}
          </BaseText>
          <BaseButton onClick={() => navigate('/profile/step1')}>
            프로필 입력으로 이동
          </BaseButton>
        </div>
      </BaseContainer>
    )
  }

  const topMatches = result.results.slice(0, 3)
  const topMatch = topMatches[0]
  const reportMeta = buildReportMeta(result)
  const indicatorScores = buildIndicatorScores(topMatch)
  const executiveSummary = buildExecutiveSummary(topMatch, result.total_matches)

  return (
    <BaseContainer>
      <BaseSection className="space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="GO ALMOND" className="h-12 w-12 rounded-full" />
            <div>
              <BaseText variant="caption" className="text-foreground-muted">
                AI-MATCHING INTELLIGENCE
              </BaseText>
              <BaseHeading level={2}>GO ALMOND</BaseHeading>
            </div>
          </div>
          <div className="text-left md:text-right space-y-1">
            <BaseHeading level={1} className="text-2xl">
              Personalized Study Report
            </BaseHeading>
            <BaseText variant="caption" className="text-foreground-muted">
              User: {reportMeta.userLabel}
            </BaseText>
            <BaseText variant="caption" className="text-foreground-muted">
              Ref: {reportMeta.refId} · Date: {reportMeta.date}
            </BaseText>
          </div>
        </div>

        <BasePanel className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-50 text-success-600 flex items-center justify-center">
              ✓
            </div>
            <BaseHeading level={3}>EXECUTIVE SUMMARY</BaseHeading>
          </div>
          <div className="grid gap-6 md:grid-cols-[1fr_240px] items-start">
            <BaseText className="text-foreground-muted">{executiveSummary}</BaseText>
            <div className="bg-surface-subtle rounded-xl p-4">
              <MatchingScoreGauge score={getRepresentativeScore()} />
            </div>
          </div>
          {result.message && (
            <div className="bg-warning-50 p-3 rounded-lg">
              <BaseText variant="caption" className="text-warning-800">
                {result.message}
              </BaseText>
            </div>
          )}
          <BaseGrid cols={3} gap="md">
            {topMatches.map((item, index) => (
              <TopMatchCard key={item.school.id} item={item} isPrimary={index === 0} />
            ))}
          </BaseGrid>
        </BasePanel>

        {topMatch && (
          <BasePanel className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center">
                ✦
              </div>
              <BaseHeading level={3}>MATCHING INDICATORS</BaseHeading>
            </div>
            <div className="grid gap-6 md:grid-cols-2 items-start">
              <div className="bg-surface rounded-xl p-4 border border-border">
                <MatchingRadarChart scores={topMatch.score_breakdown} />
              </div>
              <MatchingIndicatorBars
                scores={indicatorScores}
                description={matchingReportMock.indicatorDescription}
              />
            </div>
          </BasePanel>
        )}

        {topMatch && (
          <BasePanel className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary-50 text-success-600 flex items-center justify-center">
                ✓
              </div>
              <BaseHeading level={3}>DEEP DIVE: TOP MATCH</BaseHeading>
            </div>
            <TopMatchDetail item={topMatch} />
          </BasePanel>
        )}

        <NextStepsSection steps={matchingReportMock.nextSteps} />

        <ReportFooter
          footerText={matchingReportMock.footerText}
          pageLabel={matchingReportMock.pageLabel}
        />

        <div className="flex gap-4 justify-center">
          <BaseButton variant="outline" onClick={() => navigate('/profile/step1')}>
            프로필 수정
          </BaseButton>
          <BaseButton onClick={() => navigate('/dashboard')}>대시보드로 이동</BaseButton>
        </div>
      </BaseSection>
    </BaseContainer>
  )
}

export default MatchingResult
