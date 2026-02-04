# 매칭 결과 백엔드 데이터 요구사항

## 상태: 확장 필드 연동 완료

매칭 API 확장 필드(ROI, 급여, 랭킹, 네트워크, 배지)는 백엔드에서 제공하며, 프론트엔드에서 연동 완료되었습니다.

---

## API 필드 매핑 가이드

### MatchingResultItem 확장

| API 필드 (snake_case) | 타입 | 프론트 표시 | 비고 |
|------------------------|------|-------------|------|
| `estimated_roi` | number | `formatRoi()` → "12.5%" 또는 "N/A" | 연간 예상 ROI (%) |

### School 확장

| API 필드 (snake_case) | 타입 | 프론트 표시 | 비고 |
|------------------------|------|-------------|------|
| `global_ranking` | string \| null | `formatRanking()` 조합 | 예: "#4" |
| `ranking_field` | string \| null | `formatRanking()` 조합 | 예: "Computer Science" |
| `average_salary` | number \| null | `formatSalary()` → "$85,000" 또는 "N/A" | 평균 초봉 |
| `alumni_network_count` | number \| null | `formatNetwork()` → "38,000+" 또는 "N/A" | 동문 네트워크 수 |
| `feature_badges` | string[] | 그대로 배지 목록 렌더 | OPT STEM, ON-CAMPUS HOUSING 등 |

### 포맷팅 유틸

- **위치**: `src/utils/matchingDataHelper.ts`
- **함수**: `formatRoi`, `formatSalary`, `formatRanking`, `formatNetwork`
- null/undefined 시 "N/A" 반환

---

## 참고

- 타입 정의: `src/types/matching.ts` (School, MatchingResultItem)
- 사용 컴포넌트: `TopMatchDetail` — `item` prop만 받고 확장 필드는 item 내부에서 읽음
- 백엔드 API 명세: [matching.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/matching.md)
