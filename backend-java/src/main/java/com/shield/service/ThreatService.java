package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.integration.MLServiceClient;
import com.shield.repository.ThreatEventRepository;
import com.shield.service.RiskScoringService;
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

    public List<ThreatEvent> getAllThreats() {
        return threatRepository.findAll();
    }

    public ThreatEvent getThreatById(Long id) {
        return threatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat not found"));
    }

    public ThreatEvent createThreat(ThreatEvent threat) {
        threat.setStatus("ACTIVE");
        
        Map<String, Object> mlData = Map.of(
            "threatType", threat.getThreatType(),
            "severityScore", threat.getSeverityScore() != null ? threat.getSeverityScore() : 5.0,
            "sourceIP", threat.getSourceIP()
        );
        
        MLServiceClient.MLResponse mlResponse = mlClient.analyzeAnomaly(mlData);
        threat.setPredictedEscalation(mlResponse.getPredictedEscalation());
        threat.setRecommendedAction(mlResponse.getRecommendedAction());
        
        ThreatEvent savedThreat = threatRepository.save(threat);
        
        double finalRiskScore = riskScoringService.calculateFinalRiskScore(savedThreat);
        String attackChain = riskScoringService.detectAttackChain(savedThreat);
        
        log.info("Threat created: id={}, severityScore={}, finalRiskScore={}, attackChain={}", 
                savedThreat.getId(), savedThreat.getSeverityScore(), finalRiskScore, attackChain);
        
        return savedThreat;
    }

    public ThreatEvent updateThreat(Long id, ThreatEvent updated) {
        ThreatEvent threat = getThreatById(id);
        threat.setStatus(updated.getStatus());
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
