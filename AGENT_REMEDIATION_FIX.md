# Agent Remediation Fix

## Problem
Threats were being **DETECTED** but agents weren't taking automatic remediation actions.

## Root Cause
The `AgentCoordinator` was only processing threats with status "ACTIVE", but new threats are created with status "DETECTED". This meant agents never saw the threats.

## Solution Applied

### 1. AgentCoordinator.java
- Now processes threats with **both** "DETECTED" and "ACTIVE" status
- Agents respond within 30 seconds of threat detection

### 2. AgentService.java
- Automatically transitions threat status: **DETECTED → ACTIVE → CONTAINED**
- When agents start processing: DETECTED → ACTIVE
- When remediation applied: ACTIVE → CONTAINED

## Threat Status Flow

```
NEW THREAT
    ↓
DETECTED (created)
    ↓
ACTIVE (agents processing) ← 30 seconds
    ↓
CONTAINED (remediation applied)
    ↓
RESOLVED (manual/auto after verification)
```

## Agent Actions by Risk Level

**High Risk (score > threshold):**
- SENTINEL-ALPHA → Isolates system → Status: CONTAINED
- DEFENDER-PRIME → Blocks IP → Status: CONTAINED

**Medium Risk:**
- RISK-EVALUATOR → Increases surveillance
- ANALYZER-BETA → Deep inspection

**Low Risk:**
- WATCHER → Logs activity

## Testing

1. Create a new threat (POST /api/threats)
2. Wait 30 seconds
3. Check agent decisions (GET /api/agents/decisions)
4. Verify threat status changed to CONTAINED

## Expected Behavior

- Threat detected → Status: DETECTED
- Within 30s → Agents respond → Status: ACTIVE
- High-risk threats → Auto-contained → Status: CONTAINED
- You'll see agent decisions in the feed with actions taken
