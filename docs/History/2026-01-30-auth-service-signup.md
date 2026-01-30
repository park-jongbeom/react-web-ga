# 2026-01-30: 회원가입 AuthService 연동

## 작업 배경
GAMF-11-3 요구사항에 따라 회원가입 API 연동 및 화면 연결을 완료하기 위함.

## 변경 내용

### 1) 회원가입 검증 스키마 추가
- `src/utils/validation.ts`
  - `signupRequestSchema` 및 `SignupRequest` 타입 추가
  - 비밀번호 확인 일치 검증 포함

### 2) AuthService 회원가입 API 연동
- `src/api/AuthService.ts`
  - `register(email, password, passwordConfirm)` 추가
  - 성공 시 토큰 저장, 실패 시 일반화된 에러 메시지 반환

### 3) 회원가입 화면에서 API 호출 연결
- `src/pages/Signup.tsx`
  - `register` 호출 및 에러 처리
  - 성공 시 `AuthContext` 인증 설정 후 대시보드 이동

### 4) 테스트 추가
- `src/pages/__tests__/SignupPage.test.tsx`
  - 회원가입 제출 시 API 호출되는지 검증

## 보안 고려사항
- 입력값 Zod 검증으로 Validation+SQLi 방어
- 에러 메시지 일반화로 정보 노출 최소화

## 다음 단계
- 로그인 폼과 동일한 에러 UX 정제
- 백엔드 회원가입 응답 규격 확정 시 타입 정합성 재점검
