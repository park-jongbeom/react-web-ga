import BaseInput from './ui/BaseInput'
import BaseTextarea from './ui/BaseTextarea'
import { BaseText } from './ui/Typography'

export type Step2PersonalInfoValues = {
  birthDate: string
  mbti: string
  traits: string
  introduction: string
}

export type Step2PersonalInfoErrors = Partial<
  Record<keyof Step2PersonalInfoValues, string>
>

type Step2PersonalInfoProps = {
  values: Step2PersonalInfoValues
  errors?: Step2PersonalInfoErrors
  onChange: (field: keyof Step2PersonalInfoValues, value: string) => void
}

const MBTI_OPTIONS = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
]

function Step2PersonalInfo({
  values,
  errors = {},
  onChange,
}: Step2PersonalInfoProps) {
  return (
    <div className="space-y-6">
      <BaseInput
        id="birthDate"
        label="생년월일"
        type="date"
        value={values.birthDate}
        onChange={(event) => onChange('birthDate', event.target.value)}
        hasError={!!errors.birthDate}
        errorText={errors.birthDate}
      />

      <div>
        <BaseText variant="label" className="text-foreground">
          MBTI
        </BaseText>
        <div className="mt-2">
          <select
            value={values.mbti}
            onChange={(event) => onChange('mbti', event.target.value)}
            className="w-full rounded-lg border border-border bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-200"
          >
            <option value="">선택하세요</option>
            {MBTI_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {errors.mbti && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.mbti}
          </BaseText>
        )}
      </div>

      <BaseTextarea
        id="traits"
        label="본인 성향 (선택)"
        placeholder="예: 꼼꼼하고 계획적인 편이에요."
        rows={4}
        value={values.traits}
        onChange={(event) => onChange('traits', event.target.value)}
        hasError={!!errors.traits}
        errorText={errors.traits}
      />

      <BaseTextarea
        id="introduction"
        label="자기소개 (선택)"
        placeholder="간단한 자기소개를 입력해주세요."
        rows={5}
        value={values.introduction}
        onChange={(event) => onChange('introduction', event.target.value)}
        hasError={!!errors.introduction}
        errorText={errors.introduction}
      />
    </div>
  )
}

export default Step2PersonalInfo
