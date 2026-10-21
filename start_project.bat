@echo off
echo Starting Meta Project...

echo 1. Starting Backend Server (Port 8000)...
start "Meta Backend" cmd /k "cd /d "%~dp0backend" && "%~dp0venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Starting Frontend Server (Port 3000)...
start "Meta Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo Done! Open your browser at:
echo Frontend: http://localhost:3000
echo Backend Docs: http://localhost:8000/docs
