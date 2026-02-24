# 🛡️ S.H.I.E.L.D - Autonomous Cybersecurity War Room

## 📖 Documentation Index

Welcome to S.H.I.E.L.D! This is your complete guide to the project.

### 🚀 Getting Started (Start Here!)
1. **[QUICKSTART.md](QUICKSTART.md)** - Fast setup guide (5 minutes)
2. **[SETUP.md](SETUP.md)** - Detailed setup instructions
3. **[start-all-services.bat](start-all-services.bat)** - One-click startup script

### 📚 Understanding the System
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flow
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete file structure
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built

### 🔧 Component Documentation
- **[backend-java/README.md](backend-java/README.md)** - Spring Boot backend guide
- **[ml-service-python/README.md](ml-service-python/README.md)** - FastAPI ML service guide

---

## 🏗️ Project Structure

```
S.H.I.E.L.D/
├── 📂 backend-java/          → Spring Boot 3 + Java 17 (Port 8080)
├── 📂 ml-service-python/     → FastAPI + scikit-learn (Port 8000)
└── 📂 frontend/              → React 18 + Vite (Port 3000) [EXISTING]
```

---

## ⚡ Quick Start

### Prerequisites
- Java 17, Maven 3.8+
- Python 3.11+
- PostgreSQL 14+
- Node.js 18+

### 1. Database Setup
```sql
CREATE DATABASE shield_db;
CREATE USER shield_user WITH PASSWORD 'shield_pass';
GRANT ALL PRIVILEGES ON DATABASE shield_db TO shield_user;
```

### 2. ML Service Setup (One-time)
```bash
cd ml-service-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Start All Services
```bash
# Option A: Automatic
start-all-services.bat

# Option B: Manual (3 terminals)
# Terminal 1: ML Service
cd ml-service-python && venv\Scripts\activate && cd app && python main.py

# Terminal 2: Backend
cd backend-java && mvn spring-boot:run

# Terminal 3: Frontend
cd frontend && npm start
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/swagger-ui.html
- **ML Service**: http://localhost:8000/docs

---

## 🎯 Key Features

### ✅ Backend (Spring Boot)
- JWT Authentication (access + refresh tokens)
- Role-based access control (RBAC)
- RESTful API with Swagger documentation
- PostgreSQL persistence with JPA/Hibernate
- Autonomous agent coordination
- ML service integration

### ✅ ML Service (FastAPI)
- IsolationForest anomaly detection
- Real-time threat analysis
- Anomaly score calculation (0-1)
- Escalation prediction (LOW/MEDIUM/HIGH/CRITICAL)
- Action recommendations

### ✅ Frontend (React - Existing)
- Real-time threat dashboard
- Agent monitoring interface
- Forensic log viewer
- Simulation control panel
- Cyberpunk UI theme

---

## 📡 API Endpoints

