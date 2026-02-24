# S.H.I.E.L.D - Complete Setup Guide

## Architecture Overview

```
Frontend (React) → Backend (Spring Boot) → ML Service (FastAPI) → PostgreSQL
Port 3000/5173      Port 8080              Port 8000
```

## Prerequisites

- Java 17
- Maven 3.8+
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

## Setup Instructions

### 1. Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE shield_db;
CREATE USER shield_user WITH PASSWORD 'shield_pass';
GRANT ALL PRIVILEGES ON DATABASE shield_db TO shield_user;
```

### 2. ML Service Setup (Start First)

```bash
cd ml-service-python

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run service
cd app
python main.py
```

ML Service will run on: http://localhost:8000

### 3. Backend Setup (Start Second)

```bash
cd backend-java

# Set environment variables (Windows)
set DB_URL=jdbc:postgresql://localhost:5432/shield_db
set DB_USERNAME=shield_user
set DB_PASSWORD=shield_pass
set JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
set ML_SERVICE_URL=http://localhost:8000

# Set environment variables (Linux/Mac)
export DB_URL=jdbc:postgresql://localhost:5432/shield_db
export DB_USERNAME=shield_user
export DB_PASSWORD=shield_pass
export JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
export ML_SERVICE_URL=http://localhost:8000

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will run on: http://localhost:8080

### 4. Frontend Setup (Start Last)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

Frontend will run on: http://localhost:3000 or http://localhost:5173

## First Time Usage

### 1. Register Admin User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"ADMIN\"}"
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Save the `accessToken` from response.

### 3. Create Test Threat

```bash
curl -X POST http://localhost:8080/api/threats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"threatType\":\"MALWARE\",\"severity\":\"HIGH\",\"sourceIp\":\"192.168.1.100\",\"targetSystem\":\"web-server-01\",\"description\":\"Suspicious activity detected\"}"
```

## API Documentation

- Backend Swagger: http://localhost:8080/swagger-ui.html
- ML Service Docs: http://localhost:8000/docs

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials
- Check if database `shield_db` exists

### ML Service Connection Issues
- Ensure ML service is running on port 8000
- Check `ML_SERVICE_URL` environment variable
- Verify no firewall blocking

### Port Conflicts
- Backend: Change `server.port` in `application.properties`
- ML Service: Change port in `main.py` uvicorn.run()
- Frontend: Change port in `vite.config.ts` or `package.json`

## Project Structure

```
S.H.I.E.L.D-main/
├── backend-java/           # Spring Boot backend
│   ├── src/main/java/com/shield/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── entity/         # JPA entities
│   │   ├── security/       # JWT security
│   │   ├── agents/         # Autonomous agents
│   │   ├── integration/    # ML service client
│   │   └── config/         # Configuration
│   └── pom.xml
│
├── ml-service-python/      # FastAPI ML service
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── schemas.py      # Pydantic models
│   │   └── services/
│   │       └── anomaly_detector.py
│   └── requirements.txt
│
└── frontend/               # React frontend (DO NOT MODIFY)
```

## Features

- JWT Authentication (access + refresh tokens)
- Role-based access control
- Real-time threat monitoring
- ML-powered anomaly detection
- Autonomous agent coordination
- RESTful API with Swagger docs
- PostgreSQL persistence

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Spring Boot 3, Java 17, JPA/Hibernate
- **ML Service**: FastAPI, scikit-learn, IsolationForest
- **Database**: PostgreSQL
- **Security**: JWT, BCrypt
- **Documentation**: Swagger/OpenAPI
