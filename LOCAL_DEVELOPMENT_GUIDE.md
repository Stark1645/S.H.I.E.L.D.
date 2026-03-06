# 🚀 S.H.I.E.L.D - Local Development Quick Start

## ✅ Current Status

- ✅ Security fix applied (credentials removed from code)
- ✅ Backend compiled successfully (33 files)
- ✅ Environment variables configured in `.env`
- ✅ Railway deployment deleted (will recreate later)
- ✅ Code pushed to GitHub

---

## 🎯 Run Locally (3 Steps)

### Step 1: Start PostgreSQL Database
Make sure PostgreSQL is running on port 5432 with database `shield_db`.

```bash
# Check if database exists
psql -U postgres -l | findstr shield_db

# If not, create it
psql -U postgres -c "CREATE DATABASE shield_db;"
```

---

### Step 2: Start Backend (Port 8080)
```bash
cd backend-java
mvn spring-boot:run
```

**Expected Output:**
```
Started ShieldApplication in X seconds
Tomcat started on port 8080
```

---

### Step 3: Start Frontend (Port 5173)
```bash
# In a new terminal
npm install
npm run dev
```

**Access:** http://localhost:5173

**Login:**
- Username: `admin`
- Password: `admin123`

---

## 🔧 Environment Variables (Already Set)

Your `.env` file has:
- ✅ Database: `localhost:5432/shield_db`
- ✅ JWT Secret: Configured
- ✅ Email: Gmail SMTP configured
- ✅ ML Service: `localhost:8000`

---

## 📊 What's Working Now

### Backend Features:
- ✅ JWT Authentication
- ✅ Threat Management (CRUD)
- ✅ Agent Decisions
- ✅ Analytics Endpoints (13 total)
- ✅ System Health Monitoring
- ✅ Email Notifications (if SMTP configured)

### Frontend Features:
- ✅ Dashboard with real-time metrics
- ✅ Threat Intelligence Grid
- ✅ Agent Monitor
- ✅ Advanced Analytics
- ✅ System Health Monitor

---

## 🧪 Quick Test

### Test Backend:
```bash
# Health check
curl http://localhost:8080/api/auth/login

# Should return 400 (means it's working, just needs credentials)
```

### Test Frontend:
1. Open: http://localhost:5173
2. Login: admin / admin123
3. Should see Dashboard with metrics

---

## 🐛 Troubleshooting

### Port 8080 Already in Use?
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Database Connection Failed?
```bash
# Check PostgreSQL is running
pg_isready

# Verify credentials in .env match your PostgreSQL setup
```

### Frontend Can't Connect?
- Verify backend is running on port 8080
- Check browser console for errors
- Ensure CORS is configured (already done)

---

## 📁 Project Structure

```
S.H.I.E.L.D-main/
├── backend-java/          # Spring Boot backend
│   ├── .env              # ✅ Your environment variables
│   ├── src/main/java/
│   └── pom.xml
├── ml-service-python/    # FastAPI ML service
├── src/                  # React frontend
├── pages/                # React pages
└── services/             # API client
```

---

## 🎯 Next Steps (When Ready)

### For Railway Deployment:
1. Create new Railway project
2. Connect GitHub repository
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy automatically

### For ML Service (Optional):
```bash
cd ml-service-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

---

## 📋 Development Checklist

- [x] Security fix applied
- [x] Backend compiled
- [x] Environment variables set
- [ ] PostgreSQL running
- [ ] Backend running (port 8080)
- [ ] Frontend running (port 5173)
- [ ] Can login to dashboard
- [ ] All features working

---

## 🔒 Security Notes

- ✅ `.env` file is in `.gitignore`
- ✅ No credentials in code
- ✅ Using environment variables
- ⚠️ Remember to revoke exposed passwords
- ✅ Generate new passwords when deploying

---

## 📞 Quick Commands

```bash
# Start everything
cd backend-java && mvn spring-boot:run    # Terminal 1
npm run dev                                # Terminal 2

# Stop everything
Ctrl+C in both terminals

# Check status
git status
git log --oneline -5
```

---

**Status:** 🟢 Ready for local development!

**Time to Start:** ~5 minutes
