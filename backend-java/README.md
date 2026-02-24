# SHIELD Backend - Java Spring Boot

## Prerequisites
- Java 17
- Maven 3.8+
- PostgreSQL 14+

## Database Setup

1. Install PostgreSQL and create database:
```sql
CREATE DATABASE shield_db;
CREATE USER shield_user WITH PASSWORD 'shield_pass';
GRANT ALL PRIVILEGES ON DATABASE shield_db TO shield_user;
```

## Environment Variables

Create `.env` file or set environment variables:

```bash
DB_URL=jdbc:postgresql://localhost:5432/shield_db
DB_USERNAME=shield_user
DB_PASSWORD=shield_pass
JWT_SECRET=your-secret-key-here
ML_SERVICE_URL=http://localhost:8000
```

## Build and Run

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

Or with environment variables:

```bash
DB_URL=jdbc:postgresql://localhost:5432/shield_db DB_USERNAME=shield_user DB_PASSWORD=shield_pass mvn spring-boot:run
```

## API Documentation

Once running, access Swagger UI at:
- http://localhost:8080/swagger-ui.html

## Default Port
- Backend runs on port 8080

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login and get JWT tokens
- POST `/api/auth/refresh` - Refresh access token

### Threats
- GET `/api/threats` - Get all threats
- GET `/api/threats/{id}` - Get threat by ID
- GET `/api/threats/status/{status}` - Get threats by status
- POST `/api/threats` - Create new threat
- PUT `/api/threats/{id}` - Update threat
- DELETE `/api/threats/{id}` - Delete threat

### Agents
- GET `/api/agents/decisions` - Get all agent decisions
- GET `/api/agents/decisions/threat/{threatId}` - Get decisions for threat
- GET `/api/agents/decisions/agent/{agentName}` - Get decisions by agent
- POST `/api/agents/decisions` - Create agent decision
- POST `/api/agents/execute` - Execute agent action

## First Time Setup

1. Start the backend
2. Register a user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"ADMIN"}'
```

3. Login to get token:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

4. Use the accessToken in Authorization header for subsequent requests:
```bash
Authorization: Bearer <your-access-token>
```
