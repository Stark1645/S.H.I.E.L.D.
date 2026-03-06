package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.integration.MLServiceClient;
import com.shield.repository.ThreatEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatService {
    private final ThreatEventRepository threatRepository;
    private final MLServiceClient mlClient;
    private final RiskScoringService riskScoringService;
    private final EmailService emailService;
    private final WebSocketService webSocketService;
    private final SIEMIntegrationService siemService;

    public List<ThreatEvent> getAllThreats() {
        return threatRepository.findAll();
    }

    public ThreatEvent getThreatById(Long id) {
        return threatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat not found"));
    }

    public ThreatEvent createThreat(ThreatEvent threat) {
        log.info("=== CREATE THREAT CALLED ===");
        log.info("Threat details: type={}, source={}, severity={}", 
            threat.getThreatType(), threat.getSourceIP(), threat.getSeverityScore());
        
        if (threat == null) {
            throw new IllegalArgumentException("Threat cannot be null");
        }
        
        if (threat.getStatus() == null || threat.getStatus().isEmpty()) {
            threat.setStatus("DETECTED");
        }
        if (threat.getTimestamp() == null) {
            threat.setTimestamp(LocalDateTime.now());
        }
        
        Map<String, Object> mlData = Map.of(
            "threatType", threat.getThreatType() != null ? threat.getThreatType() : "UNKNOWN",
            "severityScore", threat.getSeverityScore() != null ? threat.getSeverityScore() : 5.0,
            "sourceIP", threat.getSourceIP() != null ? threat.getSourceIP() : "0.0.0.0"
        );
        
        MLServiceClient.MLResponse mlResponse = mlClient.analyzeAnomaly(mlData);
        if (mlResponse != null) {
            threat.setPredictedEscalation(mlResponse.getPredictedEscalation());
            threat.setRecommendedAction(mlResponse.getRecommendedAction());
        }
        
        ThreatEvent savedThreat = threatRepository.save(threat);
        
        double finalRiskScore = riskScoringService.calculateFinalRiskScore(savedThreat);
        String attackChain = riskScoringService.detectAttackChain(savedThreat);
        
        log.info("Threat created: id={}, severityScore={}, finalRiskScore={}, attackChain={}", 
                savedThreat.getId(), savedThreat.getSeverityScore(), finalRiskScore, attackChain);
        
        // Send email notification
        log.info("=== CALLING EMAIL SERVICE ===");
        emailService.sendThreatAlert(savedThreat);
        log.info("=== EMAIL SERVICE CALL COMPLETED ===");
        
        // Send WebSocket notification
        webSocketService.sendThreatAlert(savedThreat);
        
        // Send to SIEM systems
        siemService.broadcastThreat(savedThreat);
        
        return savedThreat;
    }

    public ThreatEvent updateThreat(Long id, ThreatEvent updated) {
        if (id == null || updated == null) {
            throw new IllegalArgumentException("ID and updated threat cannot be null");
        }
        
        ThreatEvent threat = getThreatById(id);
        
        if (updated.getStatus() != null) {
            threat.setStatus(updated.getStatus());
        }
        if (updated.getSeverityScore() != null) {
            threat.setSeverityScore(updated.getSeverityScore());
        }
        if ("RESOLVED".equals(updated.getStatus())) {
            threat.setResolvedAt(LocalDateTime.now());
        }
        return threatRepository.save(threat);
    }

    public void deleteThreat(Long id) {
        threatRepository.deleteById(id);
    }

    public List<ThreatEvent> getThreatsByStatus(String status) {
        return threatRepository.findByStatus(status);
    }
}
