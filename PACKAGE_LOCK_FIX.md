# package-lock.json 동기화 문제 해결

## 현재 상태

✅ **임시 해결책 적용**: Dockerfile을 `npm install`을 사용하도록 수정했습니다.
- 이제 Docker 빌드가 성공할 것입니다.
- 하지만 프로덕션에서는 `npm ci` 사용을 권장합니다.

## 최종 해결 방법

### 1. 로컬에서 package-lock.json 업데이트

프론트엔드 디렉토리에서 다음 명령어 중 하나를 실행:

**PowerShell 스크립트 사용 (권장)**:
```powershell
cd C:\Users\qk54r\frontend
.\update-package-lock.ps1
```

**또는 직접 실행**:
```powershell
cd C:\Users\qk54r\frontend
npm install
```

### 2. 변경사항 커밋 및 푸시

```bash
git add package-lock.json
git commit -m "chore: package-lock.json 업데이트 (dompurify, zod 추가)"
git push
```

### 3. Dockerfile을 npm ci로 변경

`package-lock.json`이 업데이트되고 커밋된 후, Dockerfile을 다시 `npm ci`로 변경:

```dockerfile
# Install dependencies
RUN npm ci
```

그리고 커밋:
```bash
git add Dockerfile
git commit -m "fix: Dockerfile에서 npm ci로 변경"
git push
```

## 왜 이 문제가 발생했나?

1. `package.json`에 `dompurify`, `zod`, `@types/dompurify` 패키지를 추가했습니다.
2. 하지만 로컬에서 `npm install`을 실행하지 않아 `package-lock.json`이 업데이트되지 않았습니다.
3. `npm ci`는 `package-lock.json`과 `package.json`이 정확히 일치해야만 작동합니다.

## npm ci vs npm install

- **npm ci**: 
  - `package-lock.json`을 정확히 따릅니다
  - 더 빠르고 예측 가능합니다
  - 프로덕션 빌드에 권장됩니다
  - `package-lock.json`이 없거나 동기화되지 않으면 실패합니다

- **npm install**: 
  - `package.json`을 읽어서 `package-lock.json`을 업데이트합니다
  - 개발 환경에서 패키지를 추가할 때 사용합니다
  - 프로덕션에서는 덜 예측 가능합니다

## 체크리스트

- [x] Dockerfile 수정 (임시 해결)
- [ ] 로컬에서 `npm install` 실행
- [ ] `package-lock.json` 변경사항 커밋
- [ ] Dockerfile을 `npm ci`로 변경
- [ ] 변경사항 커밋 및 푸시
- [ ] GitHub Actions 빌드 성공 확인
