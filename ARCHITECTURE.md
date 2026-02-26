# S.H.I.E.L.D - System Architecture
## Technical Architecture Documentation

---

## System Overview

S.H.I.E.L.D is a multi-tier, microservices-based cybersecurity platform with autonomous agent capabilities.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│                  React 18 + TypeScript                      │
│                   Port: 5173 (Vite)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (JWT)
┌──────────────────────▼──────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│              Spring Boot 3.2 + Java 17                      │
│                    Port: 8080                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Security Layer (JWT + BCrypt)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Business Logic (Services)                           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Autonomous Agents (Scheduled Tasks)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────┬───────────────────────────┘
           │                      │
           │ REST                 │ JDBC
           │                      │
┌──────────▼─────────┐  ┌─────────▼─────────────────────────┐
│   ML SERVICE       │  │     DATA LAYER                    │
│   FastAPI/Python   │  │  PostgreSQL 14+                   │
│   Port: 8000       │  │  Port: 5432                       │
└────────────────────┘  └───────────────────────────────────┘
```

---

## Component Architecture

### 1. Frontend (Presentation Layer)

**Technology Stack:**
- React 18.2
- TypeScript 5.0
- Vite 5.0 (Build tool)
- Tailwind CSS 3.3
- Recharts 2.5 (Visualization)
- React Router 6.x (Navigation)

**Structure:**
```
src/
├── pages/
│   ├── Dashboard.tsx          # Main dashboard
│   ├── ThreatIntelligence.tsx # Threat grid
│   ├── AgentMonitor.tsx       # Agent status
│   └── Login.tsx              # Authentication
├── services/
│   └── api.ts                 # API client
├── components/
│   └── (reusable UI components)
└── App.tsx                    # Root component
```

**Key Features:**
- JWT token management
- Auto-refresh mechanisms (10s/15s)
- Toast notifications
- Loading states
- Error boundaries
- Responsive design

---

### 2. Backend (Application Layer)

**Technology Stack:**
- Spring Boot 3.2.0
- Java 17
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- SpringDoc OpenAPI

**Architecture Pattern:** Layered Architecture

```
com.shield/
├── config/
│   └── SecurityConfig.java        # Security configuration
├── controller/
│   ├── AuthController.java        # Authentication endpoints
│   ├── ThreatController.java      # Threat CRUD
│   └── AgentController.java       # Agent operations
├── service/
│   ├── AuthService.java           # Auth business logic
│   ├── ThreatService.java         # Threat management
│   ├── AgentService.java          # Agent coordination
│   ├── RiskScoringService.java    # Risk calculation
│   └── DataInitService.java       # Data initialization
├── repository/
│   ├── UserRepository.java        # User data access
│   ├── ThreatEventRepository.java # Threat data access
│   └── AgentDecisionRepository.java # Decision data access
├── entity/
│   ├── User.java                  # User entity
│   ├── ThreatEvent.java           # Threat entity
│   └── AgentDecision.java         # Decision entity
├── security/
│   ├── JwtUtil.java               # JWT utilities
│   └── JwtAuthenticationFilter.java # JWT filter
├── integration/
│   └── MLServiceClient.java       # ML service client
├── agents/
│   ├── AgentCoordinator.java      # Main coordinator
│   ├── SentinelAlphaAgent.java    # System isolation
│   ├── DefenderPrimeAgent.java    # IP blocking
│   ├── RiskEvaluatorAgent.java    # Surveillance
│   ├── AnalyzerBetaAgent.java     # Deep inspection
│   ├── WatcherAgent.java          # Activity logging
│   └── OrchestratorAgent.java     # Honeypot deployment
└── ShieldApplication.java         # Main application
```

**Design Patterns:**
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation
- **Dependency Injection** - Loose coupling
- **Strategy Pattern** - Agent selection
- **Observer Pattern** - Scheduled tasks

---

### 3. ML Service (Intelligence Layer)

**Technology Stack:**
- FastAPI 0.104
- Python 3.9+
- scikit-learn 1.3 (IsolationForest)
- NumPy 1.26
- Pandas 2.1
- Uvicorn (ASGI server)

**Structure:**
```
ml-service-python/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models.py            # ML models
│   └── schemas.py           # Pydantic schemas
└── requirements.txt
```

**ML Algorithm:** IsolationForest
- Unsupervised anomaly detection
- Trained on threat patterns
- Returns anomaly score (0-1)

---

### 4. Database (Data Layer)

**Technology:** PostgreSQL 14+

**Schema:**

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Threat events table
CREATE TABLE threat_events (
    id BIGSERIAL PRIMARY KEY,
    threat_type VARCHAR(255),
    source_ip VARCHAR(50),
    target_system VARCHAR(255),
    status VARCHAR(50),
    severity_score DOUBLE PRECISION,
    intent_classification VARCHAR(255),
    description TEXT,
    predicted_escalation VARCHAR(50),
    recommended_action VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Agent decisions table
CREATE TABLE agent_decisions (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(255),
    decision_summary TEXT,
    confidence_score DOUBLE PRECISION,
    linked_threat_id BIGINT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- Primary keys on all tables
- Index on threat_events.status
- Index on threat_events.source_ip
- Index on agent_decisions.linked_threat_id

---

## Data Flow Architecture

### 1. Authentication Flow

```
User → Frontend → POST /api/auth/login
                    ↓
              AuthController
                    ↓
              AuthService
                    ↓
         UserRepository (DB)
                    ↓
         BCrypt password check
                    ↓
         JwtUtil.generateTokens()
                    ↓
         Return {accessToken, refreshToken}
                    ↓
         Frontend stores in localStorage
                    ↓
         All requests include: Authorization: Bearer <token>
