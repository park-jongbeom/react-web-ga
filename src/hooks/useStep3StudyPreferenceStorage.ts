import { useEffect, useMemo, useState } from 'react'
import {
  clearStep3StudyPreference,
  loadStep3StudyPreference,
  saveStep3StudyPreference,
  type Step3StudyPreferenceForm,
} from '../utils/profileStorage'

const DEFAULT_VALUES: Step3StudyPreferenceForm = {
  programType: '',
  major: '',
  budget: 50000,
  locations: [],
  studyDuration: '',
  stayAfterGraduation: '',
}

export const useStep3StudyPreferenceStorage = (
  initialValues?: Partial<Step3StudyPreferenceForm>
) => {
  const initialState = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues]
  )

  const [values, setValues] = useState<Step3StudyPreferenceForm>(() => {
    const stored = loadStep3StudyPreference()
    return stored ?? initialState
  })

  useEffect(() => {
    saveStep3StudyPreference(values)
  }, [values])

  const setField = (
    field: keyof Step3StudyPreferenceForm,
    value: string | number | string[]
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const reset = () => {
    setValues(initialState)
    clearStep3StudyPreference()
  }

  return {
    values,
    setValues,
    setField,
    reset,
  }
}
