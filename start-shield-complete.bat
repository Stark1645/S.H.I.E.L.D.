@echo off
echo ========================================
echo  S.H.I.E.L.D - Complete System Startup
echo  Version 2.0 FINAL - Production Ready
echo ========================================
echo.

echo [1/4] Checking PostgreSQL...
pg_isready >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL is not running!
    echo Please start PostgreSQL service first.
    pause
    exit /b 1
)
echo [OK] PostgreSQL is running

echo.
echo [2/4] Starting ML Service...
start "S.H.I.E.L.D ML Service" cmd /k "cd ml-service-python && venv\Scripts\activate && python -m app.main"
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Starting Backend (Spring Boot)...
start "S.H.I.E.L.D Backend" cmd /k "cd backend-java && mvn spring-boot:run"
echo Waiting for backend to initialize (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo [4/4] Starting Frontend (React)...
start "S.H.I.E.L.D Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  S.H.I.E.L.D System Started!
echo ========================================
echo.
echo Services Running:
echo  - ML Service:  http://localhost:8000
echo  - Backend:     http://localhost:8080
echo  - Frontend:    http://localhost:5173
echo.
echo New Features Available:
echo  - Analytics:      /analytics
echo  - System Health:  /health
echo.
echo Login Credentials:
echo  Username: admin
echo  Password: admin123
echo.
echo Press any key to open S.H.I.E.L.D in browser...
pause >nul
start http://localhost:5173
echo.
echo All services are running in separate windows.
echo Close those windows to stop the services.
echo.
pause
