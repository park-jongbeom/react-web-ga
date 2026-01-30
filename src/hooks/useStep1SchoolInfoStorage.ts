import { useEffect, useMemo, useState } from 'react'
import {
  clearStep1SchoolInfo,
  loadStep1SchoolInfo,
  saveStep1SchoolInfo,
  type Step1SchoolInfoForm,
} from '../utils/profileStorage'

const DEFAULT_VALUES: Step1SchoolInfoForm = {
  schoolType: 'high_school',
  schoolName: '',
  schoolLocation: '',
  gpa: '',
  englishTestType: 'TOEFL',
  englishScore: '',
}

export const useStep1SchoolInfoStorage = (
  initialValues?: Partial<Step1SchoolInfoForm>
) => {
  const initialState = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues]
  )

  const [values, setValues] = useState<Step1SchoolInfoForm>(() => {
    const stored = loadStep1SchoolInfo()
    return stored ?? initialState
  })

  useEffect(() => {
    saveStep1SchoolInfo(values)
  }, [values])

  const setField = (field: keyof Step1SchoolInfoForm, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const reset = () => {
    setValues(initialState)
    clearStep1SchoolInfo()
  }

  return {
    values,
    setValues,
    setField,
    reset,
  }
}