```

### 2. Threat Creation Flow

```
User → Frontend → POST /api/threats
                    ↓
         JwtAuthenticationFilter (validate token)
                    ↓
         ThreatController.createThreat()
                    ↓
         ThreatService.createThreat()
                    ↓
         MLServiceClient.analyzeAnomaly()
                    ↓
         ML Service (IsolationForest)
                    ↓
         Returns {anomalyScore, escalation, action}
                    ↓
         RiskScoringService.calculateFinalRiskScore()
                    ↓
         ThreatEventRepository.save()
                    ↓
         Database (threat_events table)
                    ↓
         Return complete threat to frontend
```

### 3. Agent Coordination Flow

```
@Scheduled(fixedDelay = 30000)
         ↓
AgentCoordinator.coordinateAgents()
         ↓
ThreatService.getThreatsByStatus("ACTIVE")
         ↓
For each threat:
    ↓
RiskScoringService.calculateFinalRiskScore()
    ↓
RiskScoringService.calculateDynamicThreshold()
    ↓
If finalRiskScore > dynamicThreshold:
    → SentinelAlphaAgent.respond() → ISOLATE_SYSTEM
    → DefenderPrimeAgent.respond() → BLOCK_IP
    ↓
Else if finalRiskScore > threshold × 0.6:
    → RiskEvaluatorAgent.respond() → INCREASE_SURVEILLANCE
    → AnalyzerBetaAgent.respond() → DEEP_PACKET_INSPECTION
    ↓
Else:
    → WatcherAgent.respond() → LOG_ACTIVITY
    ↓
RiskScoringService.detectAttackChain()
    ↓
If POTENTIAL_ATTACK_CAMPAIGN:
    → OrchestratorAgent.respond() → DEPLOY_HONEYPOT
    ↓
AgentService.executeAgentAction()
    ↓
AgentDecisionRepository.save()
    ↓
If action contains "ISOLATE" or "BLOCK":
    → Update threat status to "CONTAINED"
```

---

## Security Architecture

### 1. Authentication & Authorization

**JWT Token Structure:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "admin",
    "role": "ADMIN",
    "iat": 1234567890,
    "exp": 1234654290
  },
  "signature": "..."
}
```

