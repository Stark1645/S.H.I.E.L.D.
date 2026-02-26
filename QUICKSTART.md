# S.H.I.E.L.D - Quick Start Guide
## Get Running in 5 Minutes

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+
- Python 3.9+

---

## Step 1: Database Setup (1 minute)

```bash
# Start PostgreSQL and create database
psql -U postgres
CREATE DATABASE shield_db;
\q
```

---

## Step 2: Start ML Service (1 minute)

```bash
cd ml-service-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

**Verify:** http://localhost:8000 shows service info

---

## Step 3: Start Backend (2 minutes)

```bash
cd backend-java
mvn spring-boot:run
```

**Verify:** http://localhost:8080/swagger-ui.html loads

**Auto-initialized data:**
- Admin user: `admin` / `admin123`
- Director user: `nickfury` / `director123`
- 4 sample threats
- 3 agent decisions

---

## Step 4: Start Frontend (1 minute)

```bash
npm install
npm run dev
```

**Verify:** http://localhost:5173 loads login page

---

## Step 5: Login & Explore

1. Open http://localhost:5173
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Explore:
   - Dashboard → Real-time metrics
   - Threat Intelligence → View threats
   - Agent Monitor → See agent decisions

---

## Quick Test

```bash
# Get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get threats (use token from above)
curl http://localhost:8080/api/threats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

**Backend won't start:**
- Check PostgreSQL: `pg_isready`
- Check port 8080: `netstat -ano | findstr :8080`

**Frontend can't connect:**
- Verify backend running: `curl http://localhost:8080/api/auth/login`
- Clear browser cache

**ML Service errors:**
- Check Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`

---

## What's Running?

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080
- **ML Service:** http://localhost:8000
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Database:** localhost:5432/shield_db

---

## Next Steps

- Read [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) for detailed configuration
- Check [API_REFERENCE.md](API_REFERENCE.md) for API documentation
- See [FEATURE_REPORT.md](FEATURE_REPORT.md) for complete feature list

---

**🛡️ You're ready to go!**
