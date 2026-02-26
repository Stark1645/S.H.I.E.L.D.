# S.H.I.E.L.D - Complete User Guide

## 🚀 Getting Started

### 1. Start the System
```bash
start-shield-complete.bat
```
**What happens:** Starts ML Service, Backend, and Frontend automatically.

### 2. Login
- Open: http://localhost:5173
- Username: `admin`
- Password: `admin123`
- Click **Login**

**What happens:** JWT token generated, redirected to Dashboard.

---

## 📊 Dashboard Page

### What You See
- **4 Metric Cards** (Total Events, Active Threats, Avg Severity, Containment Rate)
- **50-Node System Map** (interactive grid)
- **Threat Vectors Pie Chart** (DDoS, SQLi, Phishing, Malware)
- **Escalation Probability Graph** (24h trend)
- **Agent Decision Feed** (last 5 decisions)

### What You Can Do

**Click Metric Card:**
- Shows notification with metric details
- No data changes

**Click Node in System Map:**
- Opens modal with node details
- Shows status, traffic load, packet trace
- **ISOLATE NODE button:** Marks node as critical (red)
- **RESTORE NODE button:** Marks node as healthy (green)

**Click Agent Decision:**
- Opens modal with full decision details
- Shows confidence score, timestamp, reasoning
- Read-only view

**Auto-Refresh:** Every 10 seconds

---

## 🛡️ Threat Intelligence Page

### What You See
- **Search Bar** (filter by ID, IP, type, system)
- **Generate Report Button**
- **Threat Table** (all threats with details)

### What You Can Do

**Search Threats:**
- Type in search bar
- Filters table in real-time
- Searches: ID, Source IP, Threat Type, Target System

**Generate Report:**
- Click **Generate Report** button
- Shows "Compiling report..." notification
- After 2s: "Report saved to Secure Vault"
- No actual file created (demo feature)

**Click Threat ID:**
- Shows notification: "Opening detailed log for [ID]"
- No modal opens

**Click Shield Icon (🛡️):**
- Marks threat as **CONTAINED**
- Updates status immediately
- Shows success notification
- Threat status changes in table

**Click Checkmark Icon (✓):**
- Marks threat as **RESOLVED**
- Updates status immediately
- Shows success notification
- Threat status changes in table

**Click Crosshairs Icon (🎯):**
- Opens **IP Trace Modal**
- Shows geolocation, ISP, reputation
- Click X or outside to close

**Click Magnifying Glass Icon (🔍):**
- Opens **Forensic Evidence Modal**
- Shows all threat details
- Click X or outside to close

**Auto-Refresh:** Every 15 seconds

---

## 🤖 Agent Monitor Page

### What You See
- **6 Agent Cards** (status, load, uptime, description)
- **Recent Agent Decisions Log** (live feed)

### What You Can Do

**Click Agent Card:**
- Opens **Agent Details Modal**
- Shows description, load, uptime, recent activity
- Click X or outside to close

**Click REBOOT Button:**
- Shows "REBOOT sequence initiated" notification
- Agent card shows "PROCESSING" for 2.5s
- Then shows "Agent rebooted and synchronized"
- No actual reboot happens

**Click RECONFIGURE Button:**
- Shows "RECONFIGURE sequence initiated" notification
- Agent card shows "PROCESSING" for 2.5s
- Then shows "Agent reconfigured and synchronized"
- No actual reconfiguration happens

**Click Decision in Log:**
- Shows notification with decision summary
- No modal opens

**Auto-Refresh:** Every 10 seconds

---

## 📈 Advanced Analytics Page

### What You See
- **AI Threat Prediction Card** (next threat, probability, severity)
- **Attack Pattern Detection** (coordinated attacks)
- **Threat Frequency Radar Chart**
- **Global Threat Distribution** (by country)
- **Attack Chain Analysis** (velocity, multi-stage)
- **Recent Threat Timeline**

### What You Can Do

**Click Refresh Button:**
- Manually refreshes all analytics
- Shows "Analytics refreshed" notification
- Fetches latest data from backend

**Click Country Card:**
- Shows notification: "[Country]: [X] threats detected"
- No modal opens

**Click Timeline Item:**
- Shows notification with threat details
- No modal opens

**Auto-Refresh:** Every 15 seconds

---

## 💓 System Health Page

### What You See
- **4 Metric Cards** (CPU Load, Memory Usage, Uptime, Threads)
- **Memory Allocation Details** (used, free, total, max)
- **Memory Usage Bar** (visual percentage)
- **CPU & Memory Trends Chart**
- **Response Time Chart**
- **System Information** (cores, uptime, last check)

### What You Can Do

**Click Refresh Button:**
- Manually refreshes health metrics
- Shows "Health metrics refreshed" notification
- Fetches latest data from backend

**View Charts:**
- Hover over chart points to see values
- Charts update automatically
- Read-only visualization

**Auto-Refresh:** Every 5 seconds

---

## 🎯 Common Actions

### Create a Threat (Manual)
```bash
# Use threat injection script
create-threats.bat
# OR
inject-threats.bat
```
**What happens:**
1. Threat created with status: DETECTED
2. Appears in Dashboard, Threat Intelligence, and Threat Remediation
3. Within 30s: Agents respond, status → ACTIVE
4. Within 60s: High-risk threats → CONTAINED
5. After 5 min: Auto-resolved → RESOLVED

### View Threat Remediation (Real-Time)
1. Go to **Threat Remediation** page
2. See all DETECTED, ACTIVE, and CONTAINED threats
3. Watch progress bars as agents work
4. See 5-step remediation process
5. Threats disappear when RESOLVED

