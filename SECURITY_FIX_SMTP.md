# 🚨 SECURITY FIX - SMTP Credentials Leak

## ⚠️ CRITICAL: Exposed Credentials

**What was exposed:**
- Email: jarvis16451@gmail.com
- App Password: hmmuahvzgohgxqmi
- Recipient emails: 727824tuit157@skct.edu.in, 727824tuit153@skct.edu.in, 727824tuit154@skct.edu.in

---

## ✅ Immediate Actions Taken

### 1. Removed Credentials from Code
- ✅ Updated `application.properties` to use environment variables
- ✅ Created `.env.example` template
- ✅ Verified `.gitignore` includes `.env`

### 2. Files Fixed
- ✅ `backend-java/src/main/resources/application.properties`

---

## 🔥 URGENT: Manual Steps Required

### Step 1: Revoke Exposed Gmail App Password
```
1. Go to: https://myaccount.google.com/apppasswords
2. Find the app password: hmmuahvzgohgxqmi
3. Click "Revoke" or "Delete"
4. Generate a NEW app password
```

### Step 2: Remove from Git History
```bash
# Install BFG Repo Cleaner (faster than git filter-branch)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Or use git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend-java/src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remove from GitHub
git push origin --force --all
```

### Step 3: Create Local .env File
```bash
cd backend-java
cat > .env << EOF
MAIL_USERNAME=jarvis16451@gmail.com
MAIL_PASSWORD=YOUR_NEW_APP_PASSWORD_HERE
NOTIFICATION_TO=727824tuit157@skct.edu.in,727824tuit153@skct.edu.in,727824tuit154@skct.edu.in
NOTIFICATION_FROM=jarvis16451@gmail.com
EOF
```

### Step 4: Update Railway Environment Variables
```
Go to Railway Dashboard:
1. Select your project
2. Go to Variables tab
3. Add:
   - MAIL_USERNAME=jarvis16451@gmail.com
   - MAIL_PASSWORD=<new-app-password>
   - NOTIFICATION_TO=727824tuit157@skct.edu.in,727824tuit153@skct.edu.in,727824tuit154@skct.edu.in
   - NOTIFICATION_FROM=jarvis16451@gmail.com
```

---

## 🔒 Prevention Measures

### 1. Use Environment Variables
```properties
# ✅ GOOD - Uses environment variables
spring.mail.username=${MAIL_USERNAME:default@example.com}
spring.mail.password=${MAIL_PASSWORD:default-password}

# ❌ BAD - Hardcoded credentials
spring.mail.username=jarvis16451@gmail.com
spring.mail.password=hmmuahvzgohgxqmi
```

### 2. Pre-commit Hook (Optional)
Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
if git diff --cached | grep -E "password|secret|key" | grep -v "PASSWORD"; then
    echo "⚠️  WARNING: Possible secret detected!"
    echo "Please review your changes before committing."
    exit 1
fi
```

### 3. Use GitGuardian CLI
```bash
# Install
pip install ggshield

# Scan before commit
ggshield secret scan pre-commit
```

---

## 📋 Verification Checklist

- [ ] Revoked old Gmail app password
- [ ] Generated new Gmail app password
- [ ] Updated local .env file
- [ ] Updated Railway environment variables
- [ ] Removed credentials from Git history
- [ ] Force pushed to GitHub
- [ ] Verified GitGuardian alert is resolved
- [ ] Tested email functionality with new credentials

---

## 🚀 Quick Fix Commands

```bash
# 1. Commit the fix
git add .
git commit -m "🔒 Security: Remove exposed SMTP credentials, use env vars"

# 2. Remove from history (CAREFUL - rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend-java/src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push
git push origin --force --all

# 4. Notify collaborators
echo "⚠️  Git history rewritten. Team members need to: git pull --rebase"
```

---

## 📞 Support

If you need help:
1. Gmail App Passwords: https://support.google.com/accounts/answer/185833
2. GitGuardian Docs: https://docs.gitguardian.com
3. Railway Env Vars: https://docs.railway.app/develop/variables

---

## ⏰ Timeline

- **Exposed:** March 6, 2026, 01:09:38 UTC
- **Detected:** GitGuardian alert received
- **Fixed:** Credentials removed from code
- **Action Required:** Revoke old password + update Git history

**Status:** 🟡 PARTIALLY FIXED - Manual steps required
