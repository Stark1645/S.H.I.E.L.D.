# S.H.I.E.L.D - Testing Guide
## Comprehensive Testing Documentation

---

## Table of Contents
1. [Manual Testing](#manual-testing)
2. [API Testing](#api-testing)
3. [Integration Testing](#integration-testing)
4. [Performance Testing](#performance-testing)
5. [Security Testing](#security-testing)

---

## Manual Testing

### Frontend UI Testing

**Login Page**
- [ ] Enter valid credentials → Should redirect to dashboard
- [ ] Enter invalid credentials → Should show error toast
- [ ] Leave fields empty → Should show validation errors
- [ ] Check "Remember me" → Should persist login

**Dashboard**
- [ ] Metrics cards display correct data
- [ ] System integrity map shows 50 nodes
- [ ] Click node → Modal opens with details
- [ ] Charts render correctly
- [ ] Agent decision feed updates
- [ ] Auto-refresh works (10s interval)

**Threat Intelligence**
- [ ] Table displays all threats
- [ ] Search filters threats correctly
- [ ] Click threat ID → Shows details
- [ ] Status badges show correct colors
- [ ] Severity bars display correctly
- [ ] Auto-refresh works (15s interval)

**Agent Monitor**
- [ ] All 6 agent cards display
- [ ] Agent status shows correctly
- [ ] Decision feed updates
- [ ] Click decision → Shows details

---

## API Testing

### Using cURL

**1. Authentication**

```bash
# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "role": "USER"
  }'

# Expected: {"message":"User registered successfully"}

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Expected: {"accessToken":"eyJ...","refreshToken":"eyJ...","role":"ADMIN"}

# Save token for next requests
TOKEN="your_access_token_here"
```

**2. Threat Operations**

```bash
# Get all threats
curl http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN"

# Get threat by ID
curl http://localhost:8080/api/threats/1 \
  -H "Authorization: Bearer $TOKEN"

# Get threats by status
curl http://localhost:8080/api/threats/status/ACTIVE \
  -H "Authorization: Bearer $TOKEN"

# Get dashboard stats
curl http://localhost:8080/api/threats/stats \
  -H "Authorization: Bearer $TOKEN"

# Create threat
curl -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threatType": "DDoS",
    "sourceIP": "1.2.3.4",
    "targetSystem": "API-Gateway",
    "severityScore": 9.0,
    "intentClassification": "Service Disruption",
    "description": "Large-scale DDoS attack"
  }'

# Update threat
curl -X PUT http://localhost:8080/api/threats/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RESOLVED",
    "severityScore": 7.0
  }'

# Delete threat
curl -X DELETE http://localhost:8080/api/threats/1 \
  -H "Authorization: Bearer $TOKEN"
```

**3. Agent Operations**

```bash
# Get all decisions
curl http://localhost:8080/api/agents/decisions \
  -H "Authorization: Bearer $TOKEN"

# Get decisions by threat
curl http://localhost:8080/api/agents/decisions/threat/1 \
  -H "Authorization: Bearer $TOKEN"

# Get decisions by agent
curl http://localhost:8080/api/agents/decisions/agent/SENTINEL-ALPHA \
  -H "Authorization: Bearer $TOKEN"

# Execute agent action
curl -X POST http://localhost:8080/api/agents/execute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threatId": 1,
    "agentName": "SENTINEL-ALPHA",
    "action": "ISOLATE_SYSTEM"
  }'
```

**4. ML Service**

```bash
# Health check
curl http://localhost:8000/health

# Analyze threat
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "threatType": "SQL Injection",
    "severityScore": 8.5,
    "sourceIP": "192.168.1.100"
  }'
```

### Using Postman

**Import Collection:**

1. Create new collection "S.H.I.E.L.D API"
2. Add environment variables:
   - `base_url`: http://localhost:8080/api
   - `token`: (will be set after login)

**Test Sequence:**

1. **Login** → Save `accessToken` to `{{token}}`
2. **Get Threats** → Verify response
3. **Create Threat** → Save threat ID
4. **Get Threat by ID** → Verify created threat
5. **Execute Agent Action** → Verify decision created
6. **Update Threat** → Verify status changed
7. **Delete Threat** → Verify deletion

---

## Integration Testing

### Full Flow Test: Threat Creation to Agent Response

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"

# 2. Create high-severity threat
THREAT=$(curl -s -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threatType": "SQL Injection",
    "sourceIP": "192.168.1.100",
    "targetSystem": "User-DB-Master",
    "severityScore": 9.5,
    "intentClassification": "Data Exfiltration",
    "description": "Critical SQL injection detected"
  }')

THREAT_ID=$(echo $THREAT | jq -r '.id')
echo "Created Threat ID: $THREAT_ID"

# 3. Verify ML analysis was performed
echo $THREAT | jq '{predictedEscalation, recommendedAction}'

# 4. Wait for agent coordinator (runs every 30s)
echo "Waiting 35 seconds for agent coordinator..."
sleep 35

# 5. Check agent decisions for this threat
curl -s http://localhost:8080/api/agents/decisions/threat/$THREAT_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 6. Verify threat status changed to CONTAINED
curl -s http://localhost:8080/api/threats/$THREAT_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '{id, status, severityScore}'
```

**Expected Results:**
- Threat created with ML predictions
- Agent decisions logged (SENTINEL-ALPHA, DEFENDER-PRIME)
- Threat status changed to CONTAINED

### Attack Chain Detection Test

```bash
# Create 3 threats from same IP to same target
for i in {1..3}; do
  curl -s -X POST http://localhost:8080/api/threats \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"threatType\": \"Attack-$i\",
      \"sourceIP\": \"45.132.8.12\",
      \"targetSystem\": \"Worker-Node-07\",
      \"severityScore\": 8.0,
      \"description\": \"Attack chain test $i\"
    }" | jq '{id, threatType}'
  sleep 2
done

# Wait for agent coordinator
sleep 35

# Check for ORCHESTRATOR decision (honeypot deployment)
curl -s http://localhost:8080/api/agents/decisions/agent/ORCHESTRATOR \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.[] | select(.decisionSummary | contains("POTENTIAL_ATTACK_CAMPAIGN"))'
```

---

## Performance Testing

### Load Testing with Apache Bench

**Test Authentication Endpoint:**
```bash
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:8080/api/auth/login
```

**login.json:**
```json
{"username":"admin","password":"admin123"}
```

**Expected Results:**
- Requests per second: >100
- Mean response time: <200ms
- Failed requests: 0

**Test Threat Retrieval:**
```bash
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/threats
```

**Expected Results:**
- Requests per second: >200
- Mean response time: <100ms
- Failed requests: 0

### Database Performance

```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM threat_events WHERE status = 'ACTIVE';

-- Check index usage
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE tablename = 'threat_events';

-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('threat_events'));
```

---

## Security Testing

### Authentication Tests

**1. Test Invalid Credentials**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'

# Expected: 401 Unauthorized
```

**2. Test Expired Token**
```bash
# Use old/invalid token
curl http://localhost:8080/api/threats \
  -H "Authorization: Bearer invalid_token"

# Expected: 401 Unauthorized
```

**3. Test Missing Token**
```bash
curl http://localhost:8080/api/threats

# Expected: 401 Unauthorized
```

### SQL Injection Tests

```bash
# Try SQL injection in threat creation
curl -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threatType": "Test'; DROP TABLE threat_events;--",
    "sourceIP": "1.2.3.4",
    "targetSystem": "Test",
    "severityScore": 5.0
  }'

# Expected: Threat created safely, no SQL injection
```

### XSS Tests

```bash
# Try XSS in description
curl -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threatType": "Test",
    "sourceIP": "1.2.3.4",
    "targetSystem": "Test",
    "severityScore": 5.0,
    "description": "<script>alert(\"XSS\")</script>"
  }'

# Expected: Stored safely, escaped in frontend
```

### CORS Tests

```bash
# Test from unauthorized origin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Origin: http://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected: CORS error (blocked by browser)
```

---

## Automated Test Scripts

### Backend Unit Tests

```bash
cd backend-java
mvn test
```

### Frontend Tests

```bash
npm run test
```

### Integration Test Script

Create `test-integration.sh`:

```bash
#!/bin/bash

echo "=== S.H.I.E.L.D Integration Tests ==="

# 1. Check services
echo "Checking services..."
curl -f http://localhost:8080/swagger-ui.html > /dev/null || exit 1
curl -f http://localhost:8000/health > /dev/null || exit 1
curl -f http://localhost:5173 > /dev/null || exit 1
echo "✓ All services running"

# 2. Test authentication
echo "Testing authentication..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')
[ -n "$TOKEN" ] || exit 1
echo "✓ Authentication successful"

# 3. Test threat CRUD
echo "Testing threat operations..."
THREAT_ID=$(curl -s -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threatType":"Test","sourceIP":"1.2.3.4","targetSystem":"Test","severityScore":5.0}' \
  | jq -r '.id')
[ -n "$THREAT_ID" ] || exit 1
echo "✓ Threat created: $THREAT_ID"

curl -s http://localhost:8080/api/threats/$THREAT_ID \
  -H "Authorization: Bearer $TOKEN" > /dev/null || exit 1
echo "✓ Threat retrieved"

curl -s -X DELETE http://localhost:8080/api/threats/$THREAT_ID \
  -H "Authorization: Bearer $TOKEN" > /dev/null || exit 1
echo "✓ Threat deleted"

# 4. Test ML service
echo "Testing ML service..."
curl -s -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"threatType":"Test","severityScore":5.0,"sourceIP":"1.2.3.4"}' \
  | jq -e '.anomalyScore' > /dev/null || exit 1
echo "✓ ML analysis successful"

echo "=== All tests passed! ==="
```

Run:
```bash
chmod +x test-integration.sh
./test-integration.sh
```

---

## Test Checklist

### Pre-Deployment Testing

- [ ] All services start without errors
- [ ] Database migrations successful
- [ ] Authentication works (login/register/refresh)
- [ ] All CRUD operations work
- [ ] ML service responds correctly
- [ ] Agent coordinator executes on schedule
- [ ] Frontend loads and displays data
- [ ] Auto-refresh mechanisms work
- [ ] Error handling works correctly
- [ ] Security measures in place (JWT, CORS, BCrypt)

### Performance Benchmarks

- [ ] Authentication: <200ms
- [ ] Threat retrieval: <100ms
- [ ] Threat creation: <500ms (includes ML)
- [ ] Dashboard load: <1s
- [ ] Concurrent users: 100+

### Security Checks

- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF protected (stateless JWT)
- [ ] Passwords hashed (BCrypt)
- [ ] Tokens expire correctly
- [ ] CORS configured properly
- [ ] No sensitive data in logs

---

**For more information, see [FEATURE_REPORT.md](FEATURE_REPORT.md)**
