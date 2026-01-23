# UI 컴포넌트 템플릿화 변경 내역

## 변경 배경
- 버튼/입력/카드 등 UI 요소가 화면마다 중복 구현되어 유지보수가 어려움

## 변경 범위
- 공용 UI 컴포넌트 추가: 버튼/링크 버튼/입력/텍스트영역/카드/패널/배지/내비 링크
- 기존 화면(Home, Dashboard, Login 등)에서 공용 컴포넌트 사용으로 치환
- 타이포 템플릿(Heading/Text) 추가 및 주요 화면 제목/본문 적용
- AI UI/UX 테스트 페이지 및 관련 파일 제거

## 주요 변경 파일
- `src/components/ui/`
- `src/pages/Home.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Login.tsx`
- `src/components/Header.tsx`
- `src/components/Navigation.tsx`
- `docs/ui-components.md`
