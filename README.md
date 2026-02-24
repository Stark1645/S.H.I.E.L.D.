
# S.H.I.E.L.D – Autonomous Cybersecurity War Room

Welcome to the SHIELD platform. This is an enterprise-grade cybersecurity war room powered by a multi-agent autonomous backend.

## Architecture

- **Frontend**: React 18, Tailwind CSS, Recharts.
- **Backend**: Spring Boot 3, Java 17, PostgreSQL, JWT Security.

## Setup Instructions

### Backend (Spring Boot)
1. Ensure Java 17 and Maven are installed.
2. Configure PostgreSQL database in `application.properties`.
3. Run `mvn clean install`.
4. Run `mvn spring-boot:run`.
5. Access Swagger at `/swagger-ui/index.html`.

### Frontend (React)
1. Ensure Node.js is installed.
2. Run `npm install`.
3. Run `npm start`.
4. The dashboard will be available at `http://localhost:3000`.

## Features
- **Real-time Threat Monitoring**: Grid-based system integrity map.
- **Multi-Agent Simulation**: Test defense strategies using the simulation engine.
- **AI Decision Feed**: Watch autonomous agents communicate and resolve threats.
- **Cyberpunk UI**: Dark-mode premium interface for security operations centers (SOC).
