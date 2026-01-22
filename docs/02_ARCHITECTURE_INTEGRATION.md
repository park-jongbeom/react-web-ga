# 🏗️ Architecture & Integration Guide

## 1. 시스템 연동 구조
- **Frontend**: React (Vite) [Port: 5173]
- **Auth Service**: [Port: 8081] (/api/auth)
- **User Service**: [Port: 8082] (/api/user)
- **Audit Service**: [Port: 8083] (/api/audit)

## 2. API 클라이언트 (Axios)
- 서비스별 독립적 인스턴스 운용: `authApi`, `userApi`, `auditApi`
- **필수 Interceptor**:
  - `Authorization: Bearer <token>` 자동 주입
  - `X-Tenant-ID`: 테넌트 격리를 위한 헤더 주입
  - `X-XSRF-TOKEN`: CSRF 방어용 헤더 주입
  - **Silent Refresh**: 401 에러 시 Refresh Token을 통한 자동 갱신

## 3. 프론트엔드 핵심 구현
- **ProtectedRoute**: AuthContext를 통한 유효성 검증 및 Role 기반 라우팅 제어.
- **Validation**: `Zod`를 이용한 런타임 타입 체크 및 폼 유효성 검증.
- **Sanitization**: `DOMPurify`를 사용한 리치 텍스트 정제.