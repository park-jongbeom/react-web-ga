# Go Almond Frontend

미국 유학 중개 및 진로 설계 통합 플랫폼의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS 3** - 유틸리티 기반 CSS 프레임워크
- **React Router** - 클라이언트 사이드 라우팅

## 프로젝트 구조

```
frontend/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── Header.tsx   # 헤더 컴포넌트
│   │   ├── Layout.tsx   # 레이아웃 컴포넌트
│   │   └── Navigation.tsx # 네비게이션 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── Home.tsx     # 메인 페이지 (랜딩 페이지)
│   │   └── Dashboard.tsx # 대시보드 페이지
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 앱 진입점
│   └── index.css        # 전역 스타일 (Tailwind CSS 포함)
├── public/              # 정적 파일
├── index.html           # HTML 템플릿
├── tailwind.config.js   # Tailwind CSS 설정
├── postcss.config.js    # PostCSS 설정
├── vite.config.ts       # Vite 설정
└── tsconfig.json        # TypeScript 설정
```

## 주요 기능

### 메인 페이지 (Home)
- 히어로 섹션: 서비스 소개 및 CTA 버튼
- 주요 서비스 소개:
  - 일반 대학 및 CC 편입 프로그램
  - 직업학교 및 단기 참관 수업
  - AI 기반 맞춤 추천
- 프로그램 안내 섹션
- AI 추천 섹션
- 문의하기 폼

### 대시보드 페이지 (Dashboard)
- 사용자 프로필 정보 표시 (GPA, 예산, 진로 목표)
- 지원 현황 관리 (Draft/Submitted/Accepted 상태)
- AI 추천 프로그램 목록
- 통계 정보 (전체 지원서, 합격 건수, 평균 매칭 점수)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 미리보기

```bash
npm run preview
```

빌드된 프로덕션 버전을 로컬에서 미리볼 수 있습니다.

## 스타일링

이 프로젝트는 Tailwind CSS를 사용합니다. 커스텀 색상은 `tailwind.config.js`에서 정의되어 있으며, Primary 색상 팔레트가 설정되어 있습니다.

## 라우팅

- `/` - 메인 페이지 (랜딩 페이지)
- `/dashboard` - 대시보드 페이지

## 향후 개발 계획

- [ ] 사용자 인증 및 로그인 기능
- [ ] 프로필 수정 기능
- [ ] 지원서 작성 및 수정 기능
- [ ] AI 추천 API 연동
- [ ] 실시간 지원 현황 업데이트
- [ ] 반응형 디자인 개선

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)
- [Vite 공식 문서](https://vite.dev/)
- [React Router 공식 문서](https://reactrouter.com/)
