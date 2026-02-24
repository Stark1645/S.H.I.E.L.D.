# 🚀 QUICK START - Get Running in 5 Minutes!

## ⚡ Prerequisites Check

Before starting, make sure you have:
- [ ] Java 17 installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] Node.js 18+ installed (`node -version`)
- [ ] PostgreSQL running

---

## 🗄️ Step 1: Database Setup (2 minutes)

### Option A: Using psql command line
```bash
psql -U postgres
```
```sql
CREATE DATABASE shield_db;
\q
```

### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `shield_db`
4. Click Save

### Verify Connection
Default credentials in `backend-java/src/main/resources/application.properties`:
```
Username: postgres
Password: postgres
Database: shield_db
Port: 5432
```

**If your PostgreSQL uses different credentials, update `application.properties`!**

---

## 🔧 Step 2: Start Backend (1 minute)

Open Terminal 1:
```bash
cd backend-java
mvn spring-boot:run
```

Wait for:
```
Started ShieldApplication in X seconds
```

Backend is now running on **http://localhost:8080**

---

## 🎨 Step 3: Start Frontend (1 minute)

Open Terminal 2:
```bash
npm install
npm run dev
```

Frontend is now running on **http://localhost:5173**

---

## 🔐 Step 4: Login (30 seconds)

1. Open browser: http://localhost:5173
2. Login with:
   - Username: `admin`
   - Password: `admin123`

---

## ✅ Step 5: Verify Everything Works

### Dashboard
- Should show real statistics
- Agent decision feed should have 3 entries
- Auto-refreshes every 10 seconds

### Threat Intelligence
- Should show 4 sample threats
- Can filter and search
- Auto-refreshes every 15 seconds

### Agent Monitor
- Shows 6 agents
- Can execute actions
- RPC logs visible

---

## 🎯 You're Done!

Your S.H.I.E.L.D system is fully operational!

---

## 🔍 Troubleshooting

### Backend won't start?
```bash
# Check if PostgreSQL is running
# Windows: services.msc → look for postgresql
# Mac: brew services list
# Linux: systemctl status postgresql

# Verify database exists
psql -U postgres -c "\l" | grep shield_db
```

### Frontend can't connect?
```bash
# Check if backend is running
curl http://localhost:8080/api/threats

# Should return 401 (Unauthorized) - this is correct!
# It means backend is running but needs authentication
```

### Can't login?
```bash
# Check backend logs for errors
# Verify database has data:
psql -U postgres -d shield_db -c "SELECT * FROM users;"

# Should show admin user
```

---

## 📊 What You Get Out of the Box

### Sample Data Created Automatically:
- ✅ 1 Admin user (admin/admin123)
- ✅ 4 Sample threats
- ✅ 3 Agent decisions

### Working Features:
- ✅ JWT Authentication
- ✅ Real-time Dashboard
- ✅ Threat Intelligence
- ✅ Agent Monitor
- ✅ Auto-refresh
- ✅ Error handling

---

## 🧪 Quick Test

### Test 1: API is working
```bash
# Get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Copy the accessToken from response
```

### Test 2: Get threats
```bash
curl http://localhost:8080/api/threats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return array of threats
```

### Test 3: Get stats
```bash
curl http://localhost:8080/api/threats/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return: {"total":4,"active":1,"severity":8.5,"containment":75.0}
```

---

## 🎮 Try These Features

1. **Dashboard**
   - Click on any node in the system map
   - Watch the auto-refresh in action
   - Click on metric cards for notifications

2. **Threat Intelligence**
   - Use the search bar to filter threats
   - Click "Generate Report" button
   - Click on threat IDs for details

3. **Agent Monitor**
   - Click "REBOOT" on any agent
   - Watch the processing animation
   - Click on RPC log entries

---

## 📱 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | admin/admin123 |
| Backend API | http://localhost:8080/api | JWT Token |
| Swagger UI | http://localhost:8080/swagger-ui.html | - |
| Database | localhost:5432/shield_db | postgres/postgres |

---

## 🔄 Restart Everything

If something goes wrong:

1. **Stop all services** (Ctrl+C in terminals)
2. **Restart PostgreSQL**
3. **Start backend** (`mvn spring-boot:run`)
4. **Start frontend** (`npm run dev`)
5. **Clear browser cache** (Ctrl+Shift+Delete)
6. **Try login again**

---

## 📚 Next Steps

1. ✅ Read `COMPLETE_SETUP_GUIDE.md` for detailed info
2. ✅ Check `API_REFERENCE.md` for API docs
3. ✅ Review `IMPLEMENTATION_COMPLETE.md` for architecture
4. ✅ Explore Swagger UI for interactive API testing

---

## 🎉 Success!

If you can:
- [x] Login to the system
- [x] See data on Dashboard
- [x] View threats in Threat Intelligence
- [x] See agents in Agent Monitor

**Then everything is working perfectly! 🛡️**

---

## 💡 Pro Tips

1. **Keep terminals open** - You need both backend and frontend running
2. **Check browser console** - Press F12 to see any errors
3. **Use Swagger UI** - Great for testing APIs directly
4. **Auto-refresh works** - Data updates automatically
5. **Fallback data** - If backend is down, UI shows mock data

---

## 🆘 Still Having Issues?

1. Check all prerequisites are installed
2. Verify PostgreSQL is running
3. Ensure ports 8080 and 5173 are available
4. Check firewall settings
5. Review backend logs for errors
6. Clear browser cache and localStorage

---

## 🚀 You're All Set!

**Welcome to S.H.I.E.L.D - Your Autonomous Cybersecurity War Room!**

Start exploring and defending against threats! 🛡️
