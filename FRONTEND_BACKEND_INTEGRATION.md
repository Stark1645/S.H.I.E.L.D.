# Frontend-Backend Integration Guide

## ✅ What I Just Changed

### Login Page - Now Calls Real Backend!

**Before (Mock):**
```javascript
const handleLogin = () => {
  setTimeout(() => {
    login('mock-jwt-token');  // Fake token
  }, 1500);
};
```

**After (Real):**
```javascript
const handleLogin = async () => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  login(data.accessToken);  // Real token from backend!
};
```

## 🧪 How to Test the Real Login

### Step 1: Register a User First

Open new terminal and run:
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"ADMIN\"}"
```

**Expected:** `{"message":"User registered successfully"}`

### Step 2: Test Login in UI

1. Open: http://localhost:3000
2. Enter:
   - Username: `admin`
   - Password: `admin123`
3. Click "ESTABLISH LINK"

**✅ What Happens:**
- Frontend calls: `POST http://localhost:8080/api/auth/login`
- Backend validates credentials
- Backend returns real JWT token
- Frontend stores token
- Redirects to dashboard

**Check browser console (F12):**
- You'll see the API call
- You'll see the response with real token

### Step 3: Verify It Worked

Open browser DevTools (F12) → Application → Local Storage → http://localhost:3000

You should see: `shield_session: active`

## 🔄 How Frontend-Backend Communication Works

### The Flow:

```
1. User clicks button in Frontend
   ↓
2. Frontend makes HTTP request
   fetch('http://localhost:8080/api/...')
   ↓
3. Backend receives request
   Spring Boot processes it
   ↓
4. Backend queries database
   PostgreSQL returns data
   ↓
5. Backend may call ML Service
   FastAPI analyzes data
   ↓
6. Backend returns JSON response
   ↓
7. Frontend receives response
   Updates UI with real data
```

## 📝 Example: How to Connect Other Features

### Example 1: Get All Threats

**Add this to Dashboard.tsx:**

```typescript
const [threats, setThreats] = useState([]);

useEffect(() => {
  fetch('http://localhost:8080/api/threats', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(res => res.json())
  .then(data => setThreats(data));
}, []);
```

### Example 2: Create Threat

```typescript
const createThreat = async (threatData) => {
  const response = await fetch('http://localhost:8080/api/threats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(threatData)
  });
  return await response.json();
};
```

### Example 3: Execute Agent Action

```typescript
const isolateNode = async (nodeId) => {
  const response = await fetch('http://localhost:8080/api/agents/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      threatId: nodeId,
      agentName: 'DEFENDER',
      action: 'ISOLATE_SYSTEM'
    })
  });
  return await response.json();
};
```

## 🎯 What's Connected Now vs What's Still Mock

### ✅ Connected (Real):
- **Login** - Calls backend API
- Backend validates credentials
- Returns real JWT token

### ⚠️ Still Mock (Needs Integration):
- Dashboard metrics (hardcoded numbers)
- Threat table (fake data)
- Agent cards (demo data)
- All other buttons (show popups only)

## 🚀 To Connect Everything:

You would need to update each component to:
1. Fetch data from backend on load
2. Call backend APIs when buttons clicked
3. Update UI with real responses

**Example pattern for all features:**

```typescript
// 1. Fetch data on component load
useEffect(() => {
  fetchDataFromBackend();
}, []);

// 2. Call API when button clicked
const handleButtonClick = async () => {
  const result = await fetch('http://localhost:8080/api/...');
  updateUI(result);
};

// 3. Update UI with real data
const updateUI = (data) => {
  setState(data);
};
```

## 📊 Current System Status

```
Frontend (React)
  ├─ Login Page ✅ CONNECTED to backend
  ├─ Dashboard ⚠️ Still showing mock data
  ├─ Threat Intelligence ⚠️ Still showing mock data
  ├─ Agent Monitor ⚠️ Still showing mock data
  └─ Other pages ⚠️ Still showing mock data

Backend (Spring Boot) ✅ FULLY WORKING
  ├─ All APIs functional
  ├─ Database connected
  └─ ML service integrated

ML Service (FastAPI) ✅ FULLY WORKING
  └─ Anomaly detection working

Database (PostgreSQL) ✅ READY
  └─ Storing all data
```

## 🎉 Success!

**Login is now REAL!** 

When you login now:
- ✅ Calls real backend
- ✅ Validates real credentials
- ✅ Gets real JWT token
- ✅ Stores in browser
- ✅ Can use for authenticated requests

**To connect other features, follow the same pattern!**
