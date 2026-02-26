# Auto-Resolve Feature

## Overview
S.H.I.E.L.D now automatically resolves contained threats after a verification period.

## How It Works

### Automatic Resolution
**RESOLVER Agent** runs every 30 seconds and:
- Checks all CONTAINED threats
- Verifies they've been contained for 5+ minutes
- Automatically marks them as RESOLVED
- Sets the resolvedAt timestamp

### Manual Resolution
Users can also manually resolve threats:
- Go to **Threat Intelligence** page
- Click the **✓** (checkmark) button
- Threat immediately marked as RESOLVED

## Status Flow

```
DETECTED → ACTIVE → CONTAINED → RESOLVED
   ↓         ↓          ↓           ↓
Created   Agents    Remediation   Verified
          respond    applied       safe
```

## Timeline

| Status | Time | Action |
|--------|------|--------|
| DETECTED | 0s | Threat created |
| ACTIVE | 30s | Agents start processing |
| CONTAINED | 30s-60s | Remediation applied |
| RESOLVED | +5 min | Auto-resolved or manual |

## Agent Actions

**RESOLVER Agent:**
- Monitors CONTAINED threats
- Waits 5 minutes for verification
- Auto-resolves if no re-occurrence
- Logs resolution in agent decisions

## API Endpoints

**Manual Resolve:**
```bash
PUT /api/threats/{id}
{
  "status": "RESOLVED"
}
```

**Check Resolved Threats:**
```bash
GET /api/threats/status/RESOLVED
```

## Benefits

✅ **Automatic cleanup** - No manual intervention needed
✅ **Verification period** - Ensures threat is truly neutralized
✅ **Audit trail** - All resolutions logged
✅ **Manual override** - Users can resolve immediately if needed
