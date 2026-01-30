# 2026-01-30: 프로필 Step3 전체 검증 및 임시 저장 확장

## 작업 배경
GAMF-14-4 요구사항에 따라 Step1~3 전체 데이터 검증 로직을 추가하고
Step2/Step3 임시 저장을 구현하여 단계 이동 시 데이터가 유지되도록 개선.

## 변경 내용

### 1) Step2/Step3 임시 저장
- `src/utils/profileStorage.ts`
  - Step2/Step3 저장/로드/삭제 함수 추가
- `src/hooks/useStep2PersonalInfoStorage.ts`
- `src/hooks/useStep3StudyPreferenceStorage.ts`

### 2) Step2/Step3 검증 스키마
- `src/utils/validation.ts`
  - Step2: 만 18세 이상 검증 포함
  - Step3: 프로그램/예산/지역/기간/OPT 의사 검증
  - 전체 단계 검증 헬퍼 `validateProfileSteps` 추가

### 3) Step2/Step3 화면 로직 강화
- `src/pages/ProfileStep2.tsx`
  - Step2 입력 검증 후 다음 단계 이동
- `src/pages/ProfileStep3.tsx`
  - 전체 단계 검증 후 완료 처리
  - 오류 시 해당 Step으로 이동

### 4) 테스트 추가
- `src/utils/__tests__/profileStorage.test.ts`
- `src/utils/__tests__/validationStep1.test.ts` (Step2/3 검증 케이스 확장)

## 보안 고려사항
- 입력값 검증을 통해 Validation+SQLi 방어 강화
- 오류 메시지는 필드 단위로만 노출
