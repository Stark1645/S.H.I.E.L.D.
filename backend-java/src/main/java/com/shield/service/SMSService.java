package com.shield.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class SMSService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String fromPhone;

    @Value("${notification.sms.enabled:false}")
    private boolean smsEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendThreatAlert(String toPhone, String threatType, Double severity) {
        if (!smsEnabled || accountSid.isEmpty()) {
            System.out.println("SMS disabled or not configured");
            return;
        }

        String message = String.format(
            "🚨 S.H.I.E.L.D ALERT: %s detected! Severity: %.1f/10. Check dashboard immediately.",
            threatType, severity
        );

        sendSMS(toPhone, message);
    }

    public void sendCriticalAlert(String toPhone, String message) {
        if (!smsEnabled || accountSid.isEmpty()) {
            System.out.println("SMS disabled or not configured");
            return;
        }
        sendSMS(toPhone, "🚨 CRITICAL: " + message);
    }

    private void sendSMS(String toPhone, String message) {
        try {
            String url = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", accountSid);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(accountSid, authToken);

            String body = String.format("To=%s&From=%s&Body=%s", toPhone, fromPhone, message);
            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(url, entity, String.class);
            System.out.println("SMS sent to: " + toPhone);
        } catch (Exception e) {
            System.err.println("SMS send failed: " + e.getMessage());
        }
    }
}
