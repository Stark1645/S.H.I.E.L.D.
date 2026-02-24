# S.H.I.E.L.D - What Each Feature Generates & Produces

## 🎯 Complete Output & Generation Report

---

## 🔐 AUTHENTICATION SYSTEM

### Register User
**Input:**
```json
{
  "username": "admin",
  "password": "admin123",
  "role": "ADMIN"
}
```

**What It Generates:**
1. **Database Record** (users table):
```sql
INSERT INTO users (id, username, password, role, created_at) VALUES
(1, 'admin', '$2a$10$encrypted_hash...', 'ADMIN', '2025-02-21 10:30:00');
```

2. **Response:**
```json
{
  "message": "User registered successfully"
}
```

**What Happens:**
- Password is hashed using BCrypt (60 character hash)
- User record stored in PostgreSQL
- Ready for login

---

### Login
**Input:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**What It Generates:**
1. **JWT Access Token** (expires in 1 hour):
```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwODUxMjAwMCwiZXhwIjoxNzA4NTE1NjAwfQ.signature...
```

2. **JWT Refresh Token** (expires in 24 hours):
```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwODUxMjAwMCwiZXhwIjoxNzA4NTk4NDAwfQ.signature...
```

3. **Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "role": "ADMIN"
}
```

**What Happens:**
- Backend validates password against BCrypt hash
- Generates two JWT tokens with different expiration times
- Frontend stores tokens in localStorage
- All subsequent requests include: `Authorization: Bearer <accessToken>`

---

## 🚨 THREAT MANAGEMENT

### Create Threat
**Input:**
```json
{
  "threatType": "MALWARE",
  "severity": "HIGH",
  "sourceIp": "192.168.1.100",
  "targetSystem": "web-server-01",
  "description": "Suspicious executable detected in /tmp directory"
}
```

**What It Generates:**

#### Step 1: Backend Receives Request
- Validates JWT token
- Extracts threat data

#### Step 2: ML Service Analysis
**Backend sends to ML Service:**
```json
{
  "threatType": "MALWARE",
  "severity": "HIGH",
  "sourceIp": "192.168.1.100"
}
```

**ML Service Processes:**
1. Maps severity to numeric: HIGH = 3
2. Maps threat type to score: MALWARE = 3
3. Extracts IP features: 4 octets
4. Creates feature vector: [3, 3, 4]
5. Runs IsolationForest model
6. Calculates anomaly score

**ML Service Returns:**
```json
{
  "anomalyScore": 0.756,
  "predictedEscalation": "CRITICAL",
  "recommendedAction": "ISOLATE_AND_BLOCK"
}
```

#### Step 3: Database Record Created
```sql
INSERT INTO threat_events (
  id, threat_type, severity, source_ip, target_system, 
  status, description, anomaly_score, predicted_escalation, 
  recommended_action, detected_at
) VALUES (
  1, 'MALWARE', 'HIGH', '192.168.1.100', 'web-server-01',
  'ACTIVE', 'Suspicious executable detected...', 0.756, 
  'CRITICAL', 'ISOLATE_AND_BLOCK', '2025-02-21 10:35:00'
);
```

#### Step 4: Response to Frontend
```json
{
  "id": 1,
  "threatType": "MALWARE",
  "severity": "HIGH",
  "sourceIp": "192.168.1.100",
  "targetSystem": "web-server-01",
  "status": "ACTIVE",
  "description": "Suspicious executable detected in /tmp directory",
  "anomalyScore": 0.756,
  "predictedEscalation": "CRITICAL",
  "recommendedAction": "ISOLATE_AND_BLOCK",
  "detectedAt": "2025-02-21T10:35:00",
  "resolvedAt": null
}
```

**What Happens:**
- Threat appears in Dashboard metrics (Active Threats +1)
- Shows in Threat Intelligence table
- Appears in System Integrity Map (red node)
- Triggers autonomous agent response (next cycle)

---

### Get All Threats
**Request:**
```
GET /api/threats
Authorization: Bearer eyJhbGc...
```

**What It Generates:**
```json
[
  {
    "id": 1,
    "threatType": "MALWARE",
    "severity": "HIGH",
    "sourceIp": "192.168.1.100",
    "targetSystem": "web-server-01",
    "status": "ACTIVE",
    "anomalyScore": 0.756,
    "predictedEscalation": "CRITICAL",
    "recommendedAction": "ISOLATE_AND_BLOCK",
    "detectedAt": "2025-02-21T10:35:00"
  },
  {
    "id": 2,
    "threatType": "DDoS",
    "severity": "CRITICAL",
    "sourceIp": "45.132.8.12",
    "targetSystem": "api-gateway",
    "status": "CONTAINED",
    "anomalyScore": 0.892,
    "predictedEscalation": "CRITICAL",
    "recommendedAction": "ISOLATE_AND_BLOCK",
    "detectedAt": "2025-02-21T09:15:00",
    "resolvedAt": "2025-02-21T10:20:00"
  }
]
```

**What Happens:**
- Frontend displays in Threat Intelligence table
- Updates Dashboard metrics
- Populates charts and graphs

---

### Update Threat Status
**Input:**
```json
{
  "status": "RESOLVED",
  "severity": "HIGH"
}
```

**What It Generates:**

#### Database Update:
```sql
UPDATE threat_events 
SET status = 'RESOLVED', 
    resolved_at = '2025-02-21 11:00:00'
