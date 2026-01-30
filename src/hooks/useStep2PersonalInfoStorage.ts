import { useEffect, useMemo, useState } from 'react'
import {
  clearStep2PersonalInfo,
  loadStep2PersonalInfo,
  saveStep2PersonalInfo,
  type Step2PersonalInfoForm,
} from '../utils/profileStorage'

const DEFAULT_VALUES: Step2PersonalInfoForm = {
  birthDate: '',
  mbti: '',
  traits: '',
  introduction: '',
}

export const useStep2PersonalInfoStorage = (
  initialValues?: Partial<Step2PersonalInfoForm>
) => {
  const initialState = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues]
  )

  const [values, setValues] = useState<Step2PersonalInfoForm>(() => {
    const stored = loadStep2PersonalInfo()
    return stored ?? initialState
  })

  useEffect(() => {
    saveStep2PersonalInfo(values)
  }, [values])

  const setField = (field: keyof Step2PersonalInfoForm, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const reset = () => {
    setValues(initialState)
    clearStep2PersonalInfo()
  }

  return {
    values,
    setValues,
    setField,
    reset,
  }
}
