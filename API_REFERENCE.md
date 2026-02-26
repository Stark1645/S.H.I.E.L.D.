# S.H.I.E.L.D - API Reference
## Complete REST API Documentation

**Base URL:** `http://localhost:8080/api`  
**Authentication:** JWT Bearer Token (except /auth endpoints)

---

## Authentication Endpoints (Public)

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "role": "ADMIN|USER|DIRECTOR"
}

Response 200:
{
  "message": "User registered successfully"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response 200:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "role": "ADMIN"
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response 200:
{
  "accessToken": "eyJhbGc..."
}
```

---

## Threat Endpoints (Protected)

### Get All Threats
```http
GET /api/threats
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "threatType": "DDoS / SYN Flood",
    "sourceIP": "104.18.23.45",
    "targetSystem": "API-Gateway-Primary",
    "status": "CONTAINED",
    "severityScore": 9.4,
    "intentClassification": "Resource Exhaustion",
    "description": "...",
    "predictedEscalation": "HIGH",
    "recommendedAction": "ISOLATE",
    "timestamp": "2024-01-15T10:30:00",
    "resolvedAt": null
  }
]
```

### Get Threat by ID
```http
GET /api/threats/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "threatType": "SQL Injection",
  ...
}
```

### Get Threats by Status
```http
GET /api/threats/status/{status}
Authorization: Bearer {token}

Status values: DETECTED, CONTAINED, RESOLVED, SIMULATED, ACTIVE

Response 200:
[...]
```

### Get Dashboard Statistics
```http
GET /api/threats/stats
Authorization: Bearer {token}

Response 200:
{
  "total": 1248,
  "active": 14,
  "severity": 7.8,
  "containment": 94.2
}
```

### Create Threat
```http
POST /api/threats
Authorization: Bearer {token}
Content-Type: application/json

{
  "threatType": "SQL Injection",
  "sourceIP": "192.168.1.100",
  "targetSystem": "User-DB-Master",
  "severityScore": 8.5,
  "intentClassification": "Data Exfiltration",
  "description": "Suspicious SQL query detected"
}

Response 200:
{
  "id": 5,
  "threatType": "SQL Injection",
  "sourceIP": "192.168.1.100",
  "targetSystem": "User-DB-Master",
  "status": "ACTIVE",
  "severityScore": 8.5,
  "intentClassification": "Data Exfiltration",
  "description": "Suspicious SQL query detected",
  "predictedEscalation": "HIGH",
  "recommendedAction": "ISOLATE",
  "timestamp": "2024-01-15T10:35:00",
  "resolvedAt": null
}

Note: ML analysis is automatically performed on creation
```

### Update Threat
```http
PUT /api/threats/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "RESOLVED",
  "severityScore": 7.0
}

Response 200:
{
  "id": 1,
  "status": "RESOLVED",
  "resolvedAt": "2024-01-15T11:00:00",
  ...
}
```

### Delete Threat
```http
DELETE /api/threats/{id}
Authorization: Bearer {token}

Response 200: OK
```

---

## Agent Endpoints (Protected)

### Get All Agent Decisions
```http
GET /api/agents/decisions
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "agentName": "SENTINEL-ALPHA",
    "decisionSummary": "ISOLATE_SYSTEM - Automated response: finalRiskScore=0.856, confidence=0.123, attackChain=ISOLATED_INCIDENT",
    "confidenceScore": 0.98,
    "linkedThreatId": 1,
    "status": "EXECUTED",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### Get Decisions by Threat ID
```http
GET /api/agents/decisions/threat/{threatId}
Authorization: Bearer {token}

Response 200:
[...]
```

### Get Decisions by Agent Name
```http
GET /api/agents/decisions/agent/{agentName}
Authorization: Bearer {token}

Agent names: SENTINEL-ALPHA, DEFENDER-PRIME, RISK-EVALUATOR, 
             ANALYZER-BETA, WATCHER, ORCHESTRATOR

Response 200:
[...]
```

### Create Agent Decision
```http
POST /api/agents/decisions
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentName": "SENTINEL-ALPHA",
  "decisionSummary": "Isolated system due to critical threat",
  "confidenceScore": 0.95,
  "linkedThreatId": 1,
  "status": "EXECUTED"
}

Response 200:
{
  "id": 4,
  "agentName": "SENTINEL-ALPHA",
  ...
}
```

### Execute Agent Action
```http
POST /api/agents/execute
Authorization: Bearer {token}
Content-Type: application/json

{
  "threatId": 1,
  "agentName": "SENTINEL-ALPHA",
  "action": "ISOLATE_SYSTEM"
}

Response 200:
{
  "id": 5,
  "agentName": "SENTINEL-ALPHA",
  "decisionSummary": "ISOLATE_SYSTEM - Automated response: finalRiskScore=0.856, confidence=0.123, attackChain=ISOLATED_INCIDENT",
  "confidenceScore": 0.98,
  "linkedThreatId": 1,
  "status": "EXECUTED",
  "createdAt": "2024-01-15T10:35:00"
}

Note: If action contains "ISOLATE" or "BLOCK", threat status is automatically updated to "CONTAINED"
```

---

## ML Service Endpoints (Internal)

### Service Info
```http
GET http://localhost:8000/

Response 200:
{
  "service": "S.H.I.E.L.D ML Service",
  "version": "1.0.0",
  "status": "operational"
}
```

### Health Check
```http
GET http://localhost:8000/health

Response 200:
{
  "status": "healthy"
}
```

### Analyze Threat
```http
POST http://localhost:8000/analyze
Content-Type: application/json

{
  "threatType": "SQL Injection",
  "severityScore": 8.5,
  "sourceIP": "192.168.1.100"
}

Response 200:
{
  "anomalyScore": 0.82,
  "predictedEscalation": "HIGH",
  "recommendedAction": "ISOLATE"
}

Escalation levels: LOW, MEDIUM, HIGH, CRITICAL
Recommended actions: MONITOR, ISOLATE, BLOCK, ESCALATE
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Threat cannot be null"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Threat not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Authentication Flow

1. **Register** (optional if using default admin user)
   ```
   POST /api/auth/register
   ```

2. **Login** to get tokens
   ```
   POST /api/auth/login
   → Returns accessToken + refreshToken
   ```

3. **Use Access Token** for all protected endpoints
   ```
   Header: Authorization: Bearer {accessToken}
   ```

4. **Refresh Token** when access token expires (24h)
   ```
   POST /api/auth/refresh
   Body: { refreshToken }
   → Returns new accessToken
   ```

---

## Rate Limits

Currently no rate limits implemented. Recommended for production:
- Authentication: 5 requests/minute
- Threats: 100 requests/minute
- Agents: 50 requests/minute

---

## CORS Configuration

Allowed origins:
- http://localhost:3000
- http://localhost:5173
- http://localhost:3001

---

## Testing with cURL

### Login and Get Token
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')
```

### Get All Threats
```bash
curl http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN"
```

### Create Threat
```bash
curl -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threatType": "DDoS",
    "sourceIP": "1.2.3.4",
    "targetSystem": "API-Gateway",
    "severityScore": 9.0,
    "intentClassification": "Service Disruption",
    "description": "Large-scale DDoS attack detected"
  }'
```

---

## Swagger UI

Interactive API documentation available at:
**http://localhost:8080/swagger-ui.html**

OpenAPI specification:
**http://localhost:8080/api-docs**

---

## WebSocket Support

Currently not implemented. Planned for Phase 2:
- Real-time threat updates
- Live agent decision feed
- System status notifications

---

**For more information, see [FEATURE_REPORT.md](FEATURE_REPORT.md)**
