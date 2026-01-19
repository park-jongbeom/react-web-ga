# package-lock.json 동기화 문제 해결

## 문제
Docker 빌드 시 `npm ci` 오류 발생:
```
npm error Missing: @types/dompurify@3.0.5 from lock file
npm error Missing: dompurify@3.3.1 from lock file
npm error Missing: zod@3.25.76 from lock file
```

## 해결 방법

### 1. 로컬에서 package-lock.json 업데이트 (권장)

프론트엔드 디렉토리에서 다음 명령어 실행:

```bash
cd C:\Users\qk54r\frontend
npm install
```

이 명령어는 `package.json`을 읽어서 `package-lock.json`을 업데이트합니다.

### 2. 특정 패키지 재설치

만약 위 방법이 작동하지 않으면, 다음 명령어로 특정 패키지를 재설치:

```bash
npm install dompurify zod @types/dompurify --save
npm install @types/dompurify --save-dev
```

### 3. package-lock.json 완전 재생성

문제가 계속되면 `package-lock.json`을 삭제하고 재생성:

```bash
# Windows PowerShell
Remove-Item package-lock.json
npm install

# 또는 Windows CMD
del package-lock.json
npm install
```

## 확인

업데이트 후 다음 명령어로 확인:

```bash
npm list dompurify zod @types/dompurify
```

모든 패키지가 설치되어 있다면, `package-lock.json`을 커밋하고 Docker 빌드를 다시 시도하세요.

## 주의사항

- `package-lock.json`을 Git에 커밋해야 Docker 빌드가 성공합니다
- `npm ci`는 `package-lock.json`과 정확히 일치하는 버전만 설치합니다
- `npm install`은 `package-lock.json`을 업데이트할 수 있습니다
