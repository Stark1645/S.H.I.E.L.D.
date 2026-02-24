@echo off
echo ========================================
echo  S.H.I.E.L.D - Autonomous War Room
echo ========================================
echo.

echo [1/4] Starting Backend (Spring Boot)...
cd backend
start cmd /k "mvn spring-boot:run"
cd ..

timeout /t 5 /nobreak >nul

echo [2/4] Installing Frontend Dependencies...
call npm install

echo [3/4] Starting Frontend (React + Vite)...
start cmd /k "npm run dev"

echo.
echo [4/4] Launch Complete!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo Swagger: http://localhost:8080/swagger-ui.html
echo.
pause
