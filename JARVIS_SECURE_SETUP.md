# JARVIS Secure Setup - Quick Reference

## 🔒 Secure Setup (3 Steps)

### Step 1: Run Setup Script
```bash
setup-jarvis-secure.bat
```

### Step 2: Get API Key
Visit: https://makersuite.google.com/app/apikey

### Step 3: Configure
Edit: `backend-java/src/main/resources/application-secrets.properties`
```properties
gemini.api.key=your_actual_key_here
```

## ✅ Security Checklist

- [x] application-secrets.properties in .gitignore
- [x] Template file provided
- [x] Never commit actual keys
- [x] Environment variable support
- [x] Fallback mode available

## 📁 Files

| File | Purpose | Git Status |
|------|---------|------------|
| `application-secrets.properties.template` | Template | ✅ Committed |
| `application-secrets.properties` | Your keys | ❌ Ignored |
| `setup-jarvis-secure.bat` | Setup script | ✅ Committed |

## 🚀 Quick Commands

**Setup:**
```bash
setup-jarvis-secure.bat
```

**Start with env var:**
```bash
set GEMINI_API_KEY=your_key
mvn spring-boot:run
```

**Check status:**
```bash
curl http://localhost:8080/api/jarvis/status
```

## 🔐 Security Best Practices

1. ✅ Use `application-secrets.properties` for local dev
2. ✅ Use environment variables for production
3. ✅ Never commit API keys
4. ✅ Rotate keys regularly
5. ✅ Monitor API usage

## 🆘 Troubleshooting

**Key not working?**
- Check file name: `application-secrets.properties` (no .template)
- Check location: `backend-java/src/main/resources/`
- Restart backend after adding key

**File not found?**
- Run `setup-jarvis-secure.bat`
- Or manually copy template

**Still not working?**
- Use environment variable: `set GEMINI_API_KEY=your_key`
- Check JARVIS_INTEGRATION_GUIDE.md for details
