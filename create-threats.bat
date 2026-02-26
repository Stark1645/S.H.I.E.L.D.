@echo off
echo ========================================
echo S.H.I.E.L.D - Create Threats via Command
echo ========================================
echo.

echo Logging in...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}" > token.json

for /f "tokens=2 delims=:," %%a in ('findstr "accessToken" token.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo.
echo Creating Threat 1: DDoS Attack...
curl -s -X POST http://localhost:8080/api/threats -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"sourceIP\":\"45.142.33.21\",\"targetSystem\":\"web-server-01\",\"threatType\":\"DDoS Attack\",\"severityScore\":9.0,\"intentClassification\":\"Malicious\",\"status\":\"DETECTED\"}"
echo Done!

echo.
echo Creating Threat 2: SQL Injection...
curl -s -X POST http://localhost:8080/api/threats -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"sourceIP\":\"103.253.45.67\",\"targetSystem\":\"database-server\",\"threatType\":\"SQL Injection\",\"severityScore\":7.5,\"intentClassification\":\"Malicious\",\"status\":\"DETECTED\"}"
echo Done!

echo.
echo ========================================
echo 2 Threats Created Successfully!
echo Emails sent to all recipients.
echo ========================================
echo.
echo Check:
echo 1. Dashboard for new threats
echo 2. Backend logs for email confirmation
echo 3. Email inboxes for alerts
echo.
pause