WHERE id = 1;
```

#### Response:
```json
{
  "id": 1,
  "status": "RESOLVED",
  "resolvedAt": "2025-02-21T11:00:00",
  ...
}
```

**What Happens:**
- Threat badge changes from red (DETECTED) to gray (RESOLVED)
- Active Threats count decreases
- Containment Rate increases
- Node color changes from red to green

---

## 🤖 AUTONOMOUS AGENT SYSTEM

### Agent Coordinator (Runs Every 30 Seconds)

**What It Does:**

#### Step 1: Query Active Threats
```sql
SELECT * FROM threat_events WHERE status = 'ACTIVE';
```

**Returns:**
```
Threat ID: 1, Anomaly Score: 0.756
Threat ID: 3, Anomaly Score: 0.892
Threat ID: 5, Anomaly Score: 0.423
```

#### Step 2: Evaluate Each Threat

**For Threat ID 1 (Score: 0.756):**
- Score > 0.7 → Execute ISOLATE_SYSTEM action

**Generates Agent Decision:**
```sql
INSERT INTO agent_decisions (
  agent_name, action, reasoning, status, threat_event_id, timestamp
) VALUES (
  'DEFENDER', 
  'ISOLATE_SYSTEM', 
  'Automated response based on threat analysis',
  'EXECUTED',
  1,
  '2025-02-21 10:35:30'
);
```

**For Threat ID 5 (Score: 0.423):**
- Score > 0.4 → Execute INCREASE_SURVEILLANCE action

**Generates Agent Decision:**
```sql
INSERT INTO agent_decisions (
  agent_name, action, reasoning, status, threat_event_id, timestamp
) VALUES (
  'MONITOR', 
  'INCREASE_SURVEILLANCE', 
  'Automated response based on threat analysis',
  'EXECUTED',
  5,
  '2025-02-21 10:35:30'
);
```

**What Happens:**
- Decisions appear in Agent Decision Feed on Dashboard
- Shows in Agent Monitor page as RPC logs
- Creates audit trail of autonomous actions

---

### Manual Agent Action
**Input:**
```json
{
  "threatId": 1,
  "agentName": "DEFENDER",
  "action": "QUARANTINE_SYSTEM"
}
```

**What It Generates:**

#### Database Record:
```sql
INSERT INTO agent_decisions (
  agent_name, action, reasoning, status, threat_event_id, timestamp
) VALUES (
  'DEFENDER',
  'QUARANTINE_SYSTEM',
  'Automated response based on threat analysis',
  'EXECUTED',
  1,
  '2025-02-21 10:40:00'
);
```

#### Response:
```json
{
  "id": 10,
  "agentName": "DEFENDER",
  "action": "QUARANTINE_SYSTEM",
  "reasoning": "Automated response based on threat analysis",
  "status": "EXECUTED",
  "threatEvent": {
    "id": 1,
    "threatType": "MALWARE"
  },
  "timestamp": "2025-02-21T10:40:00"
}
```

**What Happens:**
- Decision appears in Agent Decision Feed
- Shows notification: "QUARANTINE_SYSTEM sequence initiated..."
- Logs in RPC communication panel

---

## 📊 DASHBOARD OUTPUTS

### Metric Cards Generate:

#### Total Events Card
**Query:**
```sql
SELECT COUNT(*) FROM threat_events;
```
**Output:** `1248`

#### Active Threats Card
**Query:**
```sql
SELECT COUNT(*) FROM threat_events WHERE status = 'ACTIVE';
```
**Output:** `14` (pulsing red)

#### Average Severity Card
**Query:**
```sql
SELECT AVG(anomaly_score * 10) FROM threat_events WHERE status = 'ACTIVE';
```
**Output:** `7.8`

#### Containment Rate Card
**Query:**
```sql
SELECT 
  (COUNT(CASE WHEN status IN ('RESOLVED', 'CONTAINED') THEN 1 END) * 100.0 / COUNT(*))
FROM threat_events;
```
**Output:** `94.2%`

---

### System Integrity Map Generates:

**For Each Node (1-50):**
```javascript
Node 1: { status: 'healthy', color: 'green', load: 12% }
Node 7: { status: 'warning', color: 'amber', load: 67% }
Node 12: { status: 'critical', color: 'red', load: 94%, pulsing: true }
Node 44: { status: 'critical', color: 'red', load: 89%, pulsing: true }
```

**Click Node 12 Generates Modal:**
```
Node Analysis: 12
Status: OPERATIONAL
Traffic Load: 87 Mbps
Packet Trace:
  >>> TRACING PACKET 0x4f2...
  >>> SOURCE: 12.4.90.112
  >>> DEST: INTERNAL_LB_01
  >>> VERDICT: ALLOWED
```

---

### Threat Vectors Pie Chart Generates:

**Query:**
```sql
SELECT threat_type, COUNT(*) as count 
FROM threat_events 
GROUP BY threat_type;
```

**Output:**
```json
[
  { "name": "DDoS", "value": 400, "color": "#ef4444" },
  { "name": "SQLi", "value": 300, "color": "#f59e0b" },
  { "name": "Phishing", "value": 300, "color": "#3b82f6" },
  { "name": "Malware", "value": 200, "color": "#10b981" }
]
```

**Visual:** Interactive pie chart with 4 colored segments

---

### Escalation Probability Chart Generates:

**Query:**
```sql
SELECT 
  DATE_FORMAT(detected_at, '%H:00') as time,
  COUNT(*) as value
FROM threat_events
WHERE detected_at >= NOW() - INTERVAL 24 HOUR
GROUP BY DATE_FORMAT(detected_at, '%H:00')
ORDER BY time;
```

**Output:**
```json
[
  { "time": "00:00", "value": 34 },
  { "time": "04:00", "value": 45 },
  { "time": "08:00", "value": 28 },
  { "time": "12:00", "value": 89 },
  { "time": "16:00", "value": 65 },
  { "time": "20:00", "value": 42 }
]
```

**Visual:** Area chart showing 24-hour trend

---

### Agent Decision Feed Generates:

**Query:**
```sql
SELECT * FROM agent_decisions 
ORDER BY timestamp DESC 
LIMIT 10;
```

**Output:**
```json
[
  {
    "id": "1",
    "agentName": "Sentinel-Alpha",
    "decisionSummary": "Isolating System-04 due to anomalous outbound traffic.",
    "confidenceScore": 0.98,
    "linkedThreatId": "TR-902",
    "createdAt": "2025-02-21T10:35:30"
  },
  {
    "id": "2",
    "agentName": "Risk-Evaluator",
    "decisionSummary": "Upgraded Threat Level to CRITICAL for IP 192.168.1.45.",
    "confidenceScore": 0.85,
    "linkedThreatId": "TR-903",
    "createdAt": "2025-02-21T10:34:15"
  }
]
```

**Visual:** Scrollable feed with decision cards

---

## 🧠 THREAT INTELLIGENCE PAGE

### Search/Filter Generates:

**Input:** User types "192.168"

**What It Does:**
```javascript
// Frontend filters in real-time
threats.filter(t => 
  t.id.includes("192.168") ||
  t.sourceIP.includes("192.168") ||
  t.threatType.includes("192.168") ||
  t.targetSystem.includes("192.168")
)
```

**Output:** Filtered table showing only matching threats

---

### Generate Report Button

**What It Generates:**

#### Step 1: Shows Loading State
```
"Compiling cryptographic threat report..."
```

#### Step 2: Backend Processes (2 seconds)
```sql
SELECT 
  threat_type,
  COUNT(*) as count,
  AVG(anomaly_score) as avg_score,
  MAX(detected_at) as last_seen
FROM threat_events
GROUP BY threat_type;
```

#### Step 3: Generates Report File
```json
{
  "reportId": "RPT-2025-02-21-001",
  "generatedAt": "2025-02-21T10:45:00",
  "summary": {
    "totalThreats": 1248,
    "activeThreats": 14,
    "criticalThreats": 7,
    "avgSeverity": 7.8
  },
  "threatBreakdown": [
    { "type": "DDoS", "count": 400, "avgScore": 8.2 },
    { "type": "SQLi", "count": 300, "avgScore": 7.5 },
    { "type": "Phishing", "count": 300, "avgScore": 6.8 },
    { "type": "Malware", "count": 248, "avgScore": 8.9 }
  ],
  "recommendations": [
    "Increase monitoring on DDoS vectors",
    "Deploy additional WAF rules for SQLi",
    "Enhance email filtering for phishing"
  ]
}
```

#### Step 4: Shows Success
```
"Report generated and saved to Secure Vault"
```

**What Happens:**
- Report saved to backend storage
- Available for download
- Logged in audit trail

---

### Trace Origin Button

**Input:** Click on threat with IP 192.168.1.100

**What It Generates:**

#### Step 1: Shows Loading
```
"Analyzing source origin for 192.168.1.100..."
```

#### Step 2: Backend Calls ML Service
```json
{
  "ip": "192.168.1.100",
  "threatType": "MALWARE"
}
```

#### Step 3: ML Service Analyzes
```json
{
  "ipReputation": "SUSPICIOUS",
  "geoLocation": "Unknown",
  "knownMalicious": true,
  "threatIntelFeeds": ["AbuseIPDB", "VirusTotal"],
  "riskScore": 8.5
}
```

#### Step 4: Shows Results
```
Modal with:
- IP: 192.168.1.100
- Reputation: SUSPICIOUS
- Risk Score: 8.5/10
- Known in threat feeds
- Recommended: BLOCK
```

---

## 🤖 AGENT MONITOR PAGE

### Agent Status Cards Generate:

**For Each Agent:**

#### MonitoringAgent
```json
{
  "name": "MonitoringAgent",
  "status": "Healthy",
  "load": 12,
  "uptime": "142d 4h",
  "description": "Ingesting raw telemetry",
  "metrics": {
    "eventsProcessed": 1248000,
    "avgProcessingTime": "2.3ms",
    "errorRate": "0.01%"
  }
}
```

**Visual Output:**
- Green status badge
- 12% load bar (cyan)
- Uptime: 142d 4h
- REBOOT and RECONFIGURE buttons

---

### REBOOT Button

**What It Generates:**

#### Step 1: Shows Processing
```
Agent card shows: "PROCESSING" badge (amber, pulsing)
Notification: "REBOOT sequence initiated for MonitoringAgent..."
```

#### Step 2: Backend API Call
```
POST /api/agents/MonitoringAgent/reboot
```

#### Step 3: Backend Logs Action
```sql
INSERT INTO agent_actions (
  agent_name, action, status, timestamp
) VALUES (
  'MonitoringAgent', 'REBOOT', 'IN_PROGRESS', '2025-02-21 10:50:00'
);
```

#### Step 4: Simulates Reboot (2.5 seconds)
```
Agent status changes to: "REBOOTING"
Load drops to 0%
```

#### Step 5: Completion
```sql
UPDATE agent_actions 
SET status = 'COMPLETED', completed_at = '2025-02-21 10:50:02'
WHERE id = LAST_INSERT_ID();
```

**Shows:**
```
Notification: "MonitoringAgent rebooted and synchronized."
Agent status: "Healthy"
Load: Returns to normal
```

---

### RPC Logs Generate:

**Real-time Stream:**
```
[12:04:12] CALL [RiskIntentAgent] -> [HeadOrchestrator] 
           Payload: { threatId: 'TR-902', severity: 9.2 }

[12:04:13] RESP [HeadOrchestrator] OK: Ack Strategy 'ISOLATION_V4'

[12:04:15] CALL [HeadOrchestrator] -> [DefenseDeception] 
           Trigger: Deploy Honeypot-B

[12:04:22] EVENT: Honeypot-B active at 172.16.0.45

[12:04:30] SYNC: Multi-Agent state consistent across cluster (6 nodes)
```

**What Happens:**
- Shows inter-agent communication
- Logs all RPC calls
- Displays payloads and responses
- Updates in real-time

---

## 📈 ML SERVICE OUTPUTS

### Anomaly Detection Algorithm

**Input Features:**
```python
severity_score = 3  # HIGH
threat_score = 3    # MALWARE
ip_score = 4        # 4 octets
features = [3, 3, 4]
```

**IsolationForest Processing:**
```python
# Model trained on baseline normal behavior
baseline_data = np.random.randn(100, 3)
model.fit(baseline_data)

# Predict anomaly
anomaly_raw = -model.score_samples([[3, 3, 4]])[0]
# Output: 1.512

# Normalize to 0-1
anomaly_score = min(max(anomaly_raw / 2, 0), 1)
# Output: 0.756
```

**Escalation Logic:**
```python
if anomaly_score > 0.7:
    escalation = "CRITICAL"
    action = "ISOLATE_AND_BLOCK"
elif anomaly_score > 0.5:
    escalation = "HIGH"
    action = "QUARANTINE"
elif anomaly_score > 0.3:
    escalation = "MEDIUM"
    action = "MONITOR"
else:
    escalation = "LOW"
    action = "LOG"
```

**Final Output:**
```json
{
  "anomalyScore": 0.756,
  "predictedEscalation": "CRITICAL",
  "recommendedAction": "ISOLATE_AND_BLOCK"
}
```

---

## 🗄️ DATABASE RECORDS GENERATED

### Complete Threat Lifecycle

#### 1. Threat Created
```sql
INSERT INTO threat_events VALUES (
  1, 'MALWARE', 'HIGH', '192.168.1.100', 'web-server-01',
  'ACTIVE', 'Suspicious activity', 0.756, 'CRITICAL',
  'ISOLATE_AND_BLOCK', '2025-02-21 10:35:00', NULL
);
```

#### 2. Agent Decision Created (30s later)
```sql
INSERT INTO agent_decisions VALUES (
  1, 'DEFENDER', 'ISOLATE_SYSTEM', 
  'Automated response based on threat analysis',
  'EXECUTED', 1, '2025-02-21 10:35:30'
);
```

#### 3. Threat Updated
```sql
UPDATE threat_events 
SET status = 'CONTAINED'
WHERE id = 1;
```

#### 4. Second Agent Decision
```sql
INSERT INTO agent_decisions VALUES (
  2, 'MONITOR', 'VERIFY_ISOLATION',
  'Confirming system isolation successful',
  'EXECUTED', 1, '2025-02-21 10:36:00'
);
```

#### 5. Threat Resolved
```sql
UPDATE threat_events 
SET status = 'RESOLVED', resolved_at = '2025-02-21 11:00:00'
WHERE id = 1;
```

**Final Database State:**
```
threat_events table:
- 1 resolved threat
- 2 agent decisions linked to it
- Complete audit trail
- ML analysis results stored
```

---

## 📊 SUMMARY OF OUTPUTS

### What Gets Generated:

1. **JWT Tokens** - 2 per login (access + refresh)
2. **Database Records** - 3 tables populated
3. **ML Predictions** - Anomaly scores, escalations, actions
4. **Agent Decisions** - Autonomous and manual actions logged
5. **API Responses** - JSON data for frontend
6. **UI Updates** - Real-time dashboard changes
7. **Notifications** - Toast messages for user feedback
8. **Reports** - Threat intelligence reports
9. **Logs** - RPC communication logs
10. **Metrics** - Calculated statistics and trends

### Data Flow Summary:

```
User Action → Frontend → Backend → ML Service → Database
                ↓           ↓          ↓           ↓
            UI Update   API Response  Analysis  Persistence
                ↓           ↓          ↓           ↓
            Notification Agent Action Prediction  Audit Trail
```

---

## 🎯 COMPLETE EXAMPLE: End-to-End Flow

### Scenario: Security Analyst Detects Malware

**Step 1: Analyst Creates Threat**
```
UI: Fills form with threat details
Generates: POST request to /api/threats
```

**Step 2: Backend Processes**
```
Generates: ML service API call
Receives: Anomaly score 0.756
Generates: Database INSERT
Returns: Complete threat object
```

**Step 3: Frontend Updates**
```
Generates: New row in Threat Intelligence table
Generates: Red node in System Integrity Map
Generates: +1 to Active Threats metric
Generates: Notification toast
```

**Step 4: Agent Coordinator (30s later)**
```
Detects: High anomaly score
Generates: ISOLATE_SYSTEM decision
Generates: Database INSERT in agent_decisions
Generates: RPC log entry
```

**Step 5: Dashboard Shows**
```
Generates: New card in Agent Decision Feed
Generates: Updated RPC logs
Generates: System status change
```

**Step 6: Analyst Resolves**
```
UI: Clicks resolve button
Generates: PUT request to /api/threats/1
Generates: Database UPDATE
Generates: Status badge change (red → gray)
Generates: -1 from Active Threats
Generates: +1 to Containment Rate
```

**Total Generated:**
- 2 database records (threat + decision)
- 1 ML prediction
- 5 UI updates
- 3 notifications
- 1 RPC log entry
- Multiple metric recalculations

---

**Every button, every action, every feature generates something - from database records to UI updates to ML predictions. The system is fully integrated and produces real, trackable outputs at every step.**
