# JARVIS AI Integration Guide

## 🤖 Overview

JARVIS (Just A Rather Very Intelligent System) is an AI-powered assistant integrated into S.H.I.E.L.D using Google's Gemini API. It provides intelligent threat analysis, system recommendations, and natural language interactions.

---

## 🚀 Quick Setup (Secure Method)

### Method 1: Automated Setup (Recommended)

1. **Run the secure setup script:**
```bash
setup-jarvis-secure.bat
```

2. **Get your Gemini API key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy your key

3. **Configure the secrets file:**
   - Open: `backend-java/src/main/resources/application-secrets.properties`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key
   - Save the file

4. **Restart backend:**
```bash
cd backend-java
mvn spring-boot:run
```

### Method 2: Manual Setup

1. **Copy the template:**
```bash
cd backend-java/src/main/resources
copy application-secrets.properties.template application-secrets.properties
```

2. **Edit application-secrets.properties:**
```properties
gemini.api.key=your_actual_api_key_here
```

3. **Restart backend**

### Method 3: Environment Variable

**Windows:**
```bash
set GEMINI_API_KEY=your_api_key_here
mvn spring-boot:run
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY=your_api_key_here
mvn spring-boot:run
```

### 🔒 Security Features

✅ **application-secrets.properties** is in .gitignore  
✅ **Never committed to Git**  
✅ **Template file provided** for easy setup  
✅ **Environment variable support**  
✅ **Fallback mode** if key not configured

---

## 🎯 Features

### 1. Threat Analysis
- **Endpoint:** `POST /api/jarvis/analyze-threat/{id}`
- **Function:** Analyzes specific threats with AI insights
- **Returns:** Analysis, recommendations, severity assessment

### 2. System Recommendations
- **Endpoint:** `GET /api/jarvis/system-recommendations`
- **Function:** Provides system-wide security recommendations
- **Returns:** Summary, priority actions, overall assessment

### 3. Natural Language Chat
- **Endpoint:** `POST /api/jarvis/ask`
- **Function:** Ask JARVIS anything about your system
- **Returns:** Intelligent responses based on context

### 4. Status Check
- **Endpoint:** `GET /api/jarvis/status`
- **Function:** Check JARVIS availability
- **Returns:** Status, version, capabilities

---

## 💬 Using JARVIS Chat

### Opening Chat
Click the floating robot button (bottom-right corner)

### Quick Actions
- **Analyze System** - Get current security status
- **Threat Summary** - Summarize active threats
- **Recommendations** - Get security recommendations

### Custom Questions
Type any question:
- "What are the most critical threats?"
- "How can I improve system security?"
- "Explain the latest attack pattern"
- "What should I do about threat #5?"

---

## 🔧 API Examples

### Analyze Specific Threat

```bash
curl -X POST http://localhost:8080/api/jarvis/analyze-threat/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "analysis": "This SQL Injection attack from 192.168.1.100 poses a critical threat...",
  "recommendations": [
    "Isolate compromised system",
    "Block malicious IP address",
    "Enable enhanced monitoring"
  ],
  "severity": "CRITICAL",
  "confidence": 0.92
}
```

### Get System Recommendations

```bash
curl http://localhost:8080/api/jarvis/system-recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "summary": "JARVIS System Analysis: 5 active threats detected...",
  "actions": [
    "Review and update firewall rules",
    "Conduct comprehensive security audit",
    "Enable advanced threat detection"
  ],
  "priority": "HIGH"
}
```

### Ask JARVIS

```bash
curl -X POST http://localhost:8080/api/jarvis/ask \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the top 3 security priorities?",
    "context": "S.H.I.E.L.D Threat Monitoring System"
  }'
```

