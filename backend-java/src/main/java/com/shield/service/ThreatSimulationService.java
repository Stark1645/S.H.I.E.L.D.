package com.shield.service;

import com.shield.entity.ThreatEvent;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ThreatSimulationService {

    private final ThreatService threatService;
    private final WebSocketService webSocketService;

    private static final String[] THREAT_TYPES = {
        "DDoS Attack", "SQL Injection", "XSS Attack", "Brute Force", 
        "Ransomware", "Phishing", "Zero-Day Exploit", "Man-in-the-Middle"
    };

    private static final String[] ATTACK_VECTORS = {
        "Web Application", "Database", "Email Gateway", "API Endpoint",
        "Network Layer", "Authentication System", "File Server", "DNS Server"
    };

    public ThreatSimulationService(ThreatService threatService, WebSocketService webSocketService) {
        this.threatService = threatService;
        this.webSocketService = webSocketService;
    }

    public ThreatEvent simulateThreat(String threatType, Double severity) {
        ThreatEvent threat = new ThreatEvent();
        threat.setThreatType(threatType != null ? threatType : getRandomThreatType());
        threat.setSourceIP(generateRandomIP());
        threat.setTargetSystem(getRandomTarget());
        threat.setSeverityScore(severity != null ? severity : generateRandomSeverity());
        threat.setStatus("DETECTED");
        threat.setDetectedAt(LocalDateTime.now());
        threat.setDescription("Simulated threat for testing purposes");
        threat.setAnomalyScore(ThreadLocalRandom.current().nextDouble(0.5, 1.0));
        threat.setConfidenceLevel(ThreadLocalRandom.current().nextDouble(0.7, 0.99));
        
        ThreatEvent saved = threatService.createThreat(threat);
        webSocketService.sendThreatAlert(saved);
        return saved;
    }

    public List<ThreatEvent> simulateAttackCampaign(int count) {
        List<ThreatEvent> threats = new ArrayList<>();
        String sourceIP = generateRandomIP();
        String threatType = getRandomThreatType();
        
        for (int i = 0; i < count; i++) {
            ThreatEvent threat = new ThreatEvent();
            threat.setThreatType(threatType);
            threat.setSourceIP(sourceIP);
            threat.setTargetSystem(getRandomTarget());
            threat.setSeverityScore(generateRandomSeverity());
            threat.setStatus("DETECTED");
            threat.setDetectedAt(LocalDateTime.now());
            threat.setDescription("Part of simulated attack campaign");
            threat.setAnomalyScore(ThreadLocalRandom.current().nextDouble(0.6, 1.0));
            threat.setConfidenceLevel(ThreadLocalRandom.current().nextDouble(0.75, 0.95));
            
            ThreatEvent saved = threatService.createThreat(threat);
            threats.add(saved);
            webSocketService.sendThreatAlert(saved);
        }
        
        return threats;
    }

    private String getRandomThreatType() {
        return THREAT_TYPES[ThreadLocalRandom.current().nextInt(THREAT_TYPES.length)];
    }

    private String getRandomTarget() {
        return ATTACK_VECTORS[ThreadLocalRandom.current().nextInt(ATTACK_VECTORS.length)];
    }

    private String generateRandomIP() {
        return String.format("%d.%d.%d.%d",
            ThreadLocalRandom.current().nextInt(1, 256),
            ThreadLocalRandom.current().nextInt(0, 256),
            ThreadLocalRandom.current().nextInt(0, 256),
            ThreadLocalRandom.current().nextInt(1, 256)
        );
    }

    private Double generateRandomSeverity() {
        return ThreadLocalRandom.current().nextDouble(3.0, 10.0);
    }
}
