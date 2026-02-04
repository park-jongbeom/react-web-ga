import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NextStepsSection from '../NextStepsSection'
import type { NextStepItem } from '../../types/matching'

const steps: NextStepItem[] = [
  {
    id: 1,
    title: 'Document Audit',
    description: 'Upload your GPA and test scores for final review.',
  },
  {
    id: 2,
    title: 'SOP Workshop',
    description: 'Schedule session with our specialized editors.',
  },
  {
    id: 3,
    title: 'Portal Access',
    description: 'Go Almond will open your common app dashboard.',
  },
  {
    id: 4,
    title: 'Visa Prep',
    description: 'Start I-20 documentation and interview training.',
  },
]

describe('NextStepsSection', () => {
  it('타이틀과 4단계 카드를 표시해야 한다', () => {
    render(<NextStepsSection steps={steps} />)

    expect(screen.getByText('지원 방법: 다음 단계')).toBeInTheDocument()
    expect(screen.getByText('Document Audit')).toBeInTheDocument()
    expect(screen.getByText('SOP Workshop')).toBeInTheDocument()
    expect(screen.getByText('Portal Access')).toBeInTheDocument()
    expect(screen.getByText('Visa Prep')).toBeInTheDocument()
  })
})
