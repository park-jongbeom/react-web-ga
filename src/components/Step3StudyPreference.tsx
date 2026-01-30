import BaseInput from './ui/BaseInput'
import { BaseText } from './ui/Typography'
import BudgetSlider from './BudgetSlider'
import LocationSelector from './LocationSelector'

export type Step3StudyPreferenceValues = {
  programType: 'Vocational' | 'Community' | 'University' | ''
  major: string
  budget: number
  locations: string[]
  studyDuration: '1_year' | '2_years' | '4_years' | ''
  stayAfterGraduation: 'yes' | 'no' | ''
}

export type Step3StudyPreferenceErrors = Partial<
  Record<keyof Step3StudyPreferenceValues, string>
>

type Step3StudyPreferenceProps = {
  values: Step3StudyPreferenceValues
  errors?: Step3StudyPreferenceErrors
  onChange: (
    field: keyof Step3StudyPreferenceValues,
    value: string | number | string[]
  ) => void
}

const PROGRAM_OPTIONS = [
  { value: 'Vocational', label: 'Vocational School' },
  { value: 'Community', label: 'Community College' },
  { value: 'University', label: 'University' },
]

const LOCATION_OPTIONS = [
  'California',
  'New York',
  'Texas',
  'Washington',
  'Florida',
  'Massachusetts',
]

const STUDY_DURATIONS = [
  { value: '1_year', label: '1년' },
  { value: '2_years', label: '2년' },
  { value: '4_years', label: '4년' },
]

function Step3StudyPreference({
  values,
  errors = {},
  onChange,
}: Step3StudyPreferenceProps) {
  return (
    <div className="space-y-6">
      <div>
        <BaseText variant="label" className="text-foreground">
          프로그램 유형
        </BaseText>
        <div className="mt-3 flex flex-wrap gap-4">
          {PROGRAM_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="programType"
                value={option.value}
                checked={values.programType === option.value}
                onChange={(event) =>
                  onChange('programType', event.target.value)
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.programType && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.programType}
          </BaseText>
        )}
      </div>

      <BaseInput
        id="major"
        label="희망 전공/직업"
        placeholder="예: Computer Science, UX Designer"
        value={values.major}
        onChange={(event) => onChange('major', event.target.value)}
        hasError={!!errors.major}
        errorText={errors.major}
      />

      <div>
        <BudgetSlider
          value={values.budget}
          onChange={(value) => onChange('budget', value)}
        />
        {errors.budget && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.budget}
          </BaseText>
        )}
      </div>

      <LocationSelector
        options={LOCATION_OPTIONS}
        selected={values.locations}
        onChange={(next) => onChange('locations', next)}
        errorText={errors.locations}
      />

      <div>
        <BaseText variant="label" className="text-foreground">
          학업 기간
        </BaseText>
        <div className="mt-3 flex flex-wrap gap-4">
          {STUDY_DURATIONS.map((duration) => (
            <label key={duration.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="studyDuration"
                value={duration.value}
                checked={values.studyDuration === duration.value}
                onChange={(event) =>
                  onChange('studyDuration', event.target.value)
                }
              />
              <span>{duration.label}</span>
            </label>
          ))}
        </div>
        {errors.studyDuration && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.studyDuration}
          </BaseText>
        )}
      </div>

      <div>
        <BaseText variant="label" className="text-foreground">
          졸업 후 체류 의사 (OPT)
        </BaseText>
        <div className="mt-3 flex flex-wrap gap-4">
          {[
            { value: 'yes', label: '예' },
            { value: 'no', label: '아니오' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="stayAfterGraduation"
                value={option.value}
                checked={values.stayAfterGraduation === option.value}
                onChange={(event) =>
                  onChange('stayAfterGraduation', event.target.value)
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.stayAfterGraduation && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.stayAfterGraduation}
          </BaseText>
        )}
      </div>
    </div>
  )
}

export default Step3StudyPreference
