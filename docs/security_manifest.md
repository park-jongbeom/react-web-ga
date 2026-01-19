표 형식이 특정 환경에서 깨져 보일 수 있습니다. 가독성을 높이고 복사해서 사용하기 편하도록 계층형 리스트 방식으로 다시 정리해 드립니다.

이 내용을 docs/security_manifest.md에 복사해서 넣으시면 Cursor가 훨씬 더 명확하게 읽어낼 것입니다.

🛡️ Enterprise SaaS Security Manifest (Web Frontend)
이 문서는 ga-api-platform과 연동되는 리액트 웹 프로젝트의 보안 표준 및 코딩 원칙을 정의합니다. 모든 코드 생성 및 리뷰 시 이 문서를 최우선 참조합니다.

1. 인증 및 권한 관리 (AuthN / AuthZ)
인증 및 인가 (AuthN / AuthZ)

JWT 기반 무상태(Stateless) 인증 아키텍처를 채택합니다.

React-Router의 Outlet과 Maps를 조합한 ProtectedRoute를 구현하여 비인가 접근을 차단합니다.

권한 제어 (RBAC / ABAC)

유저의 Role과 Permission을 상수로 관리합니다.

컴포넌트 단위의 세밀한 제어를 위해 Can 컴포넌트 또는 useAbility 커스텀 훅을 도입합니다.

테넌트 격리 (Tenant Isolation)

멀티 테넌시 환경 지원을 위해 모든 API 요청 헤더에 X-Tenant-ID를 자동으로 포함합니다.

클라이언트 단에서 타 테넌트 데이터로의 접근을 1차적으로 필터링합니다.

최소 권한 원칙 (Minimum Privilege)

유저 권한에 따라 UI 노출을 최소화합니다. 권한 없는 버튼은 단순히 비활성화하는 대신 미노출하는 것을 원칙으로 합니다.

2. 통신 및 데이터 보안
CORS 및 프리플라이트 (CORS / Preflight)

개발 환경에서는 Vite 프록시 설정을 사용하고, 운영 환경에서는 Nginx 및 백엔드 Allow-Origin 설정을 허용된 도메인으로 엄격히 제한합니다.

CSRF 방어

Axios 설정에서 withCredentials: true를 활성화합니다.

xsrfCookieName 및 xsrfHeaderName 설정을 통해 XSRF-TOKEN 검증 로직을 강화합니다.

쿠키 보안 (Cookie Security)

Refresh Token 저장 시 HttpOnly, Secure, SameSite=Strict 속성을 강제하여 자바스크립트를 통한 토큰 탈취를 원천 방어합니다.

전송 계층 보안 (HTTPS / HSTS)

모든 통신은 TLS 1.3 이상을 사용합니다.

브라우저가 강제로 HTTPS 접속을 유지하도록 하는 Strict-Transport-Security 헤더를 인식하도록 설계합니다.

3. 공격 방어 및 데이터 검증
XSS 및 CSP 방어

DOMPurify 라이브러리를 사용하여 렌더링 전 데이터의 Sanitization을 수행합니다.

Vite 빌드 시 인라인 스크립트 실행을 금지하는 Content Security Policy (CSP) 메타 태그를 삽입합니다.

데이터 검증 (Validation / SQLi 방어)

Zod 또는 Yup을 사용하여 런타임 데이터 검증을 강제합니다.

모든 사용자 입력값은 백엔드 전송 전 클라이언트 단에서 규격 검증을 선행하여 비정상적인 데이터 주입(Injection)을 방지합니다.

SSRF 방어

클라이언트에서 직접 외부 URL을 호출하는 기능을 제한하며, 필요 시 반드시 백엔드 프록시를 경유하도록 설계합니다.

속도 제한 및 브루트포스 방어 (RateLimit / Bruteforce)

동일 요청에 대해 Debounce 또는 Throttle을 적용합니다.

로그인 실패 반복 시 UI 차원에서 reCAPTCHA v3 연동 로직을 포함합니다.

4. 운영 보안 및 인프라
비밀 정보 관리 (Secret Management)

VITE_ 접두사를 포함한 환경 변수(.env)를 사용하며, 소스 코드 내 API Key 하드코딩을 절대 금지합니다.

.env 파일은 반드시 .gitignore에 포함하여 버전 관리에서 제외합니다.

감사 로그 (Audit Log)

생성, 수정, 삭제, 로그인 시도 등 주요 인터랙션 발생 시 Action, UserID, Timestamp를 포함한 로그를 Audit 전용 API로 전송합니다.

에러 노출 차단 (Error Masking)

Error Boundary를 구축하여 Stack Trace 등 시스템 내부 정보가 UI에 노출되지 않도록 차단하고, 사용자용 메시지로 치환합니다.

의존성 취약점 점검 (Dependency Check)

npm audit 또는 Snyk을 활용하여 주기적으로 라이브러리 취약점을 점검하고 최신 보안 패치를 적용합니다.