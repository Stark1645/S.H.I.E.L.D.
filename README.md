
# S.H.I.E.L.D – Autonomous Cybersecurity War Room

Welcome to the SHIELD platform. This is an enterprise-grade cybersecurity war room powered by a multi-agent autonomous backend with **full end-to-end integration**.

## ✅ System Status: FULLY OPERATIONAL

- ✅ Backend connected to PostgreSQL
- ✅ Frontend connected to Backend APIs
- ✅ JWT Authentication working
- ✅ Real-time data updates
- ✅ Auto-refresh enabled
- ✅ Sample data auto-initialized

## 🚀 Quick Start

### 1. Setup Database
```bash
psql -U postgres -c "CREATE DATABASE shield_db;"
```

### 2. Start Backend
```bash
cd backend-java
mvn spring-boot:run
```

### 3. Start Frontend
```bash
npm install
npm run dev
```

### 4. Login
- URL: http://localhost:5173
- Username: `admin`
- Password: `admin123`

**See [QUICKSTART.md](QUICKSTART.md) for detailed 5-minute setup guide!**

## Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
- **Backend**: Spring Boot 3, Java 17, PostgreSQL, JWT Security
- **Integration**: RESTful APIs, Auto-refresh, Real-time updates

## Features

### ✅ Working End-to-End
- **Real-time Threat Monitoring**: Grid-based system integrity map with live data
- **Threat Intelligence**: Connected to backend with auto-refresh
- **Agent Monitor**: Live agent status and decision feed
- **AI Decision Feed**: Watch autonomous agents communicate and resolve threats
- **JWT Authentication**: Secure login with token management
- **Dashboard Metrics**: Real-time statistics from database
- **Auto-refresh**: Dashboard (10s), Threats (15s)

### 🎨 UI Features
- **Cyberpunk UI**: Dark-mode premium interface for security operations centers (SOC)
- **Interactive Components**: Click nodes, agents, and threats for details
- **Toast Notifications**: Real-time feedback for all actions
- **Loading States**: Smooth transitions with spinners
- **Error Handling**: Graceful fallback to mock data

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Detailed setup instructions
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API documentation
- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Technical implementation details

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/register` - Register new user

### Threats
- `GET /api/threats` - Get all threats
- `GET /api/threats/stats` - Get dashboard statistics
- `GET /api/threats/status/{status}` - Filter by status
- `POST /api/threats` - Create new threat

### Agents
- `GET /api/agents/decisions` - Get all agent decisions
- `POST /api/agents/execute` - Execute agent action

**See [API_REFERENCE.md](API_REFERENCE.md) for complete API documentation.**

## 🧪 Testing

### Verify Backend
```bash
curl http://localhost:8080/api/threats/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verify Frontend
1. Open http://localhost:5173
2. Login with admin/admin123
3. Check Dashboard shows real data
4. Check Threat Intelligence loads threats

### Interactive API Testing
- Swagger UI: http://localhost:8080/swagger-ui.html

## 📊 Sample Data

Auto-created on first run:
- 1 Admin user (admin/admin123)
- 4 Sample threats (DDoS, SQL Injection, Reverse Shell, Credential Stuffing)
- 3 Agent decisions (Sentinel-Alpha, Risk-Evaluator, Orchestrator)

## 🛡️ Security Features

- JWT Authentication with access and refresh tokens
- BCrypt password encryption
- CORS protection
- Protected API endpoints
- Stateless session management
- Token expiration handling

## 🔄 Real-time Updates

- Dashboard auto-refreshes every 10 seconds
- Threat Intelligence auto-refreshes every 15 seconds
- Agent decisions update in real-time
- Statistics calculated from live database

## 🎯 Tech Stack

### Backend
- Spring Boot 3.2
- Spring Security with JWT
- PostgreSQL 14+
- JPA/Hibernate
- Lombok
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- React Router

## 📦 Project Structure

```
S.H.I.E.L.D/
├── backend-java/          # Spring Boot backend
│   ├── src/main/java/com/shield/
│   │   ├── config/        # Security, CORS
│   │   ├── controller/    # REST endpoints
│   │   ├── entity/        # JPA entities
│   │   ├── repository/    # Data access
│   │   ├── service/       # Business logic
│   │   └── security/      # JWT utilities
│   └── src/main/resources/
│       └── application.properties
├── pages/                 # React pages
│   ├── Dashboard.tsx      # ✅ Connected
│   ├── ThreatIntelligence.tsx  # ✅ Connected
│   ├── AgentMonitor.tsx   # ✅ Connected
│   └── Login.tsx          # ✅ Connected
├── services/
│   └── api.ts            # ✅ API service layer
├── App.tsx               # Main app component
└── Documentation/
    ├── QUICKSTART.md
    ├── COMPLETE_SETUP_GUIDE.md
    ├── API_REFERENCE.md
    └── IMPLEMENTATION_COMPLETE.md
```

## 🚀 Deployment

### Development
```bash
# Terminal 1 - Backend
cd backend-java && mvn spring-boot:run

# Terminal 2 - Frontend
npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Build backend
cd backend-java && mvn clean package

# Run backend with production profile
java -jar target/shield-backend-1.0.0.jar
```

## 🔧 Configuration

### Database
Edit `backend-java/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shield_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### CORS
Edit `application.properties` to add allowed origins:
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### JWT Secret
Change in production:
```properties
jwt.secret=YOUR_SECURE_SECRET_KEY_HERE
```

## 🆘 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials
- Ensure port 8080 is available

### Frontend can't connect
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Clear browser cache and localStorage

### Database connection failed
- Verify PostgreSQL service is running
- Check database exists: `psql -U postgres -l`
- Test connection: `psql -U postgres -d shield_db`

**See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) for detailed troubleshooting.**

## 📈 Performance

- Auto-refresh intervals optimized
- Loading states prevent UI flicker
- Error handling with graceful fallback
- Token management in localStorage
- Efficient database queries

## 🎉 Success Checklist

- [ ] PostgreSQL running
- [ ] Database `shield_db` created
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can login with admin/admin123
- [ ] Dashboard shows real data
- [ ] Threats page loads data
- [ ] No console errors

## 🌟 What's Next

- [ ] WebSocket integration for real-time updates
- [ ] ML service integration for predictions
- [ ] Simulation engine implementation
- [ ] Advanced forensic analysis
- [ ] Custom dashboard builder
- [ ] Multi-tenant support

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review troubleshooting guide
3. Check browser console for errors
4. Review backend logs

## 📄 License

MIT License - See LICENSE file for details

---

**🛡️ Your S.H.I.E.L.D System is Ready for Action!**

*Built with ❤️ for cybersecurity professionals*
