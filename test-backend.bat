@echo off
echo Testing S.H.I.E.L.D Backend Connection...
echo.

echo [1] Testing if backend is running on port 8080...
curl -s http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is responding
) else (
    echo ✗ Backend is NOT responding - Make sure backend is running!
    echo   Run: cd backend-java ^&^& mvn spring-boot:run
    pause
    exit /b 1
)

echo.
echo [2] Testing login with admin/admin123...
curl -s http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

echo.
echo.
echo [3] If you see a token above, backend is working!
echo     Use username: admin
echo     Use password: admin123
echo.
pause
