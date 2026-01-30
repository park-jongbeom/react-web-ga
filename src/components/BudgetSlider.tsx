import { BaseText } from './ui/Typography'

type BudgetSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function BudgetSlider({
  value,
  onChange,
  min = 20000,
  max = 80000,
  step = 1000,
}: BudgetSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <BaseText variant="label" className="text-foreground">
          연간 예산 범위
        </BaseText>
        <BaseText variant="caption">${value.toLocaleString()}</BaseText>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full"
      />
    </div>
  )
}

export default BudgetSlider
