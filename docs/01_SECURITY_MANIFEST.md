# 🛡️ Security Coding Guidelines (ISMS-P Level)

## 🚨 필수 AI 프롬프트
모든 코딩 작업 시 다음 문구를 참조하여 결과물을 검증한다:
"CORS/Preflight, CSRF, XSS+CSP, SSRF, AuthN/AuthZ, RBAC/ABAC+테넌트격리, 최소권한, Validation+SQLi 방어, RateLimit/Bruteforce, 쿠키(HttpOnly·Secure·SameSite)+세션보안, Secret 관리+Rotation, HTTPS/HSTS+보안헤더, AuditLog, 에러노출 차단, 의존성 취약점 점검을 반영하라."

## 1. 인증 및 세션 관리
- **비밀번호**: 평문 저장 절대 금지. 해시(BCrypt 등) 처리 여부 확인. 로그/디버그 출력 금지.
- **토큰**: JWT/세션은 `HttpOnly + Secure + SameSite=Strict` 쿠키로 전달.
- **Refresh Token**: 재발급 시 기존 토큰 무효화(Revocation) 처리 필수.
- **금지**: 토큰을 `localStorage`에 저장하고 JS로 읽는 행위 금지.

## 2. 권한 및 접근 제어
- 항상 "현재 사용자(user_id, role)"를 기준으로 데이터 접근 제한.
- 관리자 기능: 별도 `/admin` Prefix 분리 + Role 체크 + Audit Log 기록 필수.
- 프론트엔드 통제(버튼 숨기기 등)에만 의존하지 말고 백엔드 API 권한 체크를 필수 연동한다.

## 3. 데이터 검증 및 보안
- **입력 검증**: 모든 입력은 백엔드에서 검증(Zod 등)하며, 프론트는 보조적으로 수행한다.
- **XSS 방어**: HTML 출력값은 반드시 escape/encode 처리. `dangerouslySetInnerHTML` 사용 금지.
- **암호화**: 개인정보(이름, 연락처 등)는 AES-256-GCM 필드 단위 암호화 후 저장(백엔드 협업).
- **시크릿**: API Key 등은 코드 내 하드코딩 금지. 환경변수 및 Secret Manager 사용.

## 4. 로그 및 예외 처리
- 로그 기록 시 개인정보/토큰/비밀번호는 반드시 마스킹하거나 제외한다.
- 사용자에게는 일반적인 메시지만 노출하고, 상세 에러는 내부 로그에만 남긴다.

## 5. 파일 및 AI 연동
- **파일**: 확장자/용량 제한 및 MIME + Magic Number 검증 필수. 웹 루트 밖 저장.
- **AI/LLM**: PII(개인정보)는 마스킹 후 전송. 원문 데이터 장기 보관 금지.