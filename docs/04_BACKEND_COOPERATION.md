# 🤝 Backend Cooperation & Environment

## 1. 백엔드 필수 구현 사항
- **Refresh Token**: `HttpOnly`, `Secure`, `SameSite=Strict` 쿠키로 제공.
- **Tenant Isolation**: `X-Tenant-ID` 헤더와 토큰 내 정보 일치 여부 서버 측 검증 필수.
- **에러 응답**: `{ code, message, traceId }` 통일된 규격 준수.
- **CORS**: `Allow-Credentials: true` 및 지정된 Origin 허용.

## 2. 환경 변수 관리 (.env.local)
- API 서비스별 포트 및 베이스 URL 정의
- 암호화 키 등 클라이언트 측 Secret 관리