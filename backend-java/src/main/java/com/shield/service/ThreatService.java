package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.integration.MLServiceClient;
import com.shield.repository.ThreatEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ThreatService {
    private final ThreatEventRepository threatRepository;
    private final MLServiceClient mlClient;

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
            "severity", threat.getSeverity(),
            "sourceIp", threat.getSourceIp()
        );
        
        MLServiceClient.MLResponse mlResponse = mlClient.analyzeAnomaly(mlData);
        threat.setAnomalyScore(mlResponse.getAnomalyScore());
        threat.setPredictedEscalation(mlResponse.getPredictedEscalation());
        threat.setRecommendedAction(mlResponse.getRecommendedAction());
        
        return threatRepository.save(threat);
    }

    public ThreatEvent updateThreat(Long id, ThreatEvent updated) {
        ThreatEvent threat = getThreatById(id);
        threat.setStatus(updated.getStatus());
        threat.setSeverity(updated.getSeverity());
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
