# 백엔드 협업 요청 사항

이 문서는 프론트엔드 보안 강화를 위해 백엔드에서 구현이 필요한 사항들을 정리합니다.

## 🎯 주요 요청 사항

### 1. Refresh Token을 HttpOnly 쿠키로 제공 ⭐ (우선순위: 높음)

**현재 상태**:
- 프론트엔드에서 Refresh Token을 `localStorage`에 저장 중
- XSS 공격에 취약 (자바스크립트로 접근 가능)

**요청 사항**:
- `/api/auth/login` 및 `/api/auth/refresh` 엔드포인트에서 Refresh Token을 HttpOnly 쿠키로 설정
- 쿠키 속성:
  - `HttpOnly`: 자바스크립트 접근 차단
  - `Secure`: HTTPS에서만 전송 (프로덕션 환경)
  - `SameSite=Strict`: CSRF 방어

**예시 구현** (Spring Boot):
```kotlin
@PostMapping("/login")
fun login(@RequestBody request: LoginRequest, response: HttpServletResponse): ResponseEntity<LoginResponse> {
    val tokens = authService.login(request)
    
    // Refresh Token을 HttpOnly 쿠키로 설정
    val refreshTokenCookie = Cookie("refreshToken", tokens.refreshToken)
    refreshTokenCookie.isHttpOnly = true
    refreshTokenCookie.secure = true  // 프로덕션에서만
    refreshTokenCookie.maxAge = 7 * 24 * 60 * 60  // 7일
    refreshTokenCookie.path = "/"
    refreshTokenCookie.setAttribute("SameSite", "Strict")
    response.addCookie(refreshTokenCookie)
    
    // Access Token은 응답 본문에 포함
    return ResponseEntity.ok(LoginResponse(
        accessToken = tokens.accessToken,
        // refreshToken은 제외 (쿠키로 전송)
    ))
}
```

**프론트엔드 변경사항**:
- Refresh Token을 localStorage에서 읽지 않고, 쿠키에서 자동으로 전송됨
- `axiosInstance.ts`에서 이미 `withCredentials: true` 설정 완료

---

### 2. 테넌트 격리 검증 강화 ⭐ (우선순위: 중간)

**현재 상태**:
- 프론트엔드에서 `X-Tenant-ID` 헤더 자동 주입 구현 완료
- 필수 테넌트 API에서 Tenant ID 없으면 요청 거부 로직 구현 완료

**요청 사항**:
- 백엔드에서도 필수 테넌트 API에 `X-Tenant-ID` 헤더가 없으면 `400 Bad Request` 반환
- 테넌트 ID와 사용자 권한이 일치하는지 검증
- 다른 테넌트의 데이터에 접근 시도 시 `403 Forbidden` 반환

**예시 구현** (Spring Boot):
```kotlin
@Component
class TenantInterceptor : HandlerInterceptor {
    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any
    ): Boolean {
        val tenantId = request.getHeader("X-Tenant-ID")
        
        // 테넌트 필수 경로 체크
        if (isTenantRequired(request.requestURI) && tenantId.isNullOrBlank()) {
            response.status = HttpStatus.BAD_REQUEST.value()
            response.writer.write("""{"success":false,"message":"Tenant ID is required"}""")
            return false
        }
        
        // JWT에서 추출한 테넌트 ID와 헤더의 테넌트 ID 일치 검증
        val userTenantId = extractTenantIdFromToken(request)
        if (tenantId != null && userTenantId != null && tenantId != userTenantId) {
            response.status = HttpStatus.FORBIDDEN.value()
            response.writer.write("""{"success":false,"message":"Access denied: Tenant mismatch"}""")
            return false
        }
        
        return true
    }
}
```

---

### 3. CSRF 토큰 제공 (선택사항)

**현재 상태**:
- 프론트엔드에서 `X-XSRF-TOKEN` 헤더 자동 주입 구현 완료
- 쿠키에서 CSRF 토큰을 읽어 헤더에 설정

**요청 사항**:
- CSRF 보호가 활성화된 경우, `/api/auth/csrf` 엔드포인트 제공
- 또는 로그인 전에 CSRF 토큰을 쿠키로 설정

**참고**:
- 현재 백엔드에서 CSRF 비활성화 상태로 알고 있으나, 향후 활성화 시 대비

---

## 📋 구현 체크리스트

백엔드 개발자가 확인해야 할 사항:

- [ ] Refresh Token을 HttpOnly 쿠키로 설정
  - [ ] `HttpOnly` 속성 설정
  - [ ] `Secure` 속성 설정 (프로덕션)
  - [ ] `SameSite=Strict` 설정
  - [ ] 로그인 엔드포인트 (`/api/auth/login`)
  - [ ] 토큰 갱신 엔드포인트 (`/api/auth/refresh`)

- [ ] 테넌트 격리 검증
  - [ ] 필수 테넌트 API에서 `X-Tenant-ID` 헤더 검증
  - [ ] JWT 토큰의 테넌트 ID와 헤더의 테넌트 ID 일치 검증
  - [ ] 다른 테넌트 데이터 접근 시 `403 Forbidden` 반환

- [ ] CORS 설정 확인
  - [ ] 운영 환경에서 허용된 도메인으로 `Allow-Origin` 제한
  - [ ] `Allow-Credentials: true` 설정
  - [ ] Preflight 요청 처리

- [ ] HSTS 헤더 설정 (운영 환경)
  - [ ] Nginx 또는 서버 설정에서 `Strict-Transport-Security` 헤더 추가

---

## 🔗 관련 문서

- 프론트엔드 보안 검증 리포트: `docs/SECURITY_AUDIT_REPORT.md`
- 보안 명세: `docs/security_manifest.md`
- 백엔드 연동 가이드: `docs/backend-integration-1pager.md`

---

## 📞 문의

백엔드 구현 시 문의사항이 있으면 프론트엔드 팀에 연락주세요.

**작성일**: 2024년  
**목적**: 보안 강화를 위한 백엔드-프론트엔드 협업
