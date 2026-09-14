@echo off
title RythuMithra Launcher
echo ========================================================
echo   Launching RythuMithra / KisanMithra (SIH 26193)
echo ========================================================
echo.
echo [1/2] Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "RythuMithra Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Frontend (React Vite on http://127.0.0.1:5176)...
start "RythuMithra Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Both servers have been launched in separate windows!
echo.
echo   - Web App (Browser):  http://127.0.0.1:5176/
echo   - Backend REST API:   http://127.0.0.1:8000/
echo   - Interactive API Docs: http://127.0.0.1:8000/docs
echo ========================================================
echo.
timeout /t 4 >nul
start http://127.0.0.1:5176/
