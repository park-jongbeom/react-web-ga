# 2026-01-30: 디자인 토큰화 및 전면 치환

## 작업 배경
하드코딩된 색상/간격/타이포를 토큰으로 표준화해 전역 스타일 변경이 용이하도록 개선.

## 변경 내용

### 1) 토큰 정의
- `src/index.css`에 CSS 변수 기반 디자인 토큰 추가
  - 색상(Primary/Neutral/Success/Danger/Warning/Info)
  - 타이포(font-size/line-height/font-family)
  - spacing/radius/shadow

### 2) Tailwind 연동
- `tailwind.config.js`에서 CSS 변수 기반 토큰을 Tailwind theme에 매핑
  - colors, spacing, borderRadius, boxShadow, fontFamily, fontSize

### 3) UI 컴포넌트/페이지 치환
- Base UI 컴포넌트 및 주요 화면에서 토큰 기반 클래스 사용
  - `BaseInput`, `BaseTextarea`, `BaseCard`, `BaseBadge`, `Typography`, `BaseNavLink`, `BasePanel`
  - `Login`, `Signup`, `Dashboard`, `Home`, `Header`, `Navigation`, `ErrorBoundary`

### 4) 문서 업데이트
- `docs/ui-components.md`에 디자인 토큰 사용 안내 추가

## 보안 고려사항
- 스타일 토큰 변경만 수행했으며 입력/출력 로직 및 보안 정책(CSRF/XSS/CSP)에 영향 없음

## 비고
- 기존 Vite 기본 스타일 파일(`src/style.css`)은 사용되지 않으며 추후 정리 대상
