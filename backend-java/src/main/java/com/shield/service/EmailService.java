package com.shield.service;

import com.shield.entity.ThreatEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${notification.email.to}")
    private String notificationEmail;
    
    @Value("${notification.email.from}")
    private String fromEmail;
    
    @Value("${notification.email.enabled:false}")
    private boolean emailEnabled;
    
    public void sendThreatAlert(ThreatEvent threat) {
        log.info("=== EMAIL SERVICE CALLED ===");
        log.info("Email enabled: {}", emailEnabled);
        log.info("From: {}", fromEmail);
        log.info("To: {}", notificationEmail);
        
        if (!emailEnabled) {
            log.warn("Email notifications DISABLED. Threat alert not sent for: {}", threat.getId());
            return;
        }
        
        try {
            log.info("Preparing to send email for threat ID: {}", threat.getId());
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            
            // Send to multiple recipients
            String[] recipients = notificationEmail.split(",");
            log.info("Recipients: {}", String.join(", ", recipients));
            message.setTo(recipients);
            
            message.setSubject("🚨 THREAT ALERT: " + threat.getThreatType());
            message.setText(buildEmailBody(threat));
            
            log.info("Sending email...");
            mailSender.send(message);
            log.info("✅ SUCCESS: Email sent to {} recipients for threat ID: {}", recipients.length, threat.getId());
        } catch (Exception e) {
            log.error("❌ FAILED to send email for threat ID: {}", threat.getId(), e);
            log.error("Error details: {}", e.getMessage());
        }
    }
    
    private String buildEmailBody(ThreatEvent threat) {
        return String.format("""
            🚨 THREAT ALERT 🚨
            
            A new threat has been detected in S.H.I.E.L.D system!
            
            Threat Type: %s
            Source IP: %s
            Target: %s
            Severity: %.1f/10
            Time: %s
            
            Please review immediately in the S.H.I.E.L.D dashboard.
            
            ---
            S.H.I.E.L.D Cybersecurity System
            """,
            threat.getThreatType(),
            threat.getSourceIP(),
            threat.getTargetSystem(),
            threat.getSeverityScore(),
            threat.getTimestamp()
        );
    }
}
