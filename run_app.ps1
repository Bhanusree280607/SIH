# RythuMithra PowerShell Launcher (SIH 26193)
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Launching RythuMithra / KisanMithra (SIH 26193)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green

$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Launching Backend (FastAPI on http://127.0.0.1:8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootPath\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Launching Frontend (React Vite on http://127.0.0.1:5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootPath\frontend'; npm run dev"

Write-Host "`nBoth servers have been launched in separate PowerShell windows!" -ForegroundColor Green
Write-Host "Web App URL: http://127.0.0.1:5173/" -ForegroundColor Yellow
Write-Host "API Docs:    http://127.0.0.1:8000/docs" -ForegroundColor Yellow

Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:5173/"
