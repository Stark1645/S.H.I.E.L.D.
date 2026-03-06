# 🚂 Railway Environment Variables Setup

## ✅ Security Fix Pushed to GitHub!

Your code is now secure. The exposed credentials have been removed.

---

## 🔧 Railway Configuration (Do This Now)

### Step 1: Go to Railway Dashboard
```
https://railway.app/dashboard
```

### Step 2: Select Your Project
Click on: **S.H.I.E.L.D** or **shield-production-f155**

### Step 3: Add Environment Variables

Click **Variables** tab, then add these **ONE BY ONE**:

#### Database Variables
```
DB_URL=<your-railway-postgres-url>
DB_USERNAME=<your-railway-postgres-user>
DB_PASSWORD=<your-railway-postgres-password>
```
*Note: Railway auto-provides these if you added PostgreSQL plugin*

#### JWT Secret
```
JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
```

#### ML Service
```
ML_SERVICE_URL=http://localhost:8000
```
*Or your ML service URL if deployed separately*

#### Email Configuration (IMPORTANT)
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=jarvis16451@gmail.com
MAIL_PASSWORD=<GENERATE-NEW-PASSWORD-DONT-USE-EXPOSED-ONE>
```

#### Notification Settings
```
NOTIFICATION_ENABLED=true
NOTIFICATION_TO=727824tuit157@skct.edu.in,727824tuit153@skct.edu.in,727824tuit154@skct.edu.in
NOTIFICATION_FROM=jarvis16451@gmail.com
```

---

## ⚠️ CRITICAL: Generate New Gmail App Password

**DO NOT use the password you shared in chat!**

### Generate New Password:
1. Go to: https://myaccount.google.com/apppasswords
2. Click **"Select app"** → Choose **"Mail"**
3. Click **"Select device"** → Choose **"Other"** → Type **"Railway S.H.I.E.L.D"**
4. Click **"Generate"**
5. Copy the 16-character password
6. Add it to Railway as `MAIL_PASSWORD`

---

## 🚀 Deploy

After adding all variables:
1. Railway will **auto-deploy** (watch the logs)
2. Wait 2-3 minutes for deployment
3. Your backend will be live at: `https://shield-production-f155.up.railway.app`

---

## ✅ Verification

### Test Backend is Running:
```bash
curl https://shield-production-f155.up.railway.app/api/auth/login
```

Should return: `{"timestamp":"...","status":400,...}` (means it's working)

### Test with Frontend:
Open your frontend and try to login with:
- Username: `admin`
- Password: `admin123`

---

## 📋 Quick Checklist

- [x] Pushed security fix to GitHub
- [ ] Generated NEW Gmail app password
- [ ] Added all environment variables to Railway
- [ ] Railway deployment completed
- [ ] Tested backend endpoint
- [ ] Tested frontend login

---

## 🔒 Security Best Practices

✅ **DO:**
- Use environment variables
- Generate unique app passwords
- Revoke exposed passwords immediately
- Keep `.env` in `.gitignore`

❌ **DON'T:**
- Share passwords in chat/email
- Commit `.env` files
- Reuse exposed passwords
- Hardcode credentials

---

## 🆘 Troubleshooting

### Railway Deployment Failed?
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure PostgreSQL plugin is added

### Email Not Working?
- Verify Gmail app password is correct
- Check "Less secure app access" is OFF (use app passwords instead)
- Verify SMTP settings in Railway variables

### CORS Errors?
- Your code already has CORS fixes
- Railway will use the updated code after deployment

---

## 📞 Next Steps

1. **Generate new Gmail app password** (5 min)
2. **Add to Railway variables** (3 min)
3. **Wait for deployment** (2 min)
4. **Test the application** (5 min)

**Total Time: ~15 minutes**

---

**Status:** 🟢 Code is secure, ready for Railway deployment!
