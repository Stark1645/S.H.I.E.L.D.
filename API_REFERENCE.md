# 🔌 S.H.I.E.L.D API Reference

## Base URL
```
http://localhost:8080/api
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "role": "ADMIN"
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "USER"
}

Response:
{
  "message": "User registered successfully"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "accessToken": "eyJhbGc..."
}
```

---

## 🎯 Threat Endpoints

### Get All Threats
```http
GET /threats
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "sourceIP": "104.18.23.45",
    "targetSystem": "API-Gateway-Primary",
    "threatType": "DDoS / SYN Flood",
    "severityScore": 9.4,
    "intentClassification": "Resource Exhaustion",
    "status": "CONTAINED",
    "timestamp": "2025-01-15T10:30:00"
  }
]
```

### Get Threat by ID
```http
GET /threats/{id}
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "sourceIP": "104.18.23.45",
  ...
}
```

### Get Threats by Status
```http
GET /threats/status/{status}
Authorization: Bearer {token}

Status values: DETECTED, CONTAINED, RESOLVED, SIMULATED

Response: Array of threats
```

### Get Dashboard Stats
```http
GET /threats/stats
Authorization: Bearer {token}

Response:
{
  "total": 1248,
  "active": 14,
  "severity": 7.8,
  "containment": 94.2
}
```

### Create Threat
```http
POST /threats
Authorization: Bearer {token}
Content-Type: application/json

{
  "sourceIP": "10.0.0.1",
  "targetSystem": "Web-Server",
  "threatType": "XSS Attack",
  "severityScore": 7.5,
  "intentClassification": "Code Injection",
  "status": "DETECTED"
}

Response: Created threat object
```

### Update Threat
```http
PUT /threats/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "CONTAINED",
  "severityScore": 8.0
}

Response: Updated threat object
```

### Delete Threat
```http
DELETE /threats/{id}
Authorization: Bearer {token}

Response: 200 OK
```

---

## 🤖 Agent Endpoints

### Get All Decisions
```http
GET /agents/decisions
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "agentName": "Sentinel-Alpha",
    "decisionSummary": "Isolating System-04 due to anomalous outbound traffic.",
    "confidenceScore": 0.98,
    "linkedThreatId": 1,
    "createdAt": "2025-01-15T10:30:00"
  }
]
```

### Get Decisions by Threat
```http
GET /agents/decisions/threat/{threatId}
Authorization: Bearer {token}

Response: Array of decisions for that threat
```

### Get Decisions by Agent
```http
GET /agents/decisions/agent/{agentName}
Authorization: Bearer {token}

Response: Array of decisions by that agent
```

### Create Decision
```http
POST /agents/decisions
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentName": "Risk-Evaluator",
  "decisionSummary": "Escalating threat level to HIGH",
  "confidenceScore": 0.87,
  "linkedThreatId": 2
}

Response: Created decision object
```

### Execute Agent Action
```http
POST /agents/execute
Authorization: Bearer {token}
Content-Type: application/json

{
  "threatId": 1,
  "agentName": "Sentinel-Alpha",
  "action": "ISOLATE_SYSTEM"
}

Response: Created decision object
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔑 Authentication Flow

1. **Login** → Get `accessToken` and `refreshToken`
2. **Store** → Save `accessToken` in localStorage
3. **Use** → Include in Authorization header: `Bearer {accessToken}`
4. **Refresh** → When token expires, use `refreshToken` to get new `accessToken`

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Threats (with token)
```bash
curl -X GET http://localhost:8080/api/threats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Threat
```bash
curl -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceIP": "10.0.0.1",
    "targetSystem": "Web-Server",
    "threatType": "XSS Attack",
    "severityScore": 7.5,
    "intentClassification": "Code Injection",
    "status": "DETECTED"
  }'
```

---

## 🔍 Frontend API Usage

The frontend uses the API service layer in `services/api.ts`:

```typescript
import { authAPI, threatAPI, agentAPI } from './services/api';

// Login
const data = await authAPI.login('admin', 'admin123');
localStorage.setItem('shield_token', data.accessToken);

// Get threats
const threats = await threatAPI.getAll();

// Get stats
const stats = await threatAPI.getStats();

// Get agent decisions
const decisions = await agentAPI.getAllDecisions();

// Execute action
await agentAPI.executeAction(1, 'Sentinel-Alpha', 'ISOLATE');
```

---

## 🛡️ Security Notes

1. **Always use HTTPS in production**
2. **Tokens expire** - accessToken: 1 hour, refreshToken: 24 hours
3. **Store tokens securely** - Use httpOnly cookies in production
4. **Validate all inputs** - Backend validates all requests
5. **CORS is configured** - Only allowed origins can access API

---

## 📝 Sample Data

Default data created on first run:

**User:**
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

**Threats:** 4 sample threats (DDoS, SQL Injection, Reverse Shell, Credential Stuffing)

**Decisions:** 3 sample agent decisions

---

## 🚀 Quick Start

1. Start backend: `mvn spring-boot:run`
2. Get token: Login via frontend or cURL
3. Use token: Include in Authorization header
4. Make requests: Use any HTTP client

---

## 📚 Swagger Documentation

Interactive API docs available at:
```
http://localhost:8080/swagger-ui.html
```

Test all endpoints directly from the browser!

---

**Happy Coding! 🛡️**
