package com.shield.service;

import com.shield.entity.AgentDecision;
import com.shield.entity.ThreatEvent;
import com.shield.repository.AgentDecisionRepository;
import com.shield.service.RiskScoringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgentService {
    private final AgentDecisionRepository decisionRepository;
    private final ThreatService threatService;
    private final RiskScoringService riskScoringService;

    public List<AgentDecision> getAllDecisions() {
        return decisionRepository.findAll();
    }

    public List<AgentDecision> getDecisionsByThreat(Long threatId) {
        return decisionRepository.findByLinkedThreatId(threatId);
    }

    public AgentDecision createDecision(AgentDecision decision) {
        decision.setStatus("EXECUTED");
        return decisionRepository.save(decision);
    }

    public AgentDecision executeAgentAction(Long threatId, String agentName, String action) {
        ThreatEvent threat = threatService.getThreatById(threatId);
        
        double finalRiskScore = riskScoringService.calculateFinalRiskScore(threat);
        double confidence = riskScoringService.calculateConfidence(
                threat.getSeverityScore() != null ? threat.getSeverityScore() / 10.0 : 0.5, 
                0.7
        );
        String attackChain = riskScoringService.detectAttackChain(threat);
        
        String enhancedReasoning = String.format(
                "Automated response: finalRiskScore=%.3f, confidence=%.3f, attackChain=%s",
                finalRiskScore, confidence, attackChain
        );
        
        AgentDecision decision = new AgentDecision();
        decision.setAgentName(agentName);
        decision.setDecisionSummary(action + " - " + enhancedReasoning);
        decision.setLinkedThreatId(threatId);
        decision.setConfidenceScore(confidence);
        decision.setStatus("EXECUTED");
        
        AgentDecision savedDecision = decisionRepository.save(decision);
        
        if (action.contains("ISOLATE") || action.contains("BLOCK")) {
            threat.setStatus("CONTAINED");
            threatService.updateThreat(threatId, threat);
            log.info("Threat {} automatically CONTAINED by agent {}", threatId, agentName);
        }
        
        log.info("Agent action executed: agent={}, action={}, threatId={}, finalRiskScore={}", 
                agentName, action, threatId, finalRiskScore);
        
        return savedDecision;
    }

    public List<AgentDecision> getDecisionsByAgent(String agentName) {
        return decisionRepository.findByAgentName(agentName);
    }
}
