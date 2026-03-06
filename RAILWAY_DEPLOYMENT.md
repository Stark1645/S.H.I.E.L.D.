# 🚂 Railway Deployment Guide

## 🎯 Quick Deploy (15 Minutes)

### Step 1: Sign Up Railway
1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

### Step 2: Deploy PostgreSQL Database
1. Click "New Project"
2. Click "Provision PostgreSQL"
3. Database created! ✅
4. Note the connection details (Variables tab)

### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select your S.H.I.E.L.D repository
3. Railway will auto-detect and build

#### Add Environment Variables:
```
DB_URL=jdbc:postgresql://[RAILWAY_POSTGRES_HOST]/railway
DB_USERNAME=[RAILWAY_POSTGRES_USER]
DB_PASSWORD=[RAILWAY_POSTGRES_PASSWORD]
JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
GEMINI_API_KEY=your_gemini_api_key
```

4. Click "Settings" → "Generate Domain"
5. Your backend URL: `https://shield-backend.up.railway.app`

### Step 4: Deploy Frontend
1. Create new service from same repo
2. Set root directory to `/` (frontend)
3. Add build command: `npm run build`
4. Add start command: `npm run preview`

#### Add Environment Variable:
```
VITE_API_URL=https://shield-backend.up.railway.app/api
```

5. Click "Settings" → "Generate Domain"
6. Your frontend URL: `https://shield.up.railway.app`

### Step 5: Test
1. Open frontend URL
2. Login: admin / admin123
3. Everything works! ✅

---

## 🔧 Configuration Files

### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend-java && mvn clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "cd backend-java && java -jar target/*.jar"
  }
}
```

### Procfile
```
web: cd backend-java && java -Dserver.port=$PORT -jar target/*.jar
```

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["maven", "jdk17"]

[phases.build]
cmds = ["cd backend-java && mvn clean package -DskipTests"]

[phases.start]
cmd = "cd backend-java && java -Dserver.port=$PORT -jar target/*.jar"
```

---

## 📱 Share with Friends

After deployment, share:
```
Frontend: https://shield.up.railway.app
Login: admin / admin123

Works on:
✅ Mobile phones
✅ Laptops
✅ Tablets
✅ Any device with internet
```

---

## 🎯 Free Tier Limits

Railway Free Tier:
- ✅ $5 free credit per month
- ✅ Enough for demo/testing
- ✅ No credit card required initially
- ✅ Auto-sleep after inactivity (saves credits)

---

## 🐛 Troubleshooting

### Build Failed?
- Check Java version (should be 17)
- Check Maven build: `mvn clean package`
- Check logs in Railway dashboard

### Database Connection Failed?
- Verify environment variables
- Check DATABASE_URL format
- Ensure PostgreSQL service is running

### Frontend Can't Connect?
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is deployed first

---

## 🚀 Auto-Deploy

Railway auto-deploys on every git push:
```bash
git add .
git commit -m "Update"
git push

# Railway automatically:
# 1. Detects changes
# 2. Builds new version
# 3. Deploys
# 4. Zero downtime!
```

---

## 💡 Pro Tips

1. **Use Railway CLI** for faster deployment:
```bash
npm i -g @railway/cli
railway login
railway up
```

2. **Monitor Logs**:
- Click service → "Logs" tab
- Real-time logs
- Debug issues easily

3. **Custom Domain** (Optional):
- Settings → Domains
- Add your own domain
- Free SSL included

---

## ✅ Success Checklist

- [ ] Railway account created
- [ ] PostgreSQL database deployed
- [ ] Backend deployed with env vars
- [ ] Frontend deployed with API URL
- [ ] Can access frontend URL
- [ ] Can login successfully
- [ ] All features working

---

**🎉 Deployment Complete! Share URL with friends! 🌍**
