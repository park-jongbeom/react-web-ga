# React-백엔드 연동 Problem 1-Pager

## 1. 배경 및 목적

### 문제 정의
- React 프론트엔드와 3개의 분리된 백엔드 서비스(Auth, User, Audit) 간 안전하고 효율적인 통신 체계 구축
- 다중 포트 기반 마이크로서비스 아키텍처에서의 프론트엔드 통합
- 보안 원칙 준수를 통한 프로덕션 레벨의 인증/인가 시스템 구현

### 목표
- 통일된 API 호출 인터페이스 제공
- JWT 기반 인증/인가 시스템 구현
- CORS 및 보안 정책 준수
- 확장 가능하고 유지보수가 용이한 아키텍처 설계

## 2. 아키텍처 개요

### 시스템 구성
```
React Frontend (Port 5173)
    ↓
Vite Proxy Server
    ├──→ /api/auth → Auth Service (Port 8081)
    ├──→ /api/user → User Service (Port 8082)
    └──→ /api/audit → Audit Service (Port 8083)
```

### 기술 스택
- **Frontend**: React 19, TypeScript, Vite
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT (JSON Web Token)
- **Storage**: localStorage (token storage)
- **Proxy**: Vite Dev Server Proxy

## 3. 보안 원칙 및 구현

### 3.1 CORS (Cross-Origin Resource Sharing)

#### 문제
- 브라우저의 Same-Origin Policy로 인한 다중 포트 간 통신 제한
- 개발 환경과 프로덕션 환경의 다른 도메인 설정

#### 구현 전략

**개발 환경 (Vite Proxy)**
- Vite 개발 서버의 프록시 기능 활용
- 모든 `/api/*` 요청을 Vite 서버에서 백엔드로 프록시
- 브라우저는 동일 Origin (localhost:5173)으로 인식하여 CORS 문제 회피

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api/auth': {
      target: 'http://localhost:8081',
      changeOrigin: true,  // Origin 헤더를 타겟 서버로 변경
    },
    // ...
  }
}
```

**프로덕션 환경**
- 백엔드 서버에서 CORS 정책 명시적 설정 필요
- 허용된 Origin, Methods, Headers 설정
- Credentials 옵션 설정 (쿠키, 인증 정보 전송 허용)

**백엔드 CORS 설정 예시 (권장)**
```java
// 예: Spring Boot
@CrossOrigin(
  origins = {"https://yourdomain.com"},
  allowedHeaders = {"Authorization", "Content-Type"},
  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
  allowCredentials = true
)
```

**프론트엔드 요구사항**
- Axios 인스턴스에 `withCredentials: true` 설정 (필요시)
- Preflight 요청 자동 처리

### 3.2 Authentication (인증)

#### 구현 방식: JWT Bearer Token

**토큰 저장**
- `localStorage`에 JWT 토큰 저장
- 키: `'token'`
- 보안 고려사항: XSS 공격에 취약하므로 추가 보안 조치 필요

**토큰 주입 메커니즘**
```typescript
// 모든 Axios 인스턴스에 공통 interceptor 적용
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**인증 플로우**
1. 사용자 로그인 → `/api/auth/login` 호출
2. 백엔드에서 JWT 토큰 발급
3. 프론트엔드에서 토큰을 `localStorage`에 저장
4. 이후 모든 API 요청에 자동으로 토큰 주입

**토큰 갱신 전략**
- Access Token + Refresh Token 패턴 권장
- Access Token 만료 시 Refresh Token으로 자동 갱신
- Refresh Token도 만료되면 재로그인 요구

**보안 고려사항**
- 토큰 만료 시간 설정 (일반적으로 15분~1시간)
- HTTPS 통신 필수 (프로덕션)
- HttpOnly 쿠키 사용 검토 (XSS 방어 강화)

### 3.3 Authorization (인가)

#### 역할 기반 접근 제어 (RBAC)

**프론트엔드 구현**
- JWT 토큰 payload에서 사용자 역할(role) 정보 추출
- 컴포넌트 레벨에서 조건부 렌더링
- Protected Route 구현

```typescript
// 예시: Protected Route
const ProtectedRoute = ({ requiredRole, children }) => {
  const token = getToken()
  const userRole = decodeToken(token)?.role
  
  if (!token) {
    return <Navigate to="/login" />
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />
  }
  
  return children
}
```

**API 레벨 인가**
- 백엔드에서 JWT 토큰 검증 및 권한 확인
- 프론트엔드는 403 Forbidden 응답 처리

**에러 처리**
```typescript
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: 토큰 없음/만료
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      // Forbidden: 권한 없음
      // 권한 오류 페이지로 리다이렉트 또는 알림 표시
    }
    return Promise.reject(error)
  }
)
```

### 3.4 추가 보안 원칙

#### XSS (Cross-Site Scripting) 방어
- `localStorage` 사용 시 XSS 공격에 취약
- 대안: `httpOnly` 쿠키 사용 (백엔드 협의 필요)
- 입력값 검증 및 sanitization
- React의 기본 XSS 방어 기능 활용

