/**
 * 매칭 결과 확장 필드 포맷팅 유틸.
 * API 응답의 ROI/급여/랭킹/네트워크 값을 UI 표시용 문자열로 변환한다.
 */

const FALLBACK = 'N/A'

export function formatRoi(roi: number | null | undefined): string {
  if (roi == null || Number.isNaN(roi)) return FALLBACK
  return `${roi}%`
}

export function formatSalary(salary: number | null | undefined): string {
  if (salary == null || Number.isNaN(salary)) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary)
}

export function formatRanking(
  ranking: string | null | undefined,
  field: string | null | undefined
): string {
  if (ranking == null || ranking === '') return FALLBACK
  if (field != null && field !== '') return `${ranking} (${field})`
  return ranking
}

export function formatNetwork(count: number | null | undefined): string {
  if (count == null || Number.isNaN(count)) return FALLBACK
  const formatted = new Intl.NumberFormat('en-US').format(count)
  return `${formatted}+`
}
