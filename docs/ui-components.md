# UI 컴포넌트 사용 가이드

## 디자인 토큰
- 토큰 정의: `src/index.css`의 `:root` (색상/타이포/spacing/radius/shadow)
- Tailwind 연동: `tailwind.config.js`의 `theme.extend`
- 권장 사용: 하드코딩 색/간격 대신 토큰 기반 클래스 사용
  - 예) `bg-surface`, `text-foreground`, `border-border`, `text-danger-600`

### 토큰 목록

#### 컬러
- Primary (Bright Green #4CAF50 계열)
  - `--color-primary-50/100/200/300/400/500/600/700/800/900`
  - `--color-primary-500: #4caf50`
- Secondary / Neutral (Light Gray #F5F5F5 계열)
  - `--color-neutral-50: #f5f5f5`
  - `--color-neutral-100: #eeeeee`
  - `--color-neutral-200: #e0e0e0`
  - `--color-neutral-300: #bdbdbd`
  - `--color-neutral-400: #9e9e9e`
  - `--color-neutral-500: #757575`
  - `--color-neutral-600: #616161`
  - `--color-neutral-700: #424242`
  - `--color-neutral-800: #212121`
  - `--color-neutral-900: #111111`
- Background (White)
  - `--color-surface: #ffffff`
  - `--color-surface-subtle: #f5f5f5`
  - `--color-surface-muted: #eeeeee`
- Accent / CTA (Orange #FF9800 계열)
  - `--color-accent-50/100/500/600/700/800`
  - `--color-accent-500: #ff9800`
- 상태 컬러
  - Success: `--color-success-50/100/600/700/800`
  - Danger: `--color-danger-50/100/300/400/600/700/800`
  - Warning: `--color-warning-50/100/600/700/800`
  - Info: `--color-info-50/100/600/800`
- Border / Text
  - `--color-border`, `--color-border-strong`
  - `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse`

#### 타이포그래피
- 폰트 패밀리
  - `--font-sans`
- 폰트 사이즈 (요구사항 매핑)
  - Title: `--font-size-title (20px)`, `--font-size-title-lg (24px)`
  - Section Title: `--font-size-section (18px)`
  - Body: `--font-size-body (16px)`, `--font-size-body-sm (14px)`
  - Caption: `--font-size-caption (12px)`
- 기본 스케일
  - `--font-size-xs/sm/base/lg/xl/2xl`
- Line Height
  - `--line-height-tight`, `--line-height-snug`, `--line-height-normal`, `--line-height-relaxed`

#### Spacing
- `--space-0/1/2/3/4/5/6/8/10/12/14/16/20/24/32/40/48/56/64`

#### Radius
- `--radius-sm/md/lg/xl/full`

#### Shadow
- `--shadow-xs/sm/md/lg`

## 1. 버튼
### BaseButton
- 용도: 일반 버튼
- Props
  - variant: primary | outline | ghost | link | inverse | muted | soft | secondary | success | danger
  - size: xs | sm | md | lg | xl
  - rounded: lg | full
  - fullWidth: boolean

```tsx
<BaseButton variant="primary" size="md">확인</BaseButton>
<BaseButton variant="outline" size="lg">자세히</BaseButton>
```

### BaseLinkButton
- 용도: 라우팅 링크 버튼
```tsx
<BaseLinkButton to="/dashboard" variant="inverse">Go</BaseLinkButton>
```

## 2. 입력/텍스트영역
### BaseInput
- Props
  - fieldSize: sm | md | lg
  - helperText, errorText
  - hasError: boolean
```tsx
<BaseInput id="email" label="이메일" placeholder="you@example.com" />
```

### BaseTextarea
- Props
  - fieldSize: sm | md | lg
  - helperText, errorText
  - hasError: boolean
```tsx
<BaseTextarea id="message" label="문의 내용" rows={4} />
```

## 3. 카드/패널/배지
### BaseCard
- Props
  - variant: default | outline | interactive | accent
  - size: sm | md | lg
```tsx
<BaseCard title="타이틀" variant="accent">내용</BaseCard>
```

### BasePanel
- 용도: 섹션 컨테이너
```tsx
<BasePanel>컨텐츠</BasePanel>
```

### BaseBadge
- Props
  - variant: success | info | neutral
```tsx
<BaseBadge variant="success">합격</BaseBadge>
```

## 4. 타이포
### BaseHeading
- Props
  - level: 1 | 2 | 3 | 4
  - tone: primary | muted
```tsx
<BaseHeading level={2}>섹션 제목</BaseHeading>
```

### BaseText
- Props
  - variant: body | subtitle | caption | label | overline | helper | error
```tsx
<BaseText variant="caption">보조 설명</BaseText>
```

## 5. 레이아웃
### BaseSection
- Props
  - variant: default | tight
```tsx
<BaseSection>섹션</BaseSection>
```

### BaseContainer
```tsx
<BaseContainer>콘텐츠</BaseContainer>
```

### BaseGrid
- Props
  - cols: 1 | 2 | 3 | 4
  - gap: sm | md | lg
```tsx
<BaseGrid cols={3} gap="md">...</BaseGrid>
```
