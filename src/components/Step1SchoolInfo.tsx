import BaseInput from './ui/BaseInput'
import BaseSelect from './ui/BaseSelect'

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
      <BaseSelect
        id="schoolType"
        label="출신학교 유형"
        value={values.schoolType}
        onChange={(event) => onChange('schoolType', event.target.value)}
        hasError={!!errors.schoolType}
        errorText={errors.schoolType}
      >
        <option value="high_school">고등학교</option>
        <option value="university">대학교</option>
      </BaseSelect>

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

      <BaseSelect
        id="englishTestType"
        label="영어 시험 종류"
        value={values.englishTestType}
        onChange={(event) => onChange('englishTestType', event.target.value)}
        hasError={!!errors.englishTestType}
        errorText={errors.englishTestType}
      >
        <option value="TOEFL">TOEFL</option>
        <option value="IELTS">IELTS</option>
      </BaseSelect>

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
