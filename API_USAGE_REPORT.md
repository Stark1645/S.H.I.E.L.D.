# S.H.I.E.L.D API Usage Report

## 📡 Complete API Endpoint Documentation

**Base URL:** `http://localhost:8080/api`  
**Authentication:** JWT Bearer Token (stored in localStorage as `shield_token`)

---

## 🔐 Authentication APIs

### 1. Login
```typescript
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string, refreshToken: string, user: {...} }
```

**Used In:**
- `pages/Login.tsx` - User authentication

**Frequency:** On-demand (user login)

---

## 🛡️ Threat Management APIs

### 2. Get All Threats
```typescript
GET /api/threats
Headers: Authorization: Bearer {token}
Response: ThreatEvent[]
```

**Used In:**
- `pages/Dashboard.tsx` - Threat statistics
- `pages/ThreatIntelligence.tsx` - Threat table (15s refresh)
- `pages/ThreatRemediation.tsx` - Active threats (10s refresh)
- `pages/ForensicLogs.tsx` - Threat logs (10s refresh)

**Frequency:** Every 10-15 seconds

---

### 3. Get Threats by Status
```typescript
GET /api/threats/status/{status}
Headers: Authorization: Bearer {token}
Response: ThreatEvent[]
```

**Used In:**
- `pages/ThreatRemediation.tsx` - Filter DETECTED/ACTIVE/CONTAINED threats

**Frequency:** Every 10 seconds

---

### 4. Get Threat Statistics
```typescript
GET /api/threats/stats
Headers: Authorization: Bearer {token}
Response: {
  total: number,
  active: number,
  severity: number,
  containment: number
}
```

**Used In:**
- `pages/Dashboard.tsx` - Metric cards (10s refresh)

**Frequency:** Every 10 seconds

---

### 5. Create Threat
```typescript
POST /api/threats
Headers: Authorization: Bearer {token}
Body: {
  sourceIP: string,
  targetSystem: string,
  threatType: string,
  severityScore: number,
  intentClassification: string,
  status: string
}
Response: ThreatEvent
```

**Used In:**
- `pages/SimulationControl.tsx` - War game simulations
- External scripts - Threat injection

**Frequency:** On-demand

---

### 6. Update Threat
```typescript
PUT /api/threats/{id}
Headers: Authorization: Bearer {token}
Body: ThreatEvent (with updated fields)
Response: ThreatEvent
```

**Used In:**
- `pages/ThreatIntelligence.tsx` - Contain/Resolve buttons
- Manual threat status updates

**Frequency:** On-demand (user action)

---

## 🤖 Agent Decision APIs

### 7. Get All Agent Decisions
```typescript
GET /api/agents/decisions
Headers: Authorization: Bearer {token}
Response: AgentDecision[]
```

**Used In:**
- `pages/Dashboard.tsx` - Agent decision feed (10s refresh)
- `pages/AgentMonitor.tsx` - Agent cards & decisions log (10s refresh)
- `pages/ForensicLogs.tsx` - Agent activity logs (10s refresh)

**Frequency:** Every 10 seconds

**Data Returned:**
```typescript
{
  id: number,
  agentName: string,
  linkedThreatId: number,
  decisionSummary: string,
  confidenceScore: number,
  createdAt: string
}
```

---

### 8. Execute Agent Action
```typescript
POST /api/agents/execute
Headers: Authorization: Bearer {token}
Body: {
  threatId: string,
  agentName: string,
  action: string
}
Response: AgentDecision
```

**Used In:**
- Backend `AgentCoordinator.java` - Automatic agent responses

**Frequency:** Every 30 seconds (automatic)

---

## 📊 Analytics APIs

### 9. Get AI Threat Predictions
```typescript
GET /api/analytics/predictions
Headers: Authorization: Bearer {token}
Response: {
  nextThreatType: string,
  probability: number,
  estimatedSeverity: number,
  timeframe: string
}
```

**Used In:**
- `pages/AdvancedAnalytics.tsx` - AI prediction card (15s refresh)

**Frequency:** Every 15 seconds

---

### 10. Get Threat Timeline
```typescript
GET /api/analytics/timeline
Headers: Authorization: Bearer {token}
Response: ThreatEvent[]
```

**Used In:**
- `pages/AdvancedAnalytics.tsx` - Recent threat timeline (15s refresh)

**Frequency:** Every 15 seconds

---

### 11. Get Attack Patterns
```typescript
GET /api/analytics/patterns
Headers: Authorization: Bearer {token}
Response: {
  coordinated: boolean,
  patternType: string,
  affectedSystems: string[],
  confidence: number
}
```

**Used In:**
- `pages/AdvancedAnalytics.tsx` - Attack pattern detection (15s refresh)

**Frequency:** Every 15 seconds

---

### 12. Get Attack Chain Analysis
```typescript
GET /api/analytics/attack-chain
Headers: Authorization: Bearer {token}
Response: {
  velocity: number,
  multiStage: boolean,
  stages: string[]
}
```

**Used In:**
- `pages/AdvancedAnalytics.tsx` - Attack chain card (15s refresh)

**Frequency:** Every 15 seconds

---

### 13. Get Geolocation Data
```typescript
GET /api/analytics/geolocation
Headers: Authorization: Bearer {token}
Response: Array<{
  country: string,
  threatCount: number,
  severity: number
}>
```

**Used In:**
- `pages/AdvancedAnalytics.tsx` - Global threat distribution (15s refresh)

**Frequency:** Every 15 seconds

---

### 14. Get System Health
```typescript
GET /api/analytics/system-health
Headers: Authorization: Bearer {token}
Response: {
  status: string,
  cpu: {
    systemLoadAverage: number,
    availableProcessors: number
  },
  memory: {
    used: number,
    free: number,
    total: number,
    max: number,
    usagePercent: number
  },
  jvm: {
    uptime: number,
    threads: number
  },
  timestamp: string
}
```

