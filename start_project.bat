@echo off
echo ====================================================
echo Starting Meta (KPilot) Project...
echo ====================================================

echo [1/3] Starting Backend Server (FastAPI on Port 8000)...
start "Meta Backend" cmd /k "cd /d "%~dp0backend" && "%~dp0venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting Frontend Server (Vite on Port 3000)...
start "Meta Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo [3/3] Starting Admin Panel (Vite on Port 3001)...
start "Meta Admin Panel" cmd /k "cd /d "%~dp0admin-panel" && npm.cmd run dev"

echo.
echo Waiting 3 seconds for servers to initialize...
ping 127.0.0.1 -n 4 >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ====================================================
echo Project started successfully!
echo Frontend:     http://localhost:3000
echo Admin Panel:  http://localhost:3001
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo ====================================================
