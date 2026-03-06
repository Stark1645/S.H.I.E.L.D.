# ✅ Complete Phase 2, 3, 4 Testing Checklist

## 🚀 Before Testing

### 1. Restart Backend
```bash
cd backend-java
# Stop if running (Ctrl+C)
mvn spring-boot:run
```

**Wait for:** `Started ShieldApplication`

### 2. Check Services Running
- [ ] Backend: http://localhost:8080
- [ ] Frontend: http://localhost:5173
- [ ] Database: PostgreSQL on 5432
- [ ] ML Service: http://localhost:8000

---

## 📋 TEST 1: Features Status (30 seconds)

```bash
curl http://localhost:8080/api/advanced/features/status
```

**Expected Output:**
```json
{
  "phase2": {
    "websocket": "ENABLED",
    "threatSimulation": "ENABLED",
    "advancedML": "PLANNED"
  },
  "phase3": {
    "multiTenant": "ENABLED",
    "smsNotifications": "ENABLED",
    "customDashboards": "ENABLED",
    "mobileAPI": "ENABLED"
  },
  "phase4": {
    "kubernetes": "CONFIGURED",
    "distributedTracing": "ENABLED",
    "forensics": "ENABLED",
    "siemIntegration": "ENABLED"
  }
}
```

✅ **PASS if:** All phases show ENABLED/CONFIGURED  
❌ **FAIL if:** 403 Forbidden or connection refused

---

## 📋 TEST 2: Threat Simulation (1 minute)

### Test 2A: Single Threat
```bash
curl -X POST "http://localhost:8080/api/advanced/simulate/threat?type=Ransomware&severity=9.0"
```

**Expected Output:**
```json
{
  "id": 1,
  "threatType": "Ransomware",
  "sourceIP": "192.168.X.X",
  "targetSystem": "Web Application",
  "severityScore": 9.0,
  "status": "DETECTED",
  "anomalyScore": 0.85,
  "confidenceLevel": 0.92,
  "detectedAt": "2024-03-06T10:30:00"
}
```

✅ **PASS if:** Returns threat JSON with id, anomalyScore, confidenceLevel  
❌ **FAIL if:** Error or missing fields

### Test 2B: Attack Campaign
```bash
curl -X POST "http://localhost:8080/api/advanced/simulate/campaign?count=5"
```

**Expected Output:**
```json
[
  {"id": 2, "threatType": "DDoS Attack", ...},
  {"id": 3, "threatType": "DDoS Attack", ...},
  {"id": 4, "threatType": "DDoS Attack", ...},
  {"id": 5, "threatType": "DDoS Attack", ...},
  {"id": 6, "threatType": "DDoS Attack", ...}
]
```

✅ **PASS if:** Returns array of 5 threats with same sourceIP  
❌ **FAIL if:** Error or wrong count

---

## 📋 TEST 3: Forensic Analysis (1 minute)

```bash
curl http://localhost:8080/api/advanced/forensics/1
```

**Expected Output:**
```json
{
  "threatId": 1,
  "timeline": [
    {"timestamp": "...", "event": "Threat Detected", "details": "..."},
    {"timestamp": "...", "event": "Analysis Initiated", "details": "..."}
  ],
  "relatedThreats": [...],
  "attackVector": {
    "entryPoint": "Web Application",
    "method": "Ransomware",
    "sophistication": "HIGH",
    "persistence": "UNKNOWN"
  },
  "impactAssessment": {
    "severity": 9.0,
    "affectedSystems": ["Web Application"],
    "dataExfiltration": "NONE_DETECTED",
    "businessImpact": "CRITICAL"
  },
  "evidenceChain": [
    "Source IP: 192.168.X.X",
    "Target: Web Application",
    "Detection Time: ...",
    "Anomaly Score: 0.85",
    "Confidence: 0.92"
  ],
  "recommendations": [
    "Isolate affected system: Web Application",
    "Block source IP: 192.168.X.X",
    "Review access logs for the past 24 hours",
    "Update security signatures",
    "Conduct full system scan"
  ]
}
```

✅ **PASS if:** Contains all 6 sections (timeline, relatedThreats, attackVector, impactAssessment, evidenceChain, recommendations)  
❌ **FAIL if:** Missing sections or error

---

## 📋 TEST 4: Database Tables (1 minute)

```bash
psql -U postgres -d shield_db -c "\dt"
```

**Look for these NEW tables:**
- `tenants` ✅
- `custom_dashboards` ✅

**Check threat fields:**
```bash
psql -U postgres -d shield_db -c "\d threat_events"
```

**Look for NEW columns:**
- `anomaly_score` ✅
- `confidence_level` ✅
- `detected_at` ✅

✅ **PASS if:** All new tables and columns exist  
❌ **FAIL if:** Tables/columns missing

---

## 📋 TEST 5: Threat in Database (1 minute)

```bash
psql -U postgres -d shield_db -c "SELECT id, threat_type, severity_score, anomaly_score, confidence_level, detected_at FROM threat_events ORDER BY id DESC LIMIT 3;"
```

**Expected Output:**
```
 id | threat_type  | severity_score | anomaly_score | confidence_level |     detected_at
----+--------------+----------------+---------------+------------------+---------------------
  6 | DDoS Attack  |           9.0  |          0.85 |             0.92 | 2024-03-06 10:30:00
  5 | DDoS Attack  |           8.5  |          0.78 |             0.88 | 2024-03-06 10:29:55
  4 | DDoS Attack  |           7.2  |          0.72 |             0.85 | 2024-03-06 10:29:50
```

✅ **PASS if:** Threats have anomaly_score and confidence_level values  
❌ **FAIL if:** NULL values or columns missing

---

## 📋 TEST 6: Email Notifications (2 minutes)

### Check Email
1. Go to: https://mail.google.com
2. Login: 727824tuit157@skct.edu.in
3. Look for emails from: jarvis16451@gmail.com
4. Subject: "🚨 S.H.I.E.L.D Threat Alert"

✅ **PASS if:** Received emails for simulated threats  
❌ **FAIL if:** No emails received

---

## 📋 TEST 7: Frontend Integration (2 minutes)

### Test 7A: Dashboard
1. Open: http://localhost:5173
2. Login: admin / admin123
3. Check dashboard loads

✅ **PASS if:** Dashboard shows metrics  
❌ **FAIL if:** Errors or blank page

### Test 7B: Threat Intelligence
1. Go to "Threat Intelligence" page
2. Should see threats from simulation

✅ **PASS if:** Threats visible in table  
❌ **FAIL if:** Empty or errors

### Test 7C: JARVIS Chat
1. Click JARVIS icon (bottom right)
2. Ask: "What is a DDoS attack?"
3. Wait for response

✅ **PASS if:** JARVIS responds with answer  
❌ **FAIL if:** Error or no response

---

## 📋 TEST 8: WebSocket (Advanced - Optional)

### Test in Browser Console
1. Open dashboard: http://localhost:5173
2. Open browser console (F12)
3. Run simulation in terminal:
```bash
curl -X POST "http://localhost:8080/api/advanced/simulate/threat?type=Test&severity=7.0"
```
4. Watch dashboard - threat should appear WITHOUT refresh

✅ **PASS if:** Threat appears instantly  
❌ **FAIL if:** Need to refresh page

---

## 📋 TEST 9: Kubernetes Files (30 seconds)

```bash
ls k8s/
```

**Expected Files:**
- backend-deployment.yaml ✅
- postgres-deployment.yaml ✅
- jaeger-deployment.yaml ✅
- configmap-secrets.yaml ✅

✅ **PASS if:** All 4 files exist  
❌ **FAIL if:** Files missing

---

## 📋 TEST 10: Docker Compose (30 seconds)

```bash
cat docker-compose.yml
```

**Should contain services:**
- postgres ✅
- jaeger ✅
- ml-service ✅
- backend ✅
- frontend ✅

✅ **PASS if:** All 5 services defined  
❌ **FAIL if:** File missing or incomplete

---

## 📋 TEST 11: Documentation (30 seconds)

```bash
ls *.md
```

**Expected Files:**
- PHASE_2_3_4_GUIDE.md ✅
- PHASE_QUICK_START.md ✅
- ACTION_CHECKLIST.md ✅
- PRESENTATION_GUIDE.md ✅
- QUICK_REFERENCE_CARD.md ✅

✅ **PASS if:** All documentation files exist  
❌ **FAIL if:** Files missing

---

## 📋 TEST 12: Complete Flow Test (3 minutes)

### Full Integration Test
```bash
# 1. Create threat
curl -X POST "http://localhost:8080/api/advanced/simulate/threat?type=Ransomware&severity=9.0"

# 2. Get forensics (use ID from step 1)
curl http://localhost:8080/api/advanced/forensics/1

# 3. Check in database
psql -U postgres -d shield_db -c "SELECT * FROM threat_events WHERE id=1;"

# 4. Check email received

# 5. View in frontend dashboard
```

✅ **PASS if:** All steps work end-to-end  
❌ **FAIL if:** Any step fails

---

## 🎯 Final Score

### Count Your Passes:
- [ ] TEST 1: Features Status
- [ ] TEST 2A: Single Threat Simulation
- [ ] TEST 2B: Attack Campaign
- [ ] TEST 3: Forensic Analysis
- [ ] TEST 4: Database Tables
- [ ] TEST 5: Threat in Database
- [ ] TEST 6: Email Notifications
- [ ] TEST 7A: Dashboard
- [ ] TEST 7B: Threat Intelligence
- [ ] TEST 7C: JARVIS Chat
- [ ] TEST 8: WebSocket (Optional)
- [ ] TEST 9: Kubernetes Files
- [ ] TEST 10: Docker Compose
- [ ] TEST 11: Documentation
- [ ] TEST 12: Complete Flow

**Score: ___/15**

### Results:
- **15/15** = 🏆 Perfect! All phases working!
- **12-14/15** = ✅ Excellent! Minor issues only
- **9-11/15** = ⚠️ Good, but needs fixes
- **<9/15** = ❌ Major issues, debug needed

---

## 🆘 Common Issues & Fixes

### Issue: 403 Forbidden
**Fix:** Restart backend after SecurityConfig update

### Issue: Connection Refused
**Fix:** Check backend is running on port 8080

### Issue: No Email
**Fix:** Check application.properties has correct email settings

### Issue: JARVIS Not Responding
**Fix:** Check application-secrets.properties has Gemini API key

### Issue: Database Error
**Fix:** Check PostgreSQL is running: `pg_isready`

---

## ✅ Quick One-Liner Test

```bash
curl http://localhost:8080/api/advanced/features/status && echo "\n✅ Phase Status OK" && curl -X POST "http://localhost:8080/api/advanced/simulate/threat?type=Test&severity=7.0" && echo "\n✅ Simulation OK" && curl http://localhost:8080/api/advanced/forensics/1 && echo "\n✅ Forensics OK"
```

If all 3 return JSON = **Everything Working! 🎉**

---

**Dei, idha follow pannu. Ellam test pannidu! 🧪**
