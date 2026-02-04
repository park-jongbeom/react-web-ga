import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { ScoreBreakdown } from '../types/matching'

type MatchingRadarChartProps = {
  scores: ScoreBreakdown
}

function MatchingRadarChart({ scores }: MatchingRadarChartProps) {
  const data = [
    { category: 'ACADEMIC', value: scores.academic, fullMark: 100 },
    { category: 'ENGLISH', value: scores.english, fullMark: 100 },
    { category: 'BUDGET', value: scores.budget, fullMark: 100 },
    { category: 'REGION', value: scores.location, fullMark: 100 },
    { category: 'DURATION', value: scores.duration, fullMark: 100 },
    { category: 'CAREER', value: scores.career, fullMark: 100 },
  ]

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar
          name="매칭 점수"
          dataKey="value"
          stroke="var(--color-primary-600)"
          fill="var(--color-primary-600)"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default MatchingRadarChart