### Contain a Threat (Manual)
1. Go to **Threat Intelligence**
2. Find threat in table
3. Click **Shield Icon (🛡️)**
4. Status changes to CONTAINED
5. Shows success notification

### Resolve a Threat (Manual)
1. Go to **Threat Intelligence**
2. Find threat in table
3. Click **Checkmark Icon (✓)**
4. Status changes to RESOLVED
5. Shows success notification
6. `resolvedAt` timestamp set

### View Threat Details
1. Go to **Threat Intelligence**
2. Click **Magnifying Glass Icon (🔍)** on any threat
3. Modal opens with:
   - Source IP
   - Target System
   - Threat Type
   - Intent Classification
   - Severity Score
   - Status
4. Click X or outside to close

### View Agent Decision Details
1. Go to **Dashboard** or **Agent Monitor**
2. Click any decision in the feed
3. Modal opens with:
   - Agent Name
   - Decision Summary
   - Confidence Score
   - Timestamp
4. Click X or outside to close

---

## 🔄 Automatic Behaviors

### Threat Lifecycle (No User Action Needed)
```
DETECTED (0s)
    ↓ Agent Coordinator runs every 30s
ACTIVE (30s)
    ↓ Agents evaluate and respond
CONTAINED (60s)
    ↓ RESOLVER agent checks every 30s
RESOLVED (5 min)
```

### Agent Responses (Automatic)

**High Risk Threats (severity > 7):**
- SENTINEL-ALPHA: Isolates system
- DEFENDER-PRIME: Blocks IP
- Status → CONTAINED

**Medium Risk Threats (severity 4-7):**
- RISK-EVALUATOR: Increases surveillance
- ANALYZER-BETA: Deep inspection
- Status → ACTIVE

**Low Risk Threats (severity < 4):**
- WATCHER: Logs activity
- Status → ACTIVE

**Attack Campaign Detected:**
- ORCHESTRATOR: Deploys honeypots
- Additional decision logged

**After 5 Minutes (CONTAINED threats):**
- RESOLVER: Auto-resolves
- Status → RESOLVED
- `resolvedAt` timestamp set

### Real-Time Updates (Automatic)
- Dashboard metrics update every 10s
- Threat table updates every 15s
- Agent decisions update every 10s
- Analytics update every 15s
- System health updates every 5s

---

## 🎨 UI Elements Explained

### Status Colors
- **🔴 Red (DETECTED):** New threat, not yet handled
- **🟡 Yellow (ACTIVE):** Agents are responding
- **🟢 Green (CONTAINED):** Threat stopped and isolated
- **⚪ Gray (RESOLVED):** Fully cleaned up and verified

### Node Colors (System Map)
- **Green:** Healthy node
- **Yellow:** Warning state
- **Red (pulsing):** Critical state

### Severity Indicators
- **Red (9-10):** Critical severity
- **Orange (7-8):** High severity
- **Yellow (4-6):** Medium severity
- **Green (1-3):** Low severity

---

## 📱 Navigation

### Top Menu
- **Dashboard:** Overview and metrics
- **Threat Intelligence:** All threats table
- **Threat Remediation:** Live remediation progress
- **Agent Monitor:** Agent status and decisions
- **Advanced Analytics:** AI predictions and patterns
- **System Health:** Performance monitoring

### User Menu (Top Right)
- **Dark Mode Toggle:** Switch between light/dark theme
- **Logout:** End session and return to login

---

## ⚡ Quick Tips

1. **Watch the Dashboard** - See threats appear and agents respond in real-time
2. **Use Search** - Filter threats quickly in Threat Intelligence
3. **Check Analytics** - See AI predictions for next threats
4. **Monitor Health** - Ensure system performance is good
5. **Let Agents Work** - Most threats are handled automatically
6. **Manual Override** - Use contain/resolve buttons when needed

---

## 🆘 Troubleshooting

**No data showing:**
- Wait 10-15 seconds for auto-refresh
- Click Refresh button manually
- Check backend is running (http://localhost:8080)

**Agents not responding:**
- Wait 30 seconds (agent cycle time)
- Check backend logs for errors
- Verify threats have severity > 4

**Can't login:**
- Verify credentials: admin/admin123
- Check backend is running
- Clear browser cache

**Charts not loading:**
- Wait for data to populate
- Refresh the page
- Check browser console for errors

---

## 📊 What Each Feature Does

### Dashboard
**Purpose:** Real-time overview of system status  
**Updates:** Every 10 seconds  
**Key Info:** Metrics (Total, Active, Severity, Containment), system map, agent activity  
**Active Threats:** Shows DETECTED + ACTIVE + CONTAINED threats

### Threat Intelligence
**Purpose:** Manage and investigate threats  
**Updates:** Every 15 seconds  
**Key Actions:** Search, contain, resolve, view details

### Threat Remediation
**Purpose:** Watch live remediation progress  
**Updates:** Every 3 seconds  
**Shows:** DETECTED, ACTIVE, and CONTAINED threats with progress bars  
**Key Info:** 5-step remediation process, agent assignments, completion status

### Agent Monitor
**Purpose:** Monitor autonomous agent activity  
**Updates:** Every 10 seconds  
**Key Info:** Agent status, decisions, health

### Advanced Analytics
**Purpose:** AI-powered threat analysis  
**Updates:** Every 15 seconds  
**Key Info:** Predictions, patterns, geolocation

### System Health
**Purpose:** Monitor system performance  
**Updates:** Every 5 seconds  
**Key Info:** CPU, memory, response time

---

**Version:** 2.0 FINAL  
**Status:** Production Ready