**Response:**
```json
{
  "response": "Based on current threat landscape, your top 3 priorities are...",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## 🎨 Frontend Integration

### Component Location
`components/JarvisChat.tsx`

### Features
- ✅ Floating chat button
- ✅ Expandable chat window
- ✅ Message history
- ✅ Quick action buttons
- ✅ Typing indicators
- ✅ Dark/Light mode support
- ✅ Real-time responses

### Customization

**Change Position:**
```tsx
// In JarvisChat.tsx
className="fixed bottom-6 right-6"  // Change to left-6 for left side
```

**Change Colors:**
```tsx
// Gradient colors
from-cyan-600 to-blue-600  // Change to your preferred colors
```

---

## 🔒 Security

### API Key Protection
✅ **Never commit API keys to Git**  
✅ **Use application-secrets.properties** (in .gitignore)  
✅ **Use environment variables** for production  
✅ **Template file provided** for easy setup  
✅ **Rotate keys regularly**  
✅ **Monitor API usage**

### Secure Setup Methods

**1. Secrets File (Recommended for Development):**
```bash
setup-jarvis-secure.bat
# Edit application-secrets.properties with your key
```

**2. Environment Variable (Recommended for Production):**
```bash
export GEMINI_API_KEY=your_key
```

**3. System Properties:**
```bash
mvn spring-boot:run -Dgemini.api.key=your_key
```

### What's Protected

✅ `application-secrets.properties` - In .gitignore  
✅ `secrets.properties` - In .gitignore  
✅ `.env` files - In .gitignore  
✅ Environment variables - Not in code

### Rate Limiting
Gemini API has rate limits:
- **Free tier:** 60 requests/minute
- **Paid tier:** Higher limits

### Error Handling
JARVIS includes fallback responses when:
- API key is missing
- API is unavailable
- Rate limit exceeded

---

## 🧪 Testing

### Test JARVIS Status

```bash
curl http://localhost:8080/api/jarvis/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Without API Key
JARVIS will use fallback mode with pre-defined responses.

### Test Chat Interface
1. Login to S.H.I.E.L.D
2. Click robot icon
3. Try quick actions
4. Ask custom questions

---

## 📊 Backend Architecture

### Service Layer
`JarvisAIService.java`
- Handles Gemini API calls
- Provides fallback responses
- Formats prompts
- Extracts insights

### Controller Layer
`JarvisController.java`
- REST endpoints
- Request validation
- Response formatting
- Error handling

### Integration Flow
```
Frontend → JarvisController → JarvisAIService → Gemini API
                                      ↓
                              Fallback Responses
```

---

## 🎯 Use Cases

### 1. Threat Investigation
**User:** "Analyze threat #5"  
**JARVIS:** Provides detailed analysis with recommendations

### 2. Security Audit
**User:** "What are my security weaknesses?"  
**JARVIS:** Lists vulnerabilities and mitigation steps

### 3. Incident Response
**User:** "How should I respond to this DDoS attack?"  
**JARVIS:** Provides step-by-step response plan

### 4. System Optimization
**User:** "How can I improve detection accuracy?"  
**JARVIS:** Suggests configuration changes and best practices

---

## 🔄 Fallback Mode

When Gemini API is unavailable, JARVIS uses intelligent fallback responses:

### Threat Analysis Fallback
- Uses threat data from database
- Provides standard recommendations
- Calculates severity from threat score

### System Recommendations Fallback
- Counts active threats
- Provides general security advice
- Prioritizes based on threat count

### Chat Fallback
- Returns helpful offline message
- Suggests checking API configuration

---

## 📈 Future Enhancements

### Planned Features
- [ ] Voice interaction
- [ ] Threat prediction
- [ ] Automated remediation suggestions
- [ ] Multi-language support
- [ ] Custom training on your data
- [ ] Integration with other AI models
- [ ] Conversation history persistence
- [ ] Export chat transcripts

---

## 🐛 Troubleshooting

### JARVIS Not Responding

**Check API Key:**
```bash
# In application.properties
gemini.api.key=YOUR_KEY_HERE
```

**Check Backend Logs:**
```bash
# Look for Gemini API errors
tail -f backend-java/logs/spring.log
```

**Test API Key:**
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Chat Window Not Opening

**Check Console:**
- Open browser DevTools (F12)
- Look for JavaScript errors
- Check network tab for API calls

**Verify Component:**
```tsx
// In App.tsx, ensure JarvisChat is imported and rendered
<JarvisChat isDarkMode={isDarkMode} />
```

### Slow Responses

**Causes:**
- Gemini API latency
- Network issues
- Rate limiting

**Solutions:**
- Use fallback mode for instant responses
- Implement response caching
- Upgrade to paid Gemini tier

---

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [S.H.I.E.L.D Documentation](./README.md)
- [API Reference](./API_REFERENCE.md)

---

## ✅ Checklist

- [ ] Obtained Gemini API key
- [ ] Added key to application.properties
- [ ] Restarted backend
- [ ] Tested JARVIS status endpoint
- [ ] Opened chat interface
- [ ] Tried quick actions
- [ ] Asked custom questions
- [ ] Verified responses

---

## 🎉 Success!

JARVIS is now integrated into your S.H.I.E.L.D system!

**Try asking:**
- "What's the current threat landscape?"
- "Analyze the most recent attack"
- "Give me security recommendations"
- "How can I improve system performance?"

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready
