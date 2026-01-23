# UI 컴포넌트 사용 가이드

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
