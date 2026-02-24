@echo off
echo ========================================
echo S.H.I.E.L.D Agent Testing Tool
echo ========================================
echo.

REM Get token from user
if "%~1"=="" (
    echo ERROR: Please provide JWT token
    echo.
    echo Usage: test-agents.bat YOUR_JWT_TOKEN
    echo.
    echo To get your token:
    echo 1. Login to http://localhost:5173
    echo 2. Press F12 (Developer Tools)
    echo 3. Go to Console tab
    echo 4. Type: localStorage.getItem('shield_token')
    echo 5. Copy the token (without quotes)
    echo.
    pause
    exit /b 1
)

set "TOKEN=%~1"

echo [TEST 1] Creating HIGH severity threat...
echo This will trigger agent autonomous response!
echo.

curl -X POST http://localhost:8080/api/threats ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"sourceIP\":\"10.0.0.666\",\"targetSystem\":\"Production-Database\",\"threatType\":\"Advanced Persistent Threat\",\"severityScore\":9.8,\"intentClassification\":\"Data Exfiltration\",\"status\":\"DETECTED\"}"

echo.
echo.
echo ========================================
echo Threat Created Successfully!
echo ========================================
echo.
echo What happens next:
echo 1. AgentCoordinator scans every 30 seconds
echo 2. Detects high-severity threat (9.8)
echo 3. Calculates risk score
echo 4. Makes autonomous decision
echo 5. Executes ISOLATE_SYSTEM action
echo.
echo WHERE TO SEE RESULTS:
echo - Dashboard: Agent Decision Feed (bottom right)
echo - Backend Logs: Watch for "ISOLATE_SYSTEM executed"
echo - Threat Intelligence: New threat appears
echo.
echo Wait 30 seconds and refresh Dashboard!
echo.
pause

echo.
echo [TEST 2] Creating MEDIUM severity threat...
echo This will trigger surveillance increase!
echo.

curl -X POST http://localhost:8080/api/threats ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"sourceIP\":\"192.168.1.100\",\"targetSystem\":\"Web-Server\",\"threatType\":\"Port Scanning\",\"severityScore\":6.5,\"intentClassification\":\"Reconnaissance\",\"status\":\"DETECTED\"}"

echo.
echo.
echo ========================================
echo Medium Threat Created!
echo ========================================
echo.
echo This will trigger: INCREASE_SURVEILLANCE
echo Wait 30 seconds and check Dashboard!
echo.
pause

echo.
echo [TEST 3] Checking agent decisions...
echo.

curl http://localhost:8080/api/agents/decisions ^
  -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Check:
echo 1. Dashboard - Agent Decision Feed
echo 2. Threat Intelligence - New threats
echo 3. Backend Terminal - Agent logs
echo.
echo Agents are working autonomously every 30 seconds!
echo.
pause
