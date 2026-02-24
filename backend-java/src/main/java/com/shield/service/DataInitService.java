package com.shield.service;

import com.shield.entity.AgentDecision;
import com.shield.entity.ThreatEvent;
import com.shield.entity.User;
import com.shield.repository.AgentDecisionRepository;
import com.shield.repository.ThreatEventRepository;
import com.shield.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitService implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ThreatEventRepository threatEventRepository;
    private final AgentDecisionRepository agentDecisionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting data initialization...");
        
        try {
            if (userRepository.count() == 0) {
                log.info("Creating admin user...");
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                log.info("Admin user created successfully");
                
                log.info("Creating Nick Fury (Level 20 Director)...");
                User nickFury = new User();
                nickFury.setUsername("nickfury");
                nickFury.setPassword(passwordEncoder.encode("director123"));
                nickFury.setRole("DIRECTOR");
                userRepository.save(nickFury);
                log.info("Nick Fury created successfully");
            } else {
                log.info("Users already exist, skipping user creation");
            }

            if (threatEventRepository.count() == 0) {
                log.info("Creating sample threats...");
                
                ThreatEvent t1 = new ThreatEvent();
                t1.setSourceIP("104.18.23.45");
                t1.setTargetSystem("API-Gateway-Primary");
                t1.setThreatType("DDoS / SYN Flood");
                t1.setSeverityScore(9.4);
                t1.setIntentClassification("Resource Exhaustion");
                t1.setStatus("CONTAINED");
                t1.setTimestamp(LocalDateTime.now());
                threatEventRepository.save(t1);

                ThreatEvent t2 = new ThreatEvent();
                t2.setSourceIP("192.168.1.101");
                t2.setTargetSystem("User-DB-Master");
                t2.setThreatType("SQL Injection");
                t2.setSeverityScore(8.7);
                t2.setIntentClassification("Data Exfiltration");
                t2.setStatus("DETECTED");
                t2.setTimestamp(LocalDateTime.now());
                threatEventRepository.save(t2);

                ThreatEvent t3 = new ThreatEvent();
                t3.setSourceIP("45.132.8.12");
                t3.setTargetSystem("Worker-Node-07");
                t3.setThreatType("Reverse Shell");
                t3.setSeverityScore(9.8);
                t3.setIntentClassification("System Takeover");
                t3.setStatus("SIMULATED");
                t3.setTimestamp(LocalDateTime.now());
                threatEventRepository.save(t3);

                ThreatEvent t4 = new ThreatEvent();
                t4.setSourceIP("172.24.5.11");
                t4.setTargetSystem("Auth-Cluster");
                t4.setThreatType("Credential Stuffing");
                t4.setSeverityScore(6.2);
                t4.setIntentClassification("Account Takeover");
                t4.setStatus("RESOLVED");
                t4.setTimestamp(LocalDateTime.now());
                threatEventRepository.save(t4);
                
                log.info("Sample threats created successfully");
            } else {
                log.info("Threats already exist, skipping threat creation");
            }

            if (agentDecisionRepository.count() == 0) {
                log.info("Creating sample agent decisions...");
                
                AgentDecision d1 = new AgentDecision();
                d1.setAgentName("Sentinel-Alpha");
                d1.setDecisionSummary("Isolating System-04 due to anomalous outbound traffic.");
                d1.setConfidenceScore(0.98);
                d1.setLinkedThreatId(1L);
                d1.setCreatedAt(LocalDateTime.now());
                agentDecisionRepository.save(d1);

                AgentDecision d2 = new AgentDecision();
                d2.setAgentName("Risk-Evaluator");
                d2.setDecisionSummary("Upgraded Threat Level to CRITICAL for IP 192.168.1.45.");
                d2.setConfidenceScore(0.85);
                d2.setLinkedThreatId(2L);
                d2.setCreatedAt(LocalDateTime.now());
                agentDecisionRepository.save(d2);

                AgentDecision d3 = new AgentDecision();
                d3.setAgentName("Orchestrator");
                d3.setDecisionSummary("Deploying Deceptive Honeypot nodes in Sector G.");
                d3.setConfidenceScore(0.92);
                d3.setLinkedThreatId(3L);
                d3.setCreatedAt(LocalDateTime.now());
                agentDecisionRepository.save(d3);
                
                log.info("Sample agent decisions created successfully");
            } else {
                log.info("Agent decisions already exist, skipping creation");
            }
            
            log.info("Data initialization completed successfully!");
        } catch (Exception e) {
            log.error("Error during data initialization", e);
        }
    }
}
