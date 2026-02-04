type MatchingScoreGaugeProps = {
  score: number
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-success-600'
  if (score >= 60) return 'text-warning-600'
  return 'text-danger-600'
}

function MatchingScoreGauge({ score }: MatchingScoreGaugeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}%</div>
      <p className="text-foreground-muted text-sm mt-2">전체 매칭률</p>
    </div>
  )
}

export default MatchingScoreGauge