### Authentication (Public)
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login and get JWT tokens
POST /api/auth/refresh     - Refresh access token
```

### Threats (Protected)
```
GET    /api/threats                - Get all threats
GET    /api/threats/{id}           - Get threat by ID
GET    /api/threats/status/{status} - Filter by status
POST   /api/threats                - Create threat (triggers ML)
PUT    /api/threats/{id}           - Update threat
DELETE /api/threats/{id}           - Delete threat
```

### Agents (Protected)
```
GET  /api/agents/decisions                - All agent decisions
GET  /api/agents/decisions/threat/{id}    - Decisions for threat
GET  /api/agents/decisions/agent/{name}   - Decisions by agent
POST /api/agents/decisions                - Create decision
POST /api/agents/execute                  - Execute agent action
```

### ML Service (Internal)
```
GET  /              - Service info
GET  /health        - Health check
POST /analyze       - Analyze threat
```

---

## 🧪 Testing the System

### 1. Register User
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"ADMIN\"}"
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### 3. Create Threat
```bash
curl -X POST http://localhost:8080/api/threats ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"threatType\":\"MALWARE\",\"severity\":\"HIGH\",\"sourceIp\":\"192.168.1.100\",\"targetSystem\":\"server-01\",\"description\":\"Test threat\"}"
```

---

## 🔐 Environment Variables

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

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Port |
|-------|-----------|---------|------|
| Frontend | React + Vite | 18 | 3000 |
| Backend | Spring Boot | 3.2.0 | 8080 |
| ML Service | FastAPI | 0.109.0 | 8000 |
| Database | PostgreSQL | 14+ | 5432 |
| Language (Backend) | Java | 17 | - |
| Language (ML) | Python | 3.11+ | - |

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)                    │
│                     Port: 3000/5173                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Backend (Spring Boot 3 + Java 17)                 │
│                      Port: 8080                             │
│  • JWT Authentication  • Threat Management                  │
│  • Agent Coordination  • ML Integration                     │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
               │ REST API             │ JDBC
               ▼                      ▼
┌──────────────────────────┐  ┌─────────────────────────────┐
│  ML Service (FastAPI)    │  │  PostgreSQL Database        │
│  Port: 8000              │  │  Port: 5432                 │
│  • IsolationForest       │  │  • users                    │
│  • Anomaly Detection     │  │  • threat_events            │
│  • Threat Analysis       │  │  • agent_decisions          │
└──────────────────────────┘  └─────────────────────────────┘
```

---

## 🤖 Autonomous Features

- **Agent Coordinator**: Runs every 30 seconds
- **Automatic Threat Analysis**: ML-powered on threat creation
- **Automated Response**: Based on anomaly scores
  - Score > 0.7: ISOLATE_SYSTEM
  - Score > 0.4: INCREASE_SURVEILLANCE
- **Decision Logging**: All actions tracked in database

---

## 📁 File Count

| Component | Files | Lines of Code |
|-----------|-------|---------------|
| Backend Java | 20 | ~1,500 |
| ML Service Python | 5 | ~200 |
| Documentation | 5 | ~1,200 |
| Utilities | 1 | ~30 |
| **Total Created** | **31** | **~2,930** |

---

## ❗ Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -U postgres -l | grep shield_db
```

### Port Already in Use
- Backend (8080): Change `server.port` in `application.properties`
- ML Service (8000): Change port in `main.py`
- Frontend (3000): Vite will auto-select next available port

### ML Service Not Responding
```bash
# Test health endpoint
curl http://localhost:8000/health

# Check if running
netstat -ano | findstr :8000
```

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **ML Service Docs**: http://localhost:8000/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 🎓 Learning Path

1. **Beginners**: Start with [QUICKSTART.md](QUICKSTART.md)
2. **Developers**: Read [ARCHITECTURE.md](ARCHITECTURE.md)
3. **DevOps**: Check [SETUP.md](SETUP.md)
4. **API Users**: Visit Swagger UI at http://localhost:8080/swagger-ui.html

---

## ✅ Implementation Status

- [x] Backend Java (Spring Boot 3)
- [x] ML Service Python (FastAPI)
- [x] Database Schema (PostgreSQL)
- [x] JWT Authentication
- [x] REST API Endpoints
- [x] ML Integration
- [x] Autonomous Agents
- [x] API Documentation
- [x] Setup Guides
- [x] Auto-start Script
- [x] Frontend Integration Ready

**Status**: ✅ COMPLETE - Ready for deployment

---

## 📞 Support

For issues or questions:
1. Check [QUICKSTART.md](QUICKSTART.md) for common setup issues
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. See component READMEs in `backend-java/` and `ml-service-python/`

---

## 🚀 Next Steps

1. ✅ Complete database setup
2. ✅ Install Python dependencies
3. ✅ Start all services
4. ✅ Register first user
5. ✅ Test API endpoints
6. ✅ Connect frontend
7. ✅ Monitor autonomous agents

---

**Built with ❤️ for Cybersecurity Operations**
