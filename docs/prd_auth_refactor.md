Problem 1-Pager: Auth 및 API 연동 보안 고도화
1. 개요 (Problem & Context)
현재 구현된 LoginPage 및 API 연동 로직은 기본적인 기능만 동작하며, docs/security_manifest.md에 정의된 Enterprise SaaS 보안 표준을 충족하지 못하고 있습니다. 특히 테넌트 격리(Tenant Isolation), CSRF 방어, 엄격한 입력값 검증(Zod) 등이 누락되어 있어 이를 전면 리팩토링해야 합니다.

2. 목표 (Goals)
docs/security_manifest.md의 모든 항목을 준수한 보안 강화형 API 클라이언트 구축.

사용자 경험(UX)을 해치지 않으면서 보안 가이드라인을 100% 반영한 로그인 프로세스 완성.

백엔드 ga-auth-service와의 완벽한 규격 일치 및 타입 안전성 확보.

3. 기술적 제약 사항 (Constraints)
중요: 다음 문구의 내용을 모든 코드 생성 및 수정 시 강제로 반영할 것. "CORS/Preflight, CSRF, XSS+CSP, SSRF, AuthN/AuthZ, RBAC/ABAC+테넌트격리, 최소권한, Validation+SQLi 방어, RateLimit/Bruteforce, 쿠키(HttpOnly·Secure·SameSite)+세션보안, Secret 관리+Rotation, HTTPS/HSTS+보안헤더, AuditLog, 에러노출 차단, 의존성 취약점 점검을 전부 반영하고 테스트까지 통과한 결과만 줘."

4. 상세 구현 요구사항 (Implementation Details)
A. API 통신 계층 (Axios & Interceptors)
파일 위치: src/api/axiosInstance.ts 수정/생성

기능:

X-Tenant-ID 헤더 자동 주입 (LocalStorage 또는 Context에서 추출).

CSRF 방어용 X-XSRF-TOKEN 헤더 처리.

401 에러 발생 시 토큰 갱신(Refresh Token) 또는 로그아웃 처리 로직.

Error Boundary와 연동될 수 있도록 에러 메시지 마스킹(Masking) 처리.

B. 로그인 페이지 및 로직 리팩토링
파일 위치: src/pages/Login/LoginPage.tsx, src/api/authService.ts

기능:

Validation: Zod를 사용하여 이메일/비밀번호 형식 검증 및 에러 메시지 노출.

Bruteforce 방어: 로그인 시도 중 버튼 Disabled 처리 및 로딩 상태 관리.

Cookie: Access Token은 메모리/상태로 관리하고, Refresh Token은 SameSite=Strict 쿠키를 지향하도록 구조 설계.

Audit Log: 로그인 시도 시 성공/실패 여부를 Audit API로 전송하는 로직 추가.

C. 라우팅 및 권한 (AuthZ)
파일 위치: src/routes/ProtectedRoute.tsx

기능:

토큰 유무 및 유효성 검증 후 비인가 유저를 /login으로 리다이렉트.

권한(RBAC) 정보를 읽어 접근 가능 여부 판단.

5. 단계별 작업 지시 (Instructions for Cursor Agent)
[Step 1 - Plan]: @ga-auth-service의 컨트롤러 소스를 읽고 현재의 로그인 API 명세를 확인하라.

[Step 2 - Analyze]: @docs/security_manifest.md를 읽고 현재 리액트 코드에서 누락된 보안 항목 리스트를 작성하라.

[Step 3 - Execute]: 위 명세에 따라 axiosInstance를 먼저 고도화하고, 이후 LoginPage의 유효성 검사 및 에러 처리 로직을 수정하라.

[Step 4 - Review]: 수정된 코드가 보안 명세의 15가지 항목을 모두 충족하는지 검토하고, DOMPurify나 Zod 등 필요한 라이브러리가 없다면 설치 명령어를 제안하라.