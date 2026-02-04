# 변경 이력: 매칭 결과 리포트 UI 적용

## 배경
- 투자자 데모용 리포트 스타일 매칭 결과 화면이 필요
- 레퍼런스 이미지 기준 6개 섹션 구성 요구
- API 미제공 필드는 프론트 정적/더미 데이터로 우선 표시

## 변경 내용
- `MatchingResult` 페이지를 리포트 레이아웃으로 전면 재구성
- 신규 컴포넌트 추가: TopMatchCard, MatchingIndicatorBars, TopMatchDetail, NextStepsSection, ReportFooter
- 정적/더미 데이터 매핑 레이어 추가 (`matchingReportMock.ts`)
- 매칭 지표 Radar 차트 레이블 영문화
- 매칭 결과 리포트 관련 테스트 추가 및 갱신
- 백엔드 데이터 요구사항 문서 신규 작성

## 영향 파일
- `src/pages/MatchingResult.tsx`
- `src/components/*` 신규 컴포넌트
- `src/data/matchingReportMock.ts`
- `src/types/matching.ts`
- `docs/frontend/matching-result-design-spec.md`
- `docs/frontend/backend-data-requirements.md`

## 테스트
- `docker exec -i cool_carson sh -lc "cd /app && npm test"`
