import { describe, it, expect } from 'vitest'
import {
  formatRoi,
  formatSalary,
  formatRanking,
  formatNetwork,
} from '../matchingDataHelper'

describe('matchingDataHelper', () => {
  describe('formatRoi', () => {
    it('숫자 ROI를 "12.5%" 형식으로 반환한다', () => {
      expect(formatRoi(12.5)).toBe('12.5%')
    })
    it('정수를 "%" 붙여 반환한다', () => {
      expect(formatRoi(10)).toBe('10%')
    })
    it('null이면 "N/A"를 반환한다', () => {
      expect(formatRoi(null)).toBe('N/A')
    })
    it('undefined면 "N/A"를 반환한다', () => {
      expect(formatRoi(undefined)).toBe('N/A')
    })
  })

  describe('formatSalary', () => {
    it('숫자를 "$85,000" 형식으로 반환한다', () => {
      expect(formatSalary(85000)).toBe('$85,000')
    })
    it('0이면 "$0"을 반환한다', () => {
      expect(formatSalary(0)).toBe('$0')
    })
    it('null이면 "N/A"를 반환한다', () => {
      expect(formatSalary(null)).toBe('N/A')
    })
    it('undefined면 "N/A"를 반환한다', () => {
      expect(formatSalary(undefined)).toBe('N/A')
    })
  })

  describe('formatRanking', () => {
    it('ranking과 field가 있으면 조합 문자열을 반환한다', () => {
      expect(formatRanking('#4', 'Computer Science')).toBe('#4 (Computer Science)')
    })
    it('ranking만 있으면 ranking만 반환한다', () => {
      expect(formatRanking('#4', null)).toBe('#4')
      expect(formatRanking('#4', undefined)).toBe('#4')
    })
    it('ranking이 null/undefined면 "N/A"를 반환한다', () => {
      expect(formatRanking(null, 'CS')).toBe('N/A')
      expect(formatRanking(undefined, 'CS')).toBe('N/A')
    })
    it('둘 다 null이면 "N/A"를 반환한다', () => {
      expect(formatRanking(null, null)).toBe('N/A')
    })
  })

  describe('formatNetwork', () => {
    it('숫자를 "38,000+" 형식으로 반환한다', () => {
      expect(formatNetwork(38000)).toBe('38,000+')
    })
    it('0이면 "0+"을 반환한다', () => {
      expect(formatNetwork(0)).toBe('0+')
    })
    it('null이면 "N/A"를 반환한다', () => {
      expect(formatNetwork(null)).toBe('N/A')
    })
    it('undefined면 "N/A"를 반환한다', () => {
      expect(formatNetwork(undefined)).toBe('N/A')
    })
  })
})