**Token Lifecycle:**
- Access Token: 24 hours
- Refresh Token: 7 days
- Stored in localStorage (frontend)
- Validated on every request (backend)

### 2. Password Security

**BCrypt Hashing:**
- Strength: 10 rounds
- Salt: Auto-generated per password
- One-way encryption
- Timing-attack resistant

### 3. CORS Protection

**Allowed Origins:**
- http://localhost:3000
- http://localhost:5173
- http://localhost:3001

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS, PATCH

**Allowed Headers:**
- All headers (*)

### 4. API Security

**Protected Endpoints:**
- All /api/threats/* endpoints
- All /api/agents/* endpoints

**Public Endpoints:**
- /api/auth/login
- /api/auth/register
- /api/auth/refresh
- /swagger-ui/**

---

## Scalability Architecture

### Horizontal Scaling

**Frontend:**
- Stateless React app
- Can be deployed to CDN
- Multiple instances behind load balancer

**Backend:**
- Stateless Spring Boot (JWT)
- Multiple instances possible
- Load balancer distribution
- Shared database

**ML Service:**
- Stateless FastAPI
- Multiple workers (Gunicorn)
- Load balancer distribution

**Database:**
- PostgreSQL replication
- Read replicas for queries
- Write master for updates

### Vertical Scaling

**Database:**
- Increase connection pool size
- Add indexes for performance
- Optimize queries

**Backend:**
- Increase JVM heap size
- Tune thread pool
- Enable caching

**ML Service:**
- Increase worker count
- GPU acceleration (future)
- Model optimization

---

## Monitoring Architecture

### Logging

**Backend (SLF4J):**
```java
log.info("Threat created: id={}, severity={}", id, severity);
log.warn("ML service unavailable, using fallback");
log.error("Database connection failed", exception);
```

**Levels:**
- ERROR - Critical failures
- WARN - Degraded performance
- INFO - Normal operations
- DEBUG - Detailed diagnostics

### Metrics

**Application Metrics:**
- Request count
- Response time
- Error rate
- Active users

**System Metrics:**
- CPU usage
- Memory usage
- Database connections
- Thread count

### Health Checks

**Endpoints:**
- GET /actuator/health (Backend)
- GET /health (ML Service)

**Checks:**
- Database connectivity
- ML service availability
- Disk space
- Memory usage

---

## Deployment Architecture

### Development

```
Local Machine
├── Frontend (npm run dev) → :5173
├── Backend (mvn spring-boot:run) → :8080
├── ML Service (python main.py) → :8000
└── PostgreSQL (local) → :5432
```

### Production

```
Cloud Infrastructure
├── Frontend (Nginx/CDN)
│   └── Static files from npm build
├── Backend (Docker/K8s)
│   └── Multiple instances
│   └── Load balancer
├── ML Service (Docker/K8s)
│   └── Multiple workers
│   └── Load balancer
└── Database (Managed PostgreSQL)
    └── Primary + Replicas
```

---

## Technology Decisions

### Why Spring Boot?
- Enterprise-grade framework
- Excellent security features
- Large ecosystem
- Easy deployment

### Why React?
- Component-based architecture
- Large community
- Excellent tooling
- Performance

### Why PostgreSQL?
- ACID compliance
- JSON support
- Excellent performance
- Open source

### Why FastAPI?
- High performance
- Async support
- Auto-generated docs
- Python ML ecosystem

### Why JWT?
- Stateless authentication
- Scalable
- Cross-domain support
- Industry standard

---

## Future Architecture Enhancements

### Phase 2
- WebSocket for real-time updates
- Redis for caching
- Elasticsearch for log aggregation
- Prometheus for metrics

### Phase 3
- Kubernetes orchestration
- Service mesh (Istio)
- Distributed tracing (Jaeger)
- Event-driven architecture (Kafka)

---

**For implementation details, see [FEATURE_REPORT.md](FEATURE_REPORT.md)**
