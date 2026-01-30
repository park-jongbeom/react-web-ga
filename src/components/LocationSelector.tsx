import { BaseText } from './ui/Typography'

type LocationSelectorProps = {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  label?: string
  errorText?: string
}

function LocationSelector({
  options,
  selected,
  onChange,
  label = '희망 지역 (복수 선택)',
  errorText,
}: LocationSelectorProps) {
  return (
    <div>
      <BaseText variant="label" className="text-foreground">
        {label}
      </BaseText>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((location) => (
          <label key={location} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(location)}
              onChange={(event) => {
                if (event.target.checked) {
                  onChange([...selected, location])
                } else {
                  onChange(selected.filter((item) => item !== location))
                }
              }}
            />
            <span>{location}</span>
          </label>
        ))}
      </div>
      {errorText && (
        <BaseText variant="caption" className="mt-2 text-danger-600">
          {errorText}
        </BaseText>
      )}
    </div>
  )
}

export default LocationSelector
