@echo off
echo ========================================
echo S.H.I.E.L.D Auto Agent Test
echo ========================================
echo.

echo [1/2] Getting authentication token...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}" > token.json

for /f "tokens=2 delims=:," %%a in ('type token.json ^| findstr "accessToken"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

del token.json

echo Token obtained!
echo.

echo [2/2] Creating test threats...
echo.

curl -X POST http://localhost:8080/api/threats -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"sourceIP\":\"10.0.0.666\",\"targetSystem\":\"Production-Database\",\"threatType\":\"Advanced Persistent Threat\",\"severityScore\":9.8,\"intentClassification\":\"Data Exfiltration\",\"status\":\"ACTIVE\"}"

echo.
echo.
echo ========================================
echo Test threat created!
echo Agents will respond in 30 seconds.
echo Check Dashboard for agent decisions.
echo ========================================
echo.
pause
