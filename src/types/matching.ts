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

export interface TopMatchExtras {
  estimatedRoi: string
  averageSalary: string
  globalRanking: string
  alumniNetwork: string
  featureBadges: string[]
}

export interface NextStepItem {
  id: number
  title: string
  description: string
}
