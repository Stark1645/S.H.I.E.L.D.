@echo off
echo ========================================
echo JARVIS AI Secure Configuration Setup
echo ========================================
echo.

cd backend-java\src\main\resources

if exist application-secrets.properties (
    echo [WARNING] application-secrets.properties already exists!
    echo.
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 goto :end
    if errorlevel 1 goto :create
) else (
    goto :create
)

:create
echo.
echo Creating application-secrets.properties...
copy application-secrets.properties.template application-secrets.properties >nul

echo.
echo ========================================
echo Configuration file created successfully!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Get your Gemini API key from:
echo    https://makersuite.google.com/app/apikey
echo.
echo 2. Open this file:
echo    backend-java\src\main\resources\application-secrets.properties
echo.
echo 3. Replace YOUR_GEMINI_API_KEY_HERE with your actual key
echo.
echo 4. Save the file
echo.
echo 5. Restart the backend: mvn spring-boot:run
echo.
echo ========================================
echo SECURITY NOTE:
echo ========================================
echo.
echo - application-secrets.properties is in .gitignore
echo - Your API key will NOT be committed to Git
echo - Keep this file secure and never share it
echo.
pause
goto :end

:end
cd ..\..\..\..
