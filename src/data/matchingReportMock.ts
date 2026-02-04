import type {
  IndicatorScores,
  MatchingResponse,
  MatchingResultItem,
  NextStepItem,
  ReportMeta,
} from '../types/matching'

const formatReportDate = (rawDate?: string): string => {
  const base = rawDate ? new Date(rawDate) : new Date()
  if (Number.isNaN(base.getTime())) {
    return new Date().toISOString().slice(0, 10).replaceAll('-', '.')
  }
  const year = base.getFullYear()
  const month = String(base.getMonth() + 1).padStart(2, '0')
  const day = String(base.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export const buildReportMeta = (result: MatchingResponse): ReportMeta => {
  const createdAt = new Date(result.created_at)
  const year = Number.isNaN(createdAt.getTime()) ? new Date().getFullYear() : createdAt.getFullYear()
  const suffix = result.matching_id?.slice(0, 6)?.toUpperCase() || '000000'
  return {
    refId: `GA-${year}-MATCH-${suffix}`,
    date: formatReportDate(result.created_at),
    userLabel: result.user_id || 'Guest',
  }
}

export const buildIndicatorScores = (
  item: MatchingResultItem | undefined
): IndicatorScores => {
  if (!item) {
    return { academicFit: 0, careerOutlook: 0, costEfficiency: 0 }
  }

  // 백엔드에서 제공하는 indicator_scores 우선 사용
  if (item.indicator_scores) {
    return {
      academicFit: item.indicator_scores.academic_fit,
      careerOutlook: item.indicator_scores.career_outlook,
      costEfficiency: item.indicator_scores.cost_efficiency,
    }
  }

  // Fallback: 없으면 기존 계산 방식 (하위 호환)
  const { academic, english, career, location, budget, duration } = item.score_breakdown
  return {
    academicFit: Math.round((academic + english) / 2),
    careerOutlook: Math.round((career + location) / 2),
    costEfficiency: Math.round((budget + duration) / 2),
  }
}

export const buildExecutiveSummary = (
  item: MatchingResultItem | undefined,
  totalMatches: number
): string => {
  if (!item) {
    return '프로필을 분석하여 맞춤형 학교 추천을 제공합니다.'
  }
  return `프로필을 기반으로 ${totalMatches}개의 매칭 결과를 분석하여 ${item.school.name} (${item.program.name})을(를) 최적의 선택으로 선정했습니다.`
}

export const matchingReportMock = {
  footerText: 'Go Almond AI 엔진 v2.4에 의해 생성되었습니다. 디지털 IP 정책에 따라 보호됩니다.',
  pageLabel: '기밀 - 1/1 페이지',
  indicatorDescription:
    '학업 적합도와 진로 전망에서 가장 높은 적합성을 보이며, ROI를 고려한 예산 최적화가 이루어졌습니다.',
  nextSteps: [
    {
      id: 1,
      title: '서류 심사',
      description: 'GPA 및 시험 점수를 업로드하여 최종 검토를 받으세요.',
    },
    {
      id: 2,
      title: 'SOP 워크숍',
      description: '전문 편집자와의 세션을 예약하세요.',
    },
    {
      id: 3,
      title: '지원 포털 접근',
      description: 'Go Almond에서 공통 지원서 대시보드를 열어드립니다.',
    },
    {
      id: 4,
      title: '비자 준비',
      description: 'I-20 서류 작성 및 인터뷰 교육을 시작하세요.',
    },
  ] satisfies NextStepItem[],
}
