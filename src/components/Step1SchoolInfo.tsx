import BaseInput from './ui/BaseInput'
import { BaseText } from './ui/Typography'

export type Step1SchoolInfoValues = {
  schoolType: 'high_school' | 'university'
  schoolName: string
  schoolLocation: string
  gpa: string
  englishTestType: 'TOEFL' | 'IELTS'
  englishScore: string
}

export type Step1SchoolInfoErrors = Partial<
  Record<keyof Step1SchoolInfoValues, string>
>

type Step1SchoolInfoProps = {
  values: Step1SchoolInfoValues
  errors?: Step1SchoolInfoErrors
  onChange: (field: keyof Step1SchoolInfoValues, value: string) => void
}

function Step1SchoolInfo({
  values,
  errors = {},
  onChange,
}: Step1SchoolInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <BaseText variant="label" className="text-foreground">
          출신학교 유형
        </BaseText>
        <div className="mt-2">
          <select
            value={values.schoolType}
            onChange={(event) => onChange('schoolType', event.target.value)}
            className="w-full rounded-lg border border-border bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-200"
          >
            <option value="high_school">고등학교</option>
            <option value="university">대학교</option>
          </select>
        </div>
        {errors.schoolType && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.schoolType}
          </BaseText>
        )}
      </div>

      <BaseInput
        id="schoolName"
        label="학교명"
        placeholder="학교명을 입력하세요"
        value={values.schoolName}
        onChange={(event) => onChange('schoolName', event.target.value)}
        hasError={!!errors.schoolName}
        errorText={errors.schoolName}
      />

      <BaseInput
        id="schoolLocation"
        label="지역"
        placeholder="지역을 입력하세요"
        value={values.schoolLocation}
        onChange={(event) => onChange('schoolLocation', event.target.value)}
        hasError={!!errors.schoolLocation}
        errorText={errors.schoolLocation}
      />

      <BaseInput
        id="gpa"
        label="내신 성적 (GPA)"
        placeholder="0.0 ~ 4.0"
        inputMode="decimal"
        value={values.gpa}
        onChange={(event) => onChange('gpa', event.target.value)}
        hasError={!!errors.gpa}
        errorText={errors.gpa}
      />

      <div>
        <BaseText variant="label" className="text-foreground">
          영어 시험 종류
        </BaseText>
        <div className="mt-2">
          <select
            value={values.englishTestType}
            onChange={(event) => onChange('englishTestType', event.target.value)}
            className="w-full rounded-lg border border-border bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-200"
          >
            <option value="TOEFL">TOEFL</option>
            <option value="IELTS">IELTS</option>
          </select>
        </div>
        {errors.englishTestType && (
          <BaseText variant="caption" className="mt-2 text-danger-600">
            {errors.englishTestType}
          </BaseText>
        )}
      </div>

      <BaseInput
        id="englishScore"
        label="영어 점수"
        placeholder="예: TOEFL 100, IELTS 7.0"
        inputMode="decimal"
        value={values.englishScore}
        onChange={(event) => onChange('englishScore', event.target.value)}
        hasError={!!errors.englishScore}
        errorText={errors.englishScore}
      />
    </div>
  )
}

export default Step1SchoolInfo
