# 2026-01-26 (v2): JIRA 이슈 백엔드 형식 적용

## 작업 배경
백엔드 JIRA 이슈 형식에 맞춰 프론트엔드 JIRA 이슈 재작성

## 백엔드 JIRA 형식 특징
1. Story Points = 시간 기반 (1 SP = 1시간)
2. User Story 형식 ("AS A ... I WANT ... SO THAT ...")
3. Epic → Story → Tasks 구조
4. Acceptance Criteria 체크박스 형식
5. Technical Notes 포함
6. Definition of Done 명시
7. 백엔드 협업 타임라인 명시

## 주요 변경사항

### 1. 프로젝트 코드 변경
- **기존**: GOFE (Go Almond Frontend)
- **변경**: GAMF (Go Almond Matching Frontend)
- **이유**: 백엔드 GAM (Go Almond Matching)과 일관성

### 2. Epic 구조 변경
- **기존**: 
  - GOFE-1 (Week 1), GOFE-10 (Week 2), GOFE-19 (Week 3)
- **변경**:
  - GAMF-1 (Week 1: 인증 & 프로필 입력)
  - GAMF-2 (Week 2: 매칭 결과 & API 연동)
  - GAMF-3 (Week 3: 지원 관리 & 완료)

### 3. Story 번호 체계
- **기존**: GOFE-2, GOFE-3, ... (순차적)
- **변경**: GAMF-11, GAMF-12, ... (Epic 번호 + 순번)
  - Epic 1: GAMF-11 ~ GAMF-18 (8개)
  - Epic 2: GAMF-21 ~ GAMF-28 (8개)
  - Epic 3: GAMF-31 ~ GAMF-34 (4개)

### 4. Story Point 산정
- **기존**: 작업 복잡도 기반
- **변경**: 시간 기반 (1 SP = 1시간)
- **주당 가용 SP**: 24 SP (하루 6시간 × 주 4일)

### 5. User Story 형식 추가
```
AS A [역할]
I WANT [기능]
SO THAT [목적]
```

예시:
```
AS A 학생 사용자
I WANT 이메일과 비밀번호로 회원가입하고 로그인하며
SO THAT AI 매칭 서비스를 사용할 수 있다
```

### 6. Acceptance Criteria
- 모든 Story에 체크박스 형식 검증 기준 추가
- 명확한 검증 가능한 항목으로 작성

### 7. Technical Notes
- 파일 위치 명시
- 주요 코드 스니펫 포함
- 사용할 라이브러리 명시

예시:
```typescript
// 파일 위치
src/pages/Signup.tsx
src/pages/Login.tsx

// Zod 스키마
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

### 8. Definition of Done
- 각 Story마다 완료 기준 명시
- 테스트 포함 여부 명시

### 9. 백엔드 협업 타임라인 추가
| 시점 | 백엔드 상태 | 프론트엔드 작업 가능 범위 |
|------|-----------|---------------------|
| Week 1 시작 | Mock API 제공 | ✅ 전체 UI 개발 시작 |
| Week 1 종료 | User Profile API | ✅ 실제 API 연동 |
| Week 2 중간 | 매칭 API | ✅ 실제 매칭 결과 연동 |
| Week 3 시작 | Application API | ✅ 지원 관리 연동 |

### 10. 백엔드 의존성 체크리스트
- Week별 백엔드 API 완성 여부 체크
- 백엔드 Story ID 참조 (예: GAM-11, GAM-22)

---

## Story 상세 변경 예시

### Story GAMF-11: 회원가입/로그인

#### 기존 (GOFE-2)
- Story Point: 4h
- 설명: 간단한 설명
- Task 4개

#### 변경 (GAMF-11)
- **Story Type**: Story
- **Priority**: Critical
- **Story Points**: 4 SP
- **Assignee**: Frontend Developer
- **Sprint**: Week 1
- **Labels**: `authentication`, `week1`, `core-feature`

**User Story**:
```
AS A 학생 사용자
I WANT 이메일과 비밀번호로 회원가입하고 로그인하며
SO THAT AI 매칭 서비스를 사용할 수 있다
```

**Acceptance Criteria** (9개 항목):
- [ ] 회원가입 폼 렌더링
- [ ] 이메일 형식 검증
- [ ] 비밀번호 강도 검증
- [ ] 회원가입 후 자동 로그인
- [ ] JWT 토큰 localStorage에 저장
- [ ] 로그인 폼 렌더링
- [ ] 로그인 실패 시 에러 메시지
- [ ] "비밀번호 찾기" 링크
- [ ] ProtectedRoute 인증 체크

**Tasks** (4개, 시간 명시):
- [ ] GAMF-11-1: SignupForm.tsx 구현 - 1.5h
- [ ] GAMF-11-2: LoginForm.tsx 구현 - 1h
- [ ] GAMF-11-3: AuthService API 연동 - 1h
- [ ] GAMF-11-4: JWT 토큰 저장 로직 - 0.5h

**Technical Notes**:
```typescript
// 파일 위치
src/pages/Signup.tsx
src/pages/Login.tsx

// Zod 스키마
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

**Definition of Done**:
- 회원가입 및 로그인 플로우 정상 동작
- JWT 토큰 저장 및 인증 체크 확인
- Vitest 단위 테스트 작성 완료

---

## Sprint 요약

### Sprint 1 (Week 1): 인증 & 프로필 입력
- **Epic**: GAMF-1
- **Stories**: GAMF-11 ~ GAMF-18 (8개)
- **Total SP**: 24 SP
- **Goal**: 사용자 인증 및 AI 매칭 필수 정보 수집
- **Deliverables**: 회원가입/로그인, 프로필 입력 (3단계), Mock API 연동

### Sprint 2 (Week 2): 매칭 결과 & API 연동
- **Epic**: GAMF-2
- **Stories**: GAMF-21 ~ GAMF-28 (8개)
- **Total SP**: 24 SP
- **Goal**: AI 매칭 실행 및 결과 시각화
- **Deliverables**: 매칭 실행 UI, 6대 지표 Radar Chart, Top 5 학교 리스트, 학교 상세

### Sprint 3 (Week 3): 지원 관리 & 완료
- **Epic**: GAMF-3
- **Stories**: GAMF-31 ~ GAMF-34 (4개)
- **Total SP**: 12 SP
- **Goal**: 지원 관리 기능 및 대시보드 완성, 최종 통합 테스트
- **Deliverables**: 지원하기 기능, 대시보드, E2E 테스트, 반응형 최적화

**총 예상 기간**: 2.5주 (60 SP)

---

## 백엔드 JIRA와의 일관성

### 공통 요소
1. ✅ Story Points = 시간 기반 (1 SP = 1시간)
2. ✅ User Story 형식
3. ✅ Acceptance Criteria 체크박스
4. ✅ Technical Notes
5. ✅ Definition of Done
6. ✅ Epic → Story → Tasks 구조
7. ✅ 백엔드 의존성 명시

### 차이점
- 백엔드: 주당 10시간 (6주)
- 프론트엔드: 주당 24시간 (2.5주)
- 백엔드: 60 SP (6주 × 10 SP)
- 프론트엔드: 60 SP (2.5주 × 24 SP)

**총 작업 시간은 동일: 60시간**

---

## 산출물

### 주 문서
- `docs/JIRA_ISSUES.md` (백엔드 형식 적용 완료)
  - 3개 Epic (GAMF-1, GAMF-2, GAMF-3)
  - 20개 Story (GAMF-11~18, GAMF-21~28, GAMF-31~34)
  - Story별 Task (GAMF-XX-1, GAMF-XX-2, ...)
  - User Story 형식
  - Acceptance Criteria 체크박스
  - Technical Notes
  - Definition of Done
  - 백엔드 협업 타임라인
  - 백엔드 의존성 체크리스트

### 변경 이력
- `docs/History/2026-01-26-jira-issues-v2.md` (이 파일)

---

## JIRA 등록 가이드 (백엔드와 동일)

### Epic 생성
1. Project → Create Issue → Epic
2. Epic Name 입력 (예: "인증 & 프로필 입력")
3. Business Value 명시
4. Target Sprint 설정 (Week 1/2/3)
5. Total Story Points 입력 (24/24/12 SP)

### Story 생성
1. Epic 하위에 Story 생성
2. Story Type: Story, Task, or Sub-task
3. Priority: Critical, High, Medium, Low
4. Story Points: 1, 2, 3, 4, 5, 6 SP
5. Assignee: Frontend Developer
6. Sprint: Week 1/2/3
7. Labels 추가

### Story 내용 작성
1. **Description**: User Story 형식
2. **Acceptance Criteria**: 체크박스 목록
3. **Tasks**: Sub-task로 생성 (GAMF-XX-1, ...)
4. **Technical Notes**: 코멘트로 추가
5. **Definition of Done**: 코멘트로 추가

### Labels
- `week1`, `week2`, `week3`: 주차별 구분
- `authentication`, `profile`, `matching`: 기능별 구분
- `core-feature`: MVP 핵심 기능
- `api`, `ui`, `testing`, `optimization`: 작업 유형

---

## 다음 단계

### JIRA 등록
1. Epic 3개 생성 (GAMF-1, GAMF-2, GAMF-3)
2. Story 20개 생성 (각 Epic에 연결)
3. Sub-task (Task) 생성 (각 Story에 연결)
4. Sprint 계획 (Week 1/2/3)

### 백엔드 협업
- 백엔드 JIRA 이슈 참조 (GAM-11, GAM-22, GAM-42, ...)
- 백엔드 API 완성 시점에 맞춰 프론트엔드 작업
- 주간 싱크업 미팅 (백엔드 진행 상황 확인)

---

## 커밋 요약
- JIRA 이슈 백엔드 형식 적용
- 프로젝트 코드 GAMF로 변경
- User Story 형식 추가
- Acceptance Criteria, Technical Notes, Definition of Done 추가
- 백엔드 협업 타임라인 및 의존성 체크리스트 추가
