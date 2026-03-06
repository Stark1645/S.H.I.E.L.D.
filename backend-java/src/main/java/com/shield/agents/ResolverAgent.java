package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.repository.ThreatEventRepository;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResolverAgent {
    private final AgentService agentService;
    private final ThreatEventRepository threatRepository;

    public void resolve(ThreatEvent threat) {
        double confidence = calculateResolutionConfidence(threat);
        String reason = determineResolutionReason(threat);
        
        agentService.executeAgentAction(threat.getId(), "RESOLVER", 
            String.format("AUTO_RESOLVE (Confidence: %.2f%%, Reason: %s)", confidence * 100, reason));
        
        log.info("RESOLVER: Auto-resolved threat {} - Confidence: {}, Reason: {}", 
            threat.getId(), confidence, reason);
    }

    public boolean shouldResolve(ThreatEvent threat) {
        if (!"CONTAINED".equals(threat.getStatus())) {
            return false;
        }
        
        double confidence = calculateResolutionConfidence(threat);
        return confidence >= 0.75; // 75% confidence threshold
    }
    
    private double calculateResolutionConfidence(ThreatEvent threat) {
        double confidence = 0.0;
        LocalDateTime now = LocalDateTime.now();
        long minutesSinceContainment = ChronoUnit.MINUTES.between(threat.getTimestamp(), now);
        
        // Factor 1: Time stability (40% weight)
        double timeScore = Math.min(minutesSinceContainment / 10.0, 1.0); // Max at 10 minutes
        confidence += timeScore * 0.4;
        
        // Factor 2: Severity decay (30% weight)
        double severityScore = threat.getSeverityScore() != null ? threat.getSeverityScore() : 5.0;
        double severityFactor = 1.0 - (severityScore / 10.0); // Lower severity = higher confidence
        confidence += severityFactor * 0.3;
        
        // Factor 3: No repeat offenses (20% weight)
        List<ThreatEvent> recentThreats = threatRepository.findBySourceIPAndTimestampAfter(
            threat.getSourceIP(), now.minusHours(1));
        double repeatFactor = recentThreats.size() <= 1 ? 1.0 : 1.0 / recentThreats.size();
        confidence += repeatFactor * 0.2;
        
        // Factor 4: System load (10% weight)
        long activeThreats = threatRepository.countByStatusIn(List.of("DETECTED", "ACTIVE", "CONTAINED"));
        double loadFactor = activeThreats < 5 ? 1.0 : Math.max(0.3, 1.0 - (activeThreats / 50.0));
        confidence += loadFactor * 0.1;
        
        return Math.min(confidence, 1.0);
    }
    
    private String determineResolutionReason(ThreatEvent threat) {
        LocalDateTime now = LocalDateTime.now();
        long minutesSinceContainment = ChronoUnit.MINUTES.between(threat.getTimestamp(), now);
        
        List<ThreatEvent> recentThreats = threatRepository.findBySourceIPAndTimestampAfter(
            threat.getSourceIP(), now.minusHours(1));
        
        if (minutesSinceContainment >= 10) {
            return "Stable for 10+ minutes";
        } else if (recentThreats.size() <= 1) {
            return "No repeat offenses";
        } else if (threat.getSeverityScore() != null && threat.getSeverityScore() < 3.0) {
            return "Low severity threat";
        } else {
            return "Multi-factor analysis";
        }
    }
}