**Used In:**
- `pages/SystemHealth.tsx` - All health metrics (1s refresh)

**Frequency:** Every 1 second

---

### 15. Get Performance History
```typescript
GET /api/analytics/performance
Headers: Authorization: Bearer {token}
Response: Array<{
  timestamp: string,
  cpuUsage: number,
  memoryUsage: number,
  responseTime: number
}>
```

**Used In:**
- `pages/SystemHealth.tsx` - Performance charts (1s refresh)

**Frequency:** Every 1 second

---

## 📈 Summary by Page

### Dashboard Page
- `GET /api/threats/stats` - Every 10s
- `GET /api/agents/decisions` - Every 10s

### Threat Intelligence Page
- `GET /api/threats` - Every 15s
- `PUT /api/threats/{id}` - On-demand

### Threat Remediation Page
- `GET /api/threats/status/{status}` - Every 10s

### Agent Monitor Page
- `GET /api/agents/decisions` - Every 10s
- **Calculates agent stats from decisions:**
  - Total decisions per agent
  - Recent activity (last hour)
  - Average confidence scores
  - Last active timestamp
  - Dynamic status (Healthy/Engaged/Standby)
  - Dynamic load percentage

### Advanced Analytics Page
- `GET /api/analytics/predictions` - Every 15s
- `GET /api/analytics/timeline` - Every 15s
- `GET /api/analytics/patterns` - Every 15s
- `GET /api/analytics/attack-chain` - Every 15s
- `GET /api/analytics/geolocation` - Every 15s

### System Health Page
- `GET /api/analytics/system-health` - Every 1s
- `GET /api/analytics/performance` - Every 1s

### Forensic Logs Page
- `GET /api/agents/decisions` - Every 10s
- `GET /api/threats` - Every 10s

### Simulation Control Page
- `POST /api/threats` - On-demand

---

## 🔄 Auto-Refresh Schedule

| Endpoint | Interval | Pages Using |
|----------|----------|-------------|
| `/threats/stats` | 10s | Dashboard |
| `/threats` | 10-15s | Dashboard, Threat Intelligence, Forensic Logs |
| `/threats/status/{status}` | 10s | Threat Remediation |
| `/agents/decisions` | 10s | Dashboard, Agent Monitor, Forensic Logs |
| `/analytics/predictions` | 15s | Advanced Analytics |
| `/analytics/timeline` | 15s | Advanced Analytics |
| `/analytics/patterns` | 15s | Advanced Analytics |
| `/analytics/attack-chain` | 15s | Advanced Analytics |
| `/analytics/geolocation` | 15s | Advanced Analytics |
| `/analytics/system-health` | 1s | System Health |
| `/analytics/performance` | 1s | System Health |

---

## 🎯 Agent Monitor Specific Usage

### Primary API:
```typescript
GET /api/agents/decisions
```

### What It Returns:
```json
[
  {
    "id": 1,
    "agentName": "SENTINEL-ALPHA",
    "linkedThreatId": 5,
    "decisionSummary": "Isolated compromised system NODE-42",
    "confidenceScore": 0.95,
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "agentName": "DEFENDER-PRIME",
    "linkedThreatId": 5,
    "decisionSummary": "Blocked malicious IP 192.168.1.100",
    "confidenceScore": 0.88,
    "createdAt": "2024-01-15T10:29:45"
  }
]
```

### How Agent Monitor Uses This Data:

**1. Agent Statistics Calculation:**
```typescript
// For each agent (SENTINEL-ALPHA, DEFENDER-PRIME, etc.)
const agentDecisions = allDecisions.filter(d => d.agentName === agentName);
const recentDecisions = agentDecisions.filter(d => 
  new Date(d.createdAt) > Date.now() - 3600000 // Last hour
);

stats = {
  totalDecisions: agentDecisions.length,
  recentDecisions: recentDecisions.length,
  avgConfidence: average(agentDecisions.map(d => d.confidenceScore)),
  lastActive: max(agentDecisions.map(d => d.createdAt))
}
```

**2. Dynamic Status:**
```typescript
if (recentDecisions > 5) status = 'Engaged';
else if (totalDecisions === 0) status = 'Standby';
else status = 'Healthy';
```

**3. Dynamic Load:**
```typescript
load = min(95, max(5, recentDecisions × 15 + random(10)));
```

**4. Visual Updates:**
- Status badge color (Green/Cyan/Gray)
- Load bar percentage
- Total decisions count
- Last active timestamp

---

## 🔑 Key Points

1. **All APIs use JWT authentication** via Bearer token
2. **Agent Monitor uses only 1 API** (`/agents/decisions`) but calculates rich metrics from it
3. **Auto-refresh intervals** vary by data importance (1s-15s)
4. **Real-time workflow** visible through decision timestamps and counts
5. **No mock data** - Everything from PostgreSQL database

---

## 🚀 Backend Services

### Java Spring Boot Controllers:
- `AuthController.java` - Authentication endpoints
- `ThreatController.java` - Threat CRUD operations
- `AgentController.java` - Agent decision endpoints
- `AnalyticsController.java` - Analytics & health endpoints

### Scheduled Tasks:
- `AgentCoordinator.java` - Runs every 30s, creates agent decisions automatically

### Database:
- PostgreSQL - Stores threats, agent decisions, users

---

**Total APIs Used:** 15 endpoints  
**Total Pages:** 8 pages  
**Auto-refresh APIs:** 11 endpoints  
**On-demand APIs:** 4 endpoints

**Agent Monitor API:** `GET /api/agents/decisions` (Every 10 seconds)
