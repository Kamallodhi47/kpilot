@echo off
echo ====================================================
echo Starting Meta (KPilot) Project...
echo ====================================================

echo [1/2] Starting Backend Server (FastAPI on Port 8000)...
start "Meta Backend" cmd /k "cd /d "%~dp0backend" && "%~dp0venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Frontend Server (Vite on Port 3000)...
start "Meta Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo ====================================================
echo Project started successfully!
echo Frontend:     http://localhost:3000
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo ====================================================
