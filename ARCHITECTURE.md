# S.H.I.E.L.D - System Architecture

## Overview

S.H.I.E.L.D is a three-tier autonomous cybersecurity war room with ML-powered threat analysis.

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│                    Port: 3000/5173                          │
│  - Dashboard, Threat Intelligence, Agent Monitor            │
│  - Forensic Logs, Simulation Control                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot 3 + Java 17)              │
│                      Port: 8080                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Controllers: Auth, Threat, Agent                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Services: AuthService, ThreatService, AgentService  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Security: JWT Filter, BCrypt, Role-based Access     │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Agents: AgentCoordinator (Autonomous)               │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Integration: ML Service Client                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Repositories: JPA/Hibernate                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────┬───────────────────────┘
                  │                   │
                  │ HTTP              │ JDBC
                  ▼                   ▼
┌─────────────────────────────┐  ┌──────────────────────┐
│  ML SERVICE (FastAPI)       │  │  PostgreSQL Database │
│  Port: 8000                 │  │  Port: 5432          │
│  ┌───────────────────────┐  │  │  ┌────────────────┐ │
│  │ IsolationForest Model │  │  │  │ users          │ │
│  │ Anomaly Detection     │  │  │  │ threat_events  │ │
│  │ Threat Analysis       │  │  │  │ agent_decisions│ │
│  └───────────────────────┘  │  │  └────────────────┘ │
└─────────────────────────────┘  └──────────────────────┘
```

## Component Details

### 1. Frontend (Existing - DO NOT MODIFY)
- **Technology**: React 18, Vite, Tailwind CSS, Recharts
- **Port**: 3000 or 5173
- **Features**:
  - Real-time threat dashboard
  - Agent monitoring interface
  - Forensic log viewer
  - Simulation control panel
  - Threat intelligence feed

### 2. Backend (backend-java/)
- **Technology**: Spring Boot 3.2.0, Java 17
- **Port**: 8080
- **Database**: PostgreSQL via JPA/Hibernate

#### Layers:

**Controllers** (`controller/`)
- `AuthController`: Login, register, token refresh
- `ThreatController`: CRUD operations for threats
- `AgentController`: Agent decisions and actions

**Services** (`service/`)
- `AuthService`: Authentication logic, JWT generation
- `ThreatService`: Threat management, ML integration
- `AgentService`: Agent coordination and decision logging

**Security** (`security/`)
- `JwtUtil`: Token generation and validation
- `JwtAuthenticationFilter`: Request authentication
- `SecurityConfig`: Spring Security configuration

**Agents** (`agents/`)
- `AgentCoordinator`: Autonomous threat response
  - Scheduled execution every 30 seconds
  - Analyzes active threats
  - Executes automated responses

**Integration** (`integration/`)
- `MLServiceClient`: REST client for ML service
  - Sends threat data for analysis
  - Receives anomaly scores and recommendations

**Entities** (`entity/`)
- `User`: Authentication and authorization
- `ThreatEvent`: Threat information and ML results
- `AgentDecision`: Agent actions and reasoning

**Repositories** (`repository/`)
- JPA repositories for data access
- Custom queries for filtering

### 3. ML Service (ml-service-python/)
- **Technology**: FastAPI, scikit-learn
- **Port**: 8000
- **Model**: IsolationForest

#### Components:

**API** (`main.py`)
- `/analyze`: Threat analysis endpoint
- `/health`: Health check
- CORS enabled for cross-origin requests

**Services** (`services/anomaly_detector.py`)
- `AnomalyDetector`: ML model wrapper
  - Baseline training on startup
  - Feature extraction from threat data
  - Anomaly score calculation (0-1)
  - Escalation prediction (LOW/MEDIUM/HIGH/CRITICAL)
  - Action recommendation (LOG/MONITOR/QUARANTINE/ISOLATE_AND_BLOCK)

**Schemas** (`schemas.py`)
- `ThreatInput`: Request validation
- `AnomalyResponse`: Response structure

### 4. Database (PostgreSQL)
- **Port**: 5432
- **Database**: shield_db

#### Tables:

**users**
- id, username, password (BCrypt), role, created_at

**threat_events**
- id, threat_type, severity, source_ip, target_system
- status, description, anomaly_score
- predicted_escalation, recommended_action
- detected_at, resolved_at

**agent_decisions**
- id, agent_name, action, reasoning, status
- threat_event_id (FK), timestamp

## Data Flow

### Threat Creation Flow:
```
1. Frontend → POST /api/threats → Backend
2. Backend → ThreatService.createThreat()
3. Backend → MLServiceClient.analyzeAnomaly()
4. ML Service → IsolationForest.predict()
5. ML Service → Return {anomalyScore, escalation, action}
6. Backend → Save ThreatEvent with ML results
7. Backend → Return threat to Frontend
```

### Autonomous Agent Flow:
```
1. AgentCoordinator (scheduled every 30s)
2. Query active threats from database
3. For each threat with high anomaly score:
   - Create AgentDecision
   - Execute automated action
   - Log decision to database
