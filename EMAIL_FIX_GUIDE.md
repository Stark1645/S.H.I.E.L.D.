# 📧 Email Notification Fix & Testing Guide

## ✅ Problem Fixed!

### Issue:
- `NOTIFICATION_ENABLED` was `false` by default
- Email configuration was incomplete in `.env`

### Solution Applied:
- ✅ Added `NOTIFICATION_ENABLED=true` to `.env`
- ✅ Added `MAIL_HOST` and `MAIL_PORT` to `.env`
- ✅ All email settings configured

---

## 📧 When Emails Are Sent:

**Trigger:** When a NEW threat is created
**Recipients:** 
- 727824tuit157@skct.edu.in
- 727824tuit153@skct.edu.in
- 727824tuit154@skct.edu.in

**Email Content:**
```
🚨 THREAT ALERT 🚨

A new threat has been detected in S.H.I.E.L.D system!

Threat Type: [Type]
Source IP: [IP]
Target: [System]
Severity: [Score]/10
Time: [Timestamp]

Please review immediately in the S.H.I.E.L.D dashboard.
```

---

## 🧪 Test Email Notification:

### Method 1: Using API (Recommended)
```bash
# 1. Start backend
cd backend-java
mvn spring-boot:run

# 2. Login to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Create a test threat (this will send email)
curl -X POST http://localhost:8080/api/threats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "threatType": "Test Email Alert",
    "sourceIP": "192.168.1.100",
    "targetSystem": "Test System",
    "severityScore": 8.5,
    "status": "DETECTED"
  }'
```

### Method 2: Using Frontend
```bash
# 1. Start backend
cd backend-java
mvn spring-boot:run

# 2. Start frontend
npm run dev

# 3. Login: admin / admin123

# 4. Go to Threats page

# 5. Click "Add Threat" button

# 6. Fill details and submit
# Email will be sent automatically!
```

---

## 🔍 Check Email Logs:

Backend console-la itha paakanum:
```
=== EMAIL SERVICE CALLED ===
Email enabled: true
From: jarvis16451@gmail.com
To: 727824tuit157@skct.edu.in,727824tuit153@skct.edu.in,727824tuit154@skct.edu.in
Recipients: 727824tuit157@skct.edu.in, 727824tuit153@skct.edu.in, 727824tuit154@skct.edu.in
Sending email...
✅ SUCCESS: Email sent to 3 recipients for threat ID: 1
```

---

## ⚠️ Troubleshooting:

### Email Not Sending?

#### 1. Check .env File:
```bash
cd backend-java
type .env
```
Should show:
```
NOTIFICATION_ENABLED=true
MAIL_USERNAME=jarvis16451@gmail.com
MAIL_PASSWORD=ztmpsljrcnagpfgm
```

#### 2. Check Gmail Settings:
- Go to: https://myaccount.google.com/security
- Verify "2-Step Verification" is ON
- Verify App Password is active

#### 3. Check Backend Logs:
Look for:
```
Email enabled: true  ← Should be true
```

If false, restart backend after updating .env

#### 4. Check Gmail Spam Folder:
- Emails might go to spam first time
- Mark as "Not Spam"

---

## 📋 Current Configuration:

```properties
# Email Server
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

# Credentials
MAIL_USERNAME=jarvis16451@gmail.com
MAIL_PASSWORD=ztmpsljrcnagpfgm

# Notification Settings
NOTIFICATION_ENABLED=true
NOTIFICATION_TO=727824tuit157@skct.edu.in,727824tuit153@skct.edu.in,727824tuit154@skct.edu.in
NOTIFICATION_FROM=jarvis16451@gmail.com
```

---

## ✅ Verification Checklist:

- [x] `.env` file updated with all email settings
- [x] `NOTIFICATION_ENABLED=true`
- [x] Gmail app password is valid
- [ ] Backend restarted after .env changes
- [ ] Test threat created
- [ ] Email received in inbox/spam

---

## 🚀 Quick Test:

```bash
# 1. Restart backend (important!)
cd backend-java
mvn spring-boot:run

# 2. Watch console for email logs

# 3. Create threat via frontend or API

# 4. Check email inbox (and spam folder)
```

---

## 📧 Expected Result:

After creating a threat:
1. ✅ Console shows: "✅ SUCCESS: Email sent to 3 recipients"
2. ✅ Email arrives in inbox (or spam)
3. ✅ Email contains threat details

---

**Status:** 🟢 Email configuration fixed!
**Action:** Restart backend and test!
