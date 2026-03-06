# 🔍 Email Not Sending - Debug Checklist

## Issue: Threat created but email not sent

### Quick Checks:

1. **Backend Console-la itha paakanum:**
```
=== EMAIL SERVICE CALLED ===
Email enabled: true
```

Itha paakala-na, email service call-eh aagala.

---

## 🔧 Possible Issues & Fixes:

### Issue 1: Backend .env file load aagala

**Check:**
```bash
# Backend console-la itha paakanum startup-la:
spring.mail.username=jarvis16451@gmail.com
notification.email.enabled=true
```

**Fix:**
```bash
# Backend-a stop panni restart pannunga
Ctrl+C
mvn spring-boot:run
```

---

### Issue 2: Gmail App Password Wrong

**Check:**
- Password: `ztmpsljrcnagpfgm`
- Valid-aa irukka Gmail-la check pannunga

**Fix:**
```
1. Go to: https://myaccount.google.com/apppasswords
2. Verify password exists
3. If not, generate new one
4. Update .env file
5. Restart backend
```

---

### Issue 3: Gmail "Less Secure Apps" Blocked

**Check:**
```
Console-la itha paakanum:
AuthenticationFailedException
or
535-5.7.8 Username and Password not accepted
```

**Fix:**
- Use App Password (already using ✅)
- Verify 2-Step Verification is ON

---

### Issue 4: SMTP Port Blocked

**Check:**
```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

**Fix:**
- Check firewall settings
- Try port 465 (SSL) instead of 587 (TLS)

---

## 🧪 Manual Test:

### Test 1: Check Environment Variables
```bash
# Backend console-la startup logs paakanum:
notification.email.enabled : true
spring.mail.username : jarvis16451@gmail.com
```

### Test 2: Check Email Service Called
```bash
# Threat create pannumbothu console-la:
=== EMAIL SERVICE CALLED ===
Email enabled: true
From: jarvis16451@gmail.com
To: 727824tuit157@skct.edu.in,727824tuit153@skct.edu.in,727824tuit154@skct.edu.in
```

### Test 3: Check for Errors
```bash
# Console-la error irukka paakanum:
❌ FAILED to send email
Error details: [error message]
```

---

## 🔍 Debug Steps:

### Step 1: Enable Debug Logging
Already enabled in `application.properties`:
```properties
logging.level.com.shield.service.EmailService=DEBUG
logging.level.org.springframework.mail=DEBUG
```

### Step 2: Check Backend Console
Look for these messages:
```
✅ Good: "=== EMAIL SERVICE CALLED ==="
✅ Good: "Email enabled: true"
✅ Good: "Sending email..."
✅ Good: "✅ SUCCESS: Email sent"

❌ Bad: "Email notifications DISABLED"
❌ Bad: "❌ FAILED to send email"
❌ Bad: "AuthenticationFailedException"
```

### Step 3: Test SMTP Connection
```bash
# Windows PowerShell
Test-NetConnection smtp.gmail.com -Port 587
```

---

## 🚀 Quick Fix Commands:

### Fix 1: Restart Backend with Logs
```bash
cd backend-java
mvn spring-boot:run > logs.txt 2>&1
```

### Fix 2: Test Email Manually
Create this test file: `TestEmail.java`
```java
// Simple test to verify SMTP works
public class TestEmail {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                    "jarvis16451@gmail.com", 
                    "ztmpsljrcnagpfgm"
                );
            }
        });
        
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("jarvis16451@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, 
                InternetAddress.parse("727824tuit157@skct.edu.in"));
            message.setSubject("Test Email");
            message.setText("Test from S.H.I.E.L.D");
            
            Transport.send(message);
            System.out.println("✅ Email sent successfully!");
        } catch (Exception e) {
            System.out.println("❌ Failed: " + e.getMessage());
        }
    }
}
```

---

## 📋 Checklist:

- [ ] Backend restarted after .env changes
- [ ] Console shows "Email enabled: true"
- [ ] Console shows "=== EMAIL SERVICE CALLED ==="
- [ ] No authentication errors in console
- [ ] Gmail app password is valid
- [ ] Port 587 is not blocked
- [ ] Checked spam folder

---

## 🎯 Most Common Issues:

1. **Backend not restarted** after .env changes (90%)
2. **Wrong Gmail app password** (5%)
3. **Firewall blocking port 587** (3%)
4. **Email in spam folder** (2%)

---

## 📞 What to Check Now:

1. **Backend console-la enna irukku?**
   - Copy paste the logs here

2. **Itha paakuthaa?**
   ```
   === EMAIL SERVICE CALLED ===
   ```

3. **Error message irukka?**
   - Full error message copy pannunga

---

**Next Step:** Backend console logs-a paathu sollunga, enna error varuthu-nu! 🔍
