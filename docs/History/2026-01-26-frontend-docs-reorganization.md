# 2026-01-26: 프론트엔드 문서 폴더 정리

## 작업 배경
프론트엔드 일정 관련 문서들을 별도 폴더로 정리하여 문서 구조 개선

## 변경 내용

### 폴더 생성
- `docs/frontend/` 폴더 생성

### 파일 이동
아래 4개 파일을 `docs/` → `docs/frontend/`로 이동:

1. `frontend-mvp-plan.md` → `docs/frontend/frontend-mvp-plan.md`
   - MVP 계획 (2.5주, 60시간)
   
2. `frontend-workplan.md` → `docs/frontend/frontend-workplan.md`
   - 전체 계획 (13주, 308시간)
   
3. `PLAN_COMPARISON.md` → `docs/frontend/PLAN_COMPARISON.md`
   - MVP vs 전체 계획 비교
   
4. `JIRA_ISSUES.md` → `docs/frontend/JIRA_ISSUES.md`
   - 3 Epic, 20 Story, 60 Task

### 링크 업데이트
- `README.md`에서 프론트엔드 계획 링크 경로 수정
  - `./docs/frontend-mvp-plan.md` → `./docs/frontend/frontend-mvp-plan.md`
  - `./docs/frontend-workplan.md` → `./docs/frontend/frontend-workplan.md`
  - `./docs/PLAN_COMPARISON.md` → `./docs/frontend/PLAN_COMPARISON.md`
  - `./docs/JIRA_ISSUES.md` → `./docs/frontend/JIRA_ISSUES.md`

---

## 정리 후 문서 구조

```
docs/
├── frontend/                          ← 신규 폴더
│   ├── frontend-mvp-plan.md          ← 이동
│   ├── frontend-workplan.md          ← 이동
│   ├── PLAN_COMPARISON.md            ← 이동
│   └── JIRA_ISSUES.md                ← 이동
├── History/
│   ├── 2026-01-23-ui-componentization.md
│   ├── 2026-01-26-frontend-mvp-plan.md
│   ├── 2026-01-26-frontend-workplan.md
│   ├── 2026-01-26-workplan-update-6h.md
│   ├── 2026-01-26-jira-issues-v2.md
│   └── 2026-01-26-frontend-docs-reorganization.md  ← 이 파일
├── 00_DEVELOPMENT_POLICY.md
├── 01_SECURITY_MANIFEST.md
├── 02_ARCHITECTURE_INTEGRATION.md
├── 03_DATA_DEFINITION.md
├── 04_BACKEND_COOPERATION.md
└── ui-components.md
```

---

## 장점

### 1. 문서 구조 개선
- 프론트엔드 관련 문서가 별도 폴더로 분리
- 문서 탐색이 더 쉬워짐

### 2. 일관성
- 백엔드도 유사하게 폴더 구조 정리 가능
- 향후 디자인, QA 등 다른 팀 문서도 폴더로 분리 가능

### 3. 확장성
- 프론트엔드 관련 문서 추가 시 frontend 폴더에 추가
- 예: `docs/frontend/component-guide.md`, `docs/frontend/styling-guide.md`

---

## 다음 단계

### 추가 정리 가능한 항목
- `docs/ui-components.md` → `docs/frontend/ui-components.md` (선택)
- 백엔드 문서도 `docs/backend/` 폴더로 정리 (선택)

### 향후 폴더 구조 (제안)
```
docs/
├── frontend/      ← 프론트엔드 관련
├── backend/       ← 백엔드 관련 (향후)
├── design/        ← 디자인 시스템 (향후)
├── api/           ← API 스펙 (향후)
└── History/       ← 변경 이력
```

---

## 커밋 요약
- 프론트엔드 문서 폴더 정리
- docs/frontend/ 폴더 생성
- 4개 파일 이동 (MVP, 전체 계획, 비교표, JIRA 이슈)
- README.md 링크 업데이트