4. Frontend polls for updates
```

### Authentication Flow:
```
1. Frontend → POST /api/auth/login
2. Backend → Validate credentials
3. Backend → Generate JWT (access + refresh)
4. Frontend → Store tokens
5. Frontend → Include "Authorization: Bearer <token>" in requests
6. Backend → JwtAuthenticationFilter validates token
7. Backend → Process authenticated request
```

## Security

### Authentication
- JWT-based stateless authentication
- Access token: 1 hour expiration
- Refresh token: 24 hour expiration
- BCrypt password hashing

### Authorization
- Role-based access control (RBAC)
- Roles: USER, ADMIN
- Protected endpoints require authentication

### CORS
- Configured for frontend origins
- Allows credentials
- All HTTP methods enabled

## API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get tokens
POST   /api/auth/refresh     - Refresh access token
```

### Threats
```
GET    /api/threats                - Get all threats
GET    /api/threats/{id}           - Get threat by ID
GET    /api/threats/status/{status} - Filter by status
POST   /api/threats                - Create threat (triggers ML)
PUT    /api/threats/{id}           - Update threat
DELETE /api/threats/{id}           - Delete threat
```

### Agents
```
GET    /api/agents/decisions                    - All decisions
GET    /api/agents/decisions/threat/{id}        - By threat
GET    /api/agents/decisions/agent/{name}       - By agent
POST   /api/agents/decisions                    - Create decision
POST   /api/agents/execute                      - Execute action
```

### ML Service
```
GET    /                    - Service info
GET    /health              - Health check
POST   /analyze             - Analyze threat
```

## Configuration

### Backend Environment Variables
```bash
DB_URL=jdbc:postgresql://localhost:5432/shield_db
DB_USERNAME=shield_user
DB_PASSWORD=shield_pass
JWT_SECRET=<your-secret-key>
ML_SERVICE_URL=http://localhost:8000
```

### ML Service
- No configuration required
- Runs on port 8000 by default

### Database
- PostgreSQL 14+
- Database: shield_db
- User: shield_user

## Deployment

### Local Development
1. Start PostgreSQL
2. Start ML Service (port 8000)
3. Start Backend (port 8080)
4. Start Frontend (port 3000)

### Production Considerations
- Use environment-specific configuration
- Enable HTTPS/TLS
- Use production-grade database
- Implement rate limiting
- Add monitoring and logging
- Use container orchestration (Docker/Kubernetes)
- Implement CI/CD pipeline

## Monitoring

### Health Checks
- Backend: http://localhost:8080/actuator/health (if enabled)
- ML Service: http://localhost:8000/health

### Logging
- Backend: Spring Boot logging (console/file)
- ML Service: Uvicorn access logs
- Database: PostgreSQL logs

### Metrics
- API response times
- Threat detection rate
- Agent action success rate
- ML model accuracy

## Scalability

### Horizontal Scaling
- Backend: Stateless, can run multiple instances
- ML Service: Stateless, can run multiple instances
- Database: PostgreSQL replication

### Vertical Scaling
- Increase JVM heap size for backend
- Increase worker processes for ML service
- Optimize database queries and indexes

## Technology Versions

- Java: 17
- Spring Boot: 3.2.0
- PostgreSQL: 14+
- Python: 3.11+
- FastAPI: 0.109.0
- scikit-learn: 1.4.0
- React: 18
- Node.js: 18+
