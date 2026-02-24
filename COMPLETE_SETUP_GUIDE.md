# 🚀 S.H.I.E.L.D - Complete Setup Guide

## ✅ What's Been Implemented

### Backend (Spring Boot)
- ✅ JWT Authentication with proper security
- ✅ CORS configuration for frontend
- ✅ RESTful APIs for threats, agents, and auth
- ✅ PostgreSQL database integration
- ✅ Auto-initialization with sample data
- ✅ Stats endpoint for dashboard metrics

### Frontend (React + TypeScript)
- ✅ API service layer with TypeScript
- ✅ Dashboard connected to backend (real-time stats)
- ✅ Threat Intelligence connected to backend
- ✅ Agent Monitor with live data
- ✅ Login with JWT authentication
- ✅ Auto-refresh for live updates

### Integration
- ✅ End-to-end authentication flow
- ✅ Token management
- ✅ Error handling with fallback data
- ✅ Real-time data polling

---

## 📋 Prerequisites

1. **Java 17** - [Download](https://adoptium.net/)
2. **Maven** - [Download](https://maven.apache.org/download.cgi)
3. **Node.js 18+** - [Download](https://nodejs.org/)
4. **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)

---

## 🗄️ Database Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from the official website.

### 2. Create Database
```sql
-- Open PostgreSQL command line (psql) or pgAdmin
CREATE DATABASE shield_db;

-- Create user (optional, or use default postgres user)
CREATE USER shield_user WITH PASSWORD 'shield_pass';
GRANT ALL PRIVILEGES ON DATABASE shield_db TO shield_user;
```

### 3. Configure Connection
The backend is already configured in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shield_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Change these if you used different credentials!**

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend-java
```

### 2. Build the Project
```bash
mvn clean install
```

### 3. Run the Backend
```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 4. Verify Backend
- Swagger UI: http://localhost:8080/swagger-ui.html
- Health Check: http://localhost:8080/api/threats

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (or 3000)

---

## 🔐 Default Login Credentials

```
Username: admin
Password: admin123
```

These are automatically created when the backend starts for the first time.

---

## 🚀 Quick Start (All Services)

### Option 1: Use the Batch Script (Windows)
```bash
start-all-services.bat
```

### Option 2: Manual Start
Open 3 separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend-java
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - ML Service (Optional):**
```bash
cd ml-service-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

---

## 🧪 Testing the Integration

### 1. Login
- Go to http://localhost:5173
- Login with `admin` / `admin123`
- You should see the dashboard

### 2. Dashboard
- Should display real stats from backend
- Auto-refreshes every 10 seconds
- Shows agent decisions from database

### 3. Threat Intelligence
- Shows threats from database
- Auto-refreshes every 15 seconds
- Filter and search functionality

### 4. Agent Monitor
- Shows agent status
- Execute actions
- View RPC logs

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Threats
- `GET /api/threats` - Get all threats
- `GET /api/threats/stats` - Get dashboard stats
- `GET /api/threats/status/{status}` - Filter by status
- `POST /api/threats` - Create new threat

### Agents
- `GET /api/agents/decisions` - Get all decisions
- `POST /api/agents/execute` - Execute agent action

---

## 🔍 Troubleshooting

### Backend Won't Start
1. Check if PostgreSQL is running
2. Verify database credentials in `application.properties`
3. Check if port 8080 is available
4. Run `mvn clean install` again

### Frontend Can't Connect
1. Verify backend is running on port 8080
2. Check browser console for CORS errors
3. Clear browser cache and localStorage
4. Check `services/api.ts` has correct URL

### Database Connection Failed
```bash
# Check PostgreSQL status
# Windows:
services.msc (look for postgresql service)

# Verify connection:
psql -U postgres -d shield_db
```

### CORS Errors
The backend is configured to allow:
- http://localhost:3000
- http://localhost:5173
- http://localhost:3001

If using different port, update `application.properties`:
```properties
cors.allowed-origins=http://localhost:YOUR_PORT
```

---

## 🎯 Features Working

✅ **Authentication**
- JWT-based login
- Token storage
- Protected routes

✅ **Dashboard**
- Real-time stats from backend
- Agent decision feed
- System integrity map
- Threat distribution charts

✅ **Threat Intelligence**
- Live threat data
- Status filtering
- Search functionality
- Report generation

✅ **Agent Monitor**
- Agent status display
- Action execution
- RPC communication logs

✅ **Security**
- CORS protection
- JWT validation
- Password encryption
- Session management

---

## 📦 Sample Data

The system auto-creates:
- 1 admin user
- 4 sample threats
- 3 agent decisions

You can add more via:
1. Swagger UI: http://localhost:8080/swagger-ui.html
2. Frontend UI (create threat)
3. Direct API calls

---

## 🔄 Auto-Refresh Intervals

- Dashboard: 10 seconds
- Threat Intelligence: 15 seconds
- Agent Monitor: Manual refresh

---

## 🛠️ Development Tips

### Hot Reload
- Frontend: Automatic with Vite
- Backend: Use Spring DevTools or restart

### Database Reset
```sql
DROP DATABASE shield_db;
CREATE DATABASE shield_db;
-- Restart backend to reinitialize
```

### Add New Threats
```bash
curl -X POST http://localhost:8080/api/threats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceIP": "10.0.0.1",
    "targetSystem": "Web-Server",
    "threatType": "XSS Attack",
    "severityScore": 7.5,
    "intentClassification": "Code Injection",
    "status": "DETECTED"
  }'
```

---

## 🎉 Success Checklist

- [ ] PostgreSQL running
- [ ] Database `shield_db` created
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can login with admin/admin123
- [ ] Dashboard shows real data
- [ ] Threats page loads data
- [ ] No console errors

---

## 📞 Support

If you encounter issues:
1. Check all services are running
2. Verify database connection
3. Check browser console for errors
4. Check backend logs for exceptions
5. Ensure all ports are available

---

## 🚀 Next Steps

1. Add more agents
2. Implement ML service integration
3. Add real-time WebSocket updates
4. Create custom threat scenarios
5. Build simulation engine

---

**Your S.H.I.E.L.D system is now fully operational! 🛡️**
