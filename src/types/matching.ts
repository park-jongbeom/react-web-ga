export interface ScoreBreakdown {
  academic: number
  english: number
  budget: number
  location: number
  duration: number
  career: number
}

export interface School {
  id: string
  name: string
  type: string
  state: string
  city: string
  tuition: number
  image_url: string
  /** API 확장: 글로벌 랭킹 표기 (예: "#4 (Computer Science)") */
  global_ranking?: string | null
  /** API 확장: 랭킹 분야 */
  ranking_field?: string | null
  /** API 확장: 평균 초봉 (숫자) */
  average_salary?: number | null
  /** API 확장: 동문 네트워크 수 */
  alumni_network_count?: number | null
  /** API 확장: 특징 배지 목록 */
  feature_badges?: string[]
}

export interface Program {
  id: string
  name: string
  degree: string
  duration: string
  opt_available: boolean
}

export interface MatchingResultItem {
  rank: number
  school: School
  program: Program
  total_score: number
  score_breakdown: ScoreBreakdown
  recommendation_type: string
  explanation: string
  pros: string[]
  cons: string[]
  /** API 확장: 예상 ROI (숫자, %) */
  estimated_roi?: number
  /** API 제공: 프론트 선형 게이지용 통합 지표 (백엔드 계산) */
  indicator_scores?: {
    academic_fit: number
    career_outlook: number
    cost_efficiency: number
  }
}

export interface MatchingResponse {
  matching_id: string
  user_id: string
  total_matches: number
  execution_time_ms: number
  results: MatchingResultItem[]
  created_at: string
  message?: string
}

export interface MatchingRunRequest {
  user_id: string
}

export interface ReportMeta {
  refId: string
  date: string
  userLabel: string
}

export interface IndicatorScores {
  academicFit: number
  careerOutlook: number
  costEfficiency: number
}

export interface NextStepItem {
  id: number
  title: string
  description: string
}