#### CSRF (Cross-Site Request Forgery) 방어
- SameSite 쿠키 설정 (백엔드)
- CSRF 토큰 사용 (필요시)
- Origin 검증

#### 데이터 검증
- 프론트엔드: 사용자 입력 검증 (UX 개선)
- 백엔드: 모든 입력값 검증 (보안 필수)
- TypeScript 타입 안정성 활용

#### 민감 정보 보호
- 토큰을 URL에 포함하지 않음
- 로그에서 토큰 출력 금지
- 에러 메시지에 민감 정보 포함 금지

## 4. API 연동 전략

### 4.1 Axios 인스턴스 구조

```typescript
// 분리된 인스턴스로 서비스별 독립적인 설정 가능
authApi   → http://localhost:8081/api/auth
userApi   → http://localhost:8082/api/user
auditApi  → http://localhost:8083/api/audit
```

### 4.2 환경 변수 관리

```env
VITE_AUTH_API_PORT=8081
VITE_USER_API_PORT=8082
VITE_AUDIT_API_PORT=8083
```

- 개발/스테이징/프로덕션 환경별 설정 분리
- `.env.local` 파일로 로컬 오버라이드 가능

### 4.3 에러 처리 전략

**공통 에러 처리**
- 네트워크 에러
- 타임아웃 에러
- HTTP 상태 코드별 처리 (401, 403, 404, 500 등)
- 사용자 친화적인 에러 메시지 표시

**재시도 로직**
- 네트워크 오류 시 자동 재시도 (선택적)
- Exponential backoff 적용

## 5. 데이터 흐름

### 로그인 플로우
```
1. 사용자 입력 (이메일/비밀번호)
2. authApi.post('/login', credentials)
3. Vite Proxy → Auth Service (8081)
4. 백엔드 JWT 발급
5. 토큰 localStorage 저장
6. 대시보드로 리다이렉트
```

### API 호출 플로우
```
1. React Component
2. API 함수 호출 (예: userApi.get('/profile'))
3. Axios Interceptor: 토큰 주입
4. Vite Proxy: 요청 프록시
5. 백엔드 서버: JWT 검증 → 비즈니스 로직 처리
6. 응답 반환
7. Component 상태 업데이트
```

## 6. 주요 구현 사항

### 6.1 필수 구현
- ✅ Axios 인스턴스 생성 (authApi, userApi, auditApi)
- ✅ JWT 토큰 자동 주입 interceptor
- ✅ Vite 프록시 설정
- ⏳ 로그인/로그아웃 기능
- ⏳ Protected Route 구현
- ⏳ 토큰 갱신 로직 (Refresh Token)

### 6.2 권장 구현
- 공통 에러 핸들링 컴포넌트
- API 호출 커스텀 훅 (React Query, SWR 등)
- 로딩 상태 관리
- 낙관적 업데이트 (Optimistic Updates)

## 7. 위험 요소 및 대응 방안

| 위험 요소 | 영향도 | 대응 방안 |
|---------|-------|----------|
| JWT 토큰 탈취 (XSS) | 높음 | HttpOnly 쿠키 사용, Content Security Policy 설정 |
| CORS 설정 오류 | 중간 | 백엔드 CORS 명시적 설정, 프록시 활용 |
| 토큰 만료 처리 미흡 | 중간 | 자동 토큰 갱신 로직, 만료 감지 및 재로그인 유도 |
| 네트워크 오류 처리 부재 | 낮음 | 공통 에러 핸들러, 재시도 로직 |
| 환경 변수 노출 | 중간 | .env 파일 gitignore, 빌드 시 환경 변수 주입 |

## 8. 다음 단계

1. **Phase 1: 기본 인증**
   - 로그인/로그아웃 API 연동
   - 토큰 저장 및 관리
   - Protected Route 구현

2. **Phase 2: 사용자 관리**
   - 사용자 프로필 API 연동
   - 사용자 정보 조회/수정

3. **Phase 3: 감사 로그**
   - Audit API 연동
   - 사용자 활동 로그 조회

4. **Phase 4: 고급 기능**
   - 토큰 자동 갱신
   - 오프라인 지원
   - API 캐싱

## 9. 체크리스트

### 백엔드 요구사항
- [ ] CORS 설정 완료
- [ ] JWT 토큰 발급/검증 구현
- [ ] 역할(Role) 기반 인가 구현
- [ ] 에러 응답 형식 표준화
- [ ] API 문서화 (Swagger/OpenAPI)

### 프론트엔드 구현
- [x] Axios 인스턴스 생성
- [x] Interceptor 설정
- [x] Vite 프록시 설정
- [ ] 로그인/로그아웃 UI
- [ ] Protected Route
- [ ] 에러 핸들링 UI
- [ ] 로딩 상태 표시

---

**작성일**: 2025-01-19  
**버전**: 1.0  
**작성자**: Frontend Team
