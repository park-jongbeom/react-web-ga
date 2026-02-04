# 🤝 Backend Cooperation & Environment

> **📌 공식 API 명세 (Single Source of Truth)**  
> 모든 API 명세, 엔드포인트, 요청/응답 형식은 백엔드 저장소의 공식 문서를 참조하세요:  
> **[프론트엔드 개발 가이드 (FRONTEND_HANDOFF.md)](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/FRONTEND_HANDOFF.md)**  
>
> 📖 상세 API 명세: [docs/api/](https://github.com/park-jongbeom/ga-api-platform/tree/main/docs/api)
> - [auth.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/auth.md) - 회원가입/로그인
> - [user-profile.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/user-profile.md) - 사용자 프로필
> - [matching.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/matching.md) - AI 매칭
> - [programs.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/programs.md) - 프로그램 목록
> - [schools.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/schools.md) - 학교 상세

---

## 1. API Base URL

| 환경 | URL | 설명 |
|------|-----|------|
| **로컬 개발** | `http://localhost:8080` | 백엔드를 로컬에서 실행 시 사용 (CORS 허용됨) |
| **배포 (프로덕션)** | `https://go-almond.ddnsfree.com` | 실제 배포된 API 서버 주소 |

### 환경 변수 설정 (.env.local)

```bash
# API Base URL (로컬 개발 시)
VITE_API_URL=http://localhost:8080

# API Base URL (배포 환경)
VITE_API_URL=https://go-almond.ddnsfree.com
```

**사용 예시**:
```typescript
const API_URL = import.meta.env.VITE_API_URL
const response = await fetch(`${API_URL}/api/v1/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

---

## 2. 인증 (Authentication)

### JWT 토큰 사용

백엔드는 **단일 JWT 토큰**을 반환합니다.

**로그인/회원가입 응답**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "사용자 이름"
    }
  }
}
```

**인증 필요 API 호출 시**:
```typescript
const token = localStorage.getItem('accessToken')
const response = await fetch(`${API_URL}/api/v1/user/profile`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 테스트 계정

백엔드 환경(local/lightsail)에서 제공되는 테스트 계정:

| 항목 | 값 |
|------|-----|
| **이메일** | `test@example.com` |
| **비밀번호** | `test1234Z` |

---

## 3. 공통 응답 형식

모든 API는 다음 래퍼 구조를 사용합니다:

**성공 응답**:
```json
{
  "success": true,
  "data": { /* 실제 데이터 */ },
  "message": null,
  "timestamp": "2026-02-04T12:00:00Z"
}
```

**에러 응답**:
```json
{
  "success": false,
  "data": null,
  "code": "ERROR_CODE",
  "message": "에러 메시지",
  "timestamp": "2026-02-04T12:00:00Z"
}
```

---

## 4. 백엔드 보안 요구사항

프론트엔드에서 준수해야 할 보안 원칙:

### 4.1 CORS 설정
- 백엔드는 다음 Origin을 허용:
  - `http://localhost:5173` (Vite 개발 서버)
  - `http://127.0.0.1:5173`
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
- `credentials: true` 설정 시 쿠키 전송 가능

### 4.2 토큰 관리
- **Access Token**: 현재는 `localStorage`에 저장 (추후 메모리 관리로 개선 예정)
- **Refresh Token**: 향후 HttpOnly 쿠키로 전환 예정 (현재는 미구현)
- 토큰 만료 시 자동 갱신 로직 구현 필요

### 4.3 테넌트 격리 (Tenant Isolation)
- JWT 토큰에 `tenantId` 포함
- 멀티 테넌트 환경에서 `X-Tenant-ID` 헤더 추가 가능
- 백엔드에서 토큰과 헤더 일치 여부 검증

### 4.4 에러 처리
- 민감한 에러 정보 노출 방지
- 일반화된 에러 메시지 사용
- 에러 코드(`code`)를 활용한 UI 분기 처리

### 4.5 입력 검증
- 클라이언트 측 Zod 스키마 검증 (SQL 인젝션, XSS 방어)
- DOMPurify를 통한 HTML 정제
- 백엔드 서버 측에서도 이중 검증 수행

---

## 5. 사용 가능한 API 목록

### 5.1 Auth API (Week 2 완료 ✅)
- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인

### 5.2 User Profile API (Week 2 완료 ✅)
- `GET /api/v1/user/profile` - 통합 프로필 조회 (JWT 필요)
- `PUT /api/v1/user/profile` - 프로필 기본 정보 수정 (JWT 필요)
- `POST /api/v1/user/education` - 학력 정보 입력 (JWT 필요)
- `POST /api/v1/user/preference` - 유학 목표 설정 (JWT 필요)

### 5.3 Matching API (Week 3 완료 ✅)
- `POST /api/v1/matching/run` - AI 매칭 실행 (RAG 기반, JWT 필요)
- `GET /api/v1/matching/result` - 매칭 결과 조회 (Week 4 예정)

### 5.4 Programs & Schools API (Week 1 완료 ✅)
- `GET /api/v1/programs?type=...` - 프로그램 목록 조회
- `GET /api/v1/schools/{schoolId}` - 학교 상세 조회

### 5.5 예정 API (Week 4~5)
- `POST /api/v1/bookmarks` - 보관하기
- `DELETE /api/v1/bookmarks/{id}` - 보관 해제
- `/api/v1/applications/*` - 지원 현황 관리

**전체 작업 현황**: 64/115 완료 (56%)

---

## 6. 로컬 개발 환경 설정

### 6.1 백엔드 로컬 실행
```bash
# 백엔드 저장소에서
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 6.2 프론트엔드 .env.local 설정
```bash
VITE_API_URL=http://localhost:8080
```

### 6.3 CORS 확인
백엔드에서 `http://localhost:5173`을 허용하므로 추가 설정 불필요

---

## 7. 배포 환경

### 7.1 프로덕션 API 주소
```bash
VITE_API_URL=https://go-almond.ddnsfree.com
```

### 7.2 HTTPS 및 보안 헤더
- 프로덕션 환경에서 HTTPS 필수
- HSTS (HTTP Strict Transport Security) 적용
- CSP (Content Security Policy) 헤더 설정

---

## 8. API 변경 사항 추적

백엔드 API가 변경되면 다음을 확인하세요:

1. **[FRONTEND_HANDOFF.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/FRONTEND_HANDOFF.md)** 최신 업데이트 확인
2. **[docs/api/](https://github.com/park-jongbeom/ga-api-platform/tree/main/docs/api)** 해당 API 문서 확인
3. Breaking Change가 있는 경우 프론트엔드 코드 수정
4. TypeScript 타입 정의 업데이트 (`src/types/api.ts`)

---

## 9. 문의 및 이슈

- API 명세 관련 문의: 백엔드 저장소 이슈 등록
- 프론트엔드 연동 문제: 팀 채널 또는 프론트엔드 저장소 이슈 등록