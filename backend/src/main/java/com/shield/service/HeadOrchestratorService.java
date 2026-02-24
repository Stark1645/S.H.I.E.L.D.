
package com.shield.service;

import com.shield.entity.AgentDecision;
import com.shield.entity.ThreatEvent;
import com.shield.repository.AgentDecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class HeadOrchestratorService {
    
    private final AgentDecisionRepository decisionRepository;
    private final DefenseDeceptionAgentService defenseService;

    public AgentDecision orchestrateDefense(ThreatEvent threat) {
        String action;
        double confidence = 0.95;

        // Autonomous Logic Tree
        if (threat.getSeverityScore() > 9.0) {
            action = "CRITICAL ISOLATION: Network segment shutdown and traffic rerouting.";
        } else if (threat.getThreatType().contains("DDoS")) {
            action = "RATE_LIMIT: Enabling WAF global shield and dynamic scrubbers.";
        } else {
            action = "DECEPTION: Deploying bait honeypots for intent classification.";
        }

        AgentDecision decision = AgentDecision.builder()
                .agentName("HeadOrchestrator-Main")
                .decisionSummary(action)
                .confidenceScore(confidence)
                .linkedThreatId(threat.getId())
                .createdAt(LocalDateTime.now())
                .build();

        decisionRepository.save(decision);
        defenseService.executeContainment(threat, action);
        
        return decision;
    }
}
