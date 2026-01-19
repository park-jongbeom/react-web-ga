# package-lock.json 업데이트 스크립트
# 이 스크립트를 실행하면 package.json을 기반으로 package-lock.json을 업데이트합니다.

Write-Host "package-lock.json 업데이트 중..." -ForegroundColor Yellow

# package-lock.json 백업 (있는 경우)
if (Test-Path "package-lock.json") {
    Copy-Item "package-lock.json" "package-lock.json.backup"
    Write-Host "기존 package-lock.json을 백업했습니다." -ForegroundColor Gray
}

# npm install 실행
Write-Host "npm install 실행 중..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ package-lock.json 업데이트 완료!" -ForegroundColor Green
    Write-Host "`n다음 단계:" -ForegroundColor Yellow
    Write-Host "1. git add package-lock.json" -ForegroundColor White
    Write-Host "2. git commit -m 'chore: package-lock.json 업데이트'" -ForegroundColor White
    Write-Host "3. git push" -ForegroundColor White
    Write-Host "`n그 후 Dockerfile의 npm install을 npm ci로 다시 변경하세요." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ npm install 실패!" -ForegroundColor Red
    if (Test-Path "package-lock.json.backup") {
        Write-Host "백업에서 복원합니다..." -ForegroundColor Yellow
        Move-Item "package-lock.json.backup" "package-lock.json" -Force
    }
    exit 1
}
