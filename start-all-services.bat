@echo off
echo ========================================
echo S.H.I.E.L.D - Starting All Services
echo ========================================
echo.

echo [1/3] Starting ML Service (Python FastAPI)...
start "ML Service" cmd /k "cd ml-service-python && venv\Scripts\activate && python -m app.main"
timeout /t 5

echo [2/3] Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd backend-java && mvn spring-boot:run"
timeout /t 10

echo [3/3] Starting Frontend (React)...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo ML Service:  http://localhost:8000
echo Backend:     http://localhost:8080
echo Frontend:    http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
