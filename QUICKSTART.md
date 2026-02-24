# SHIELD - Quick Start Guide

## 🚀 Fast Setup (Windows)

### 1. Prerequisites Check
```bash
java -version    # Should be 17+
mvn -version     # Should be 3.8+
node -version    # Should be 18+
python --version # Should be 3.11+
psql --version   # PostgreSQL 14+
```

### 2. Database Setup (One-time)
```sql
-- Open PostgreSQL command line
psql -U postgres

-- Run these commands
CREATE DATABASE shield_db;
CREATE USER shield_user WITH PASSWORD 'shield_pass';
GRANT ALL PRIVILEGES ON DATABASE shield_db TO shield_user;
\q
```

### 3. ML Service Setup (One-time)
```bash
cd ml-service-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Start Services

#### Option A: Automatic (Recommended)
```bash
# From project root
start-all-services.bat
```

#### Option B: Manual

**Terminal 1 - ML Service:**
```bash
cd ml-service-python
venv\Scripts\activate
cd app
python main.py
```

**Terminal 2 - Backend:**
```bash
cd backend-java
set DB_URL=jdbc:postgresql://localhost:5432/shield_db
set DB_USERNAME=shield_user
set DB_PASSWORD=shield_pass
mvn spring-boot:run
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm start
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/swagger-ui.html
- **ML Service**: http://localhost:8000/docs

### 6. Create First User

```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"ADMIN\"}"
```

### 7. Login

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Copy the `accessToken` from response.

## 📁 Project Structure

```
S.H.I.E.L.D-main/
├── backend-java/          ← Spring Boot (Port 8080)
├── ml-service-python/     ← FastAPI (Port 8000)
├── frontend/              ← React (Port 3000) - DO NOT MODIFY
├── SETUP.md              ← Detailed setup guide
└── start-all-services.bat ← Auto-start script
```

## 🔧 Environment Variables

Create `.env` or set manually:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/shield_db
DB_USERNAME=shield_user
DB_PASSWORD=shield_pass

# Security
JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437

# ML Service
ML_SERVICE_URL=http://localhost:8000
```

## 🧪 Test the System

### Create a Threat
```bash
curl -X POST http://localhost:8080/api/threats ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"threatType\":\"MALWARE\",\"severity\":\"HIGH\",\"sourceIp\":\"192.168.1.100\",\"targetSystem\":\"server-01\",\"description\":\"Suspicious activity\"}"
```

### Get All Threats
```bash
curl http://localhost:8080/api/threats ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ❗ Common Issues

### Port Already in Use
- Backend (8080): Change in `application.properties`
- ML Service (8000): Change in `main.py`
- Frontend (3000): Automatically uses next available port

### Database Connection Failed
- Check PostgreSQL is running: `pg_isready`
- Verify credentials match
- Ensure database exists: `psql -U postgres -l`

### ML Service Not Responding
- Check if running: http://localhost:8000/health
- Verify virtual environment is activated
- Check firewall settings

## 📚 Documentation

- **Full Setup**: See `SETUP.md`
- **Backend API**: http://localhost:8080/swagger-ui.html
- **ML Service API**: http://localhost:8000/docs
- **Backend Details**: `backend-java/README.md`
- **ML Service Details**: `ml-service-python/README.md`

## 🎯 Key Features

✅ JWT Authentication (access + refresh tokens)  
✅ Role-based access control  
✅ ML-powered anomaly detection  
✅ Autonomous agent coordination  
✅ Real-time threat monitoring  
✅ PostgreSQL persistence  
✅ RESTful API with Swagger  
✅ CORS enabled for frontend  

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3, Java 17, PostgreSQL, JWT
- **ML Service**: FastAPI, scikit-learn, IsolationForest
- **Frontend**: React 18, Vite, Tailwind CSS (existing)
