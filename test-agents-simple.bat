@echo off
echo ========================================
echo S.H.I.E.L.D Agent Testing Tool
echo ========================================
echo.

set /p TOKEN="Paste your JWT token here and press Enter: "

echo.
echo Token received! Testing agents...
echo.

echo [TEST 1] Creating HIGH severity threat...
echo.

curl -X POST http://localhost:8080/api/threats -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"sourceIP\":\"10.0.0.666\",\"targetSystem\":\"Production-Database\",\"threatType\":\"Advanced Persistent Threat\",\"severityScore\":9.8,\"intentClassification\":\"Data Exfiltration\",\"status\":\"ACTIVE\"}"

echo.
echo.
echo ========================================
echo Threat Created!
echo ========================================
echo.
echo Wait 30 seconds and check:
echo - Dashboard: Agent Decision Feed
echo - Backend Logs: Agent actions
echo.
pause

echo.
echo [TEST 2] Creating MEDIUM severity threat...
echo.

curl -X POST http://localhost:8080/api/threats -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"sourceIP\":\"192.168.1.100\",\"targetSystem\":\"Web-Server\",\"threatType\":\"Port Scanning\",\"severityScore\":6.5,\"intentClassification\":\"Reconnaissance\",\"status\":\"ACTIVE\"}"

echo.
echo.
echo ========================================
echo Second Threat Created!
echo ========================================
echo.
echo Agents will respond in 30 seconds!
echo Check Dashboard now!
echo.
pause

echo.
echo [TEST 3] Viewing all agent decisions...
echo.

curl http://localhost:8080/api/agents/decisions -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo ========================================
echo Testing Complete!
echo ========================================
echo.
pause
