@echo off
echo Testing S.H.I.E.L.D Agent System...
echo.

echo 1. Checking agent health status...
curl -s -H "Authorization: Bearer %1" http://localhost:8080/api/agents/health | jq .
echo.

echo 2. Creating test threat to trigger agents...
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer %1" ^
  -d "{\"threatType\":\"DDoS\",\"sourceIP\":\"192.168.1.100\",\"targetSystem\":\"web-server-01\",\"severityScore\":8.5,\"description\":\"High-severity DDoS attack\"}" ^
  http://localhost:8080/api/threats | jq .
echo.

echo 3. Waiting 5 seconds for agents to process...
timeout /t 5 /nobreak > nul

echo 4. Checking recent agent decisions...
curl -s -H "Authorization: Bearer %1" http://localhost:8080/api/agents/decisions | jq ".[0:5]"
echo.

echo Test complete! Check if ORCHESTRATOR and other agents responded.