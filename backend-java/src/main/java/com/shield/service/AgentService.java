package com.shield.service;

import com.shield.dto.AgentInfo;
import com.shield.entity.AgentDecision;
import com.shield.entity.ThreatEvent;
import com.shield.repository.AgentDecisionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
        if (threatId == null || agentName == null || action == null) {
            throw new IllegalArgumentException("ThreatId, agentName, and action cannot be null");
        }
        
        ThreatEvent threat = threatService.getThreatById(threatId);
        
        // Update threat to ACTIVE when agents start processing
        if ("DETECTED".equals(threat.getStatus())) {
            threat.setStatus("ACTIVE");
            threatService.updateThreat(threatId, threat);
        }
        
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
        
        // Update threat to CONTAINED when remediation actions are taken
        if (action.contains("ISOLATE") || action.contains("BLOCK")) {
            threat.setStatus("CONTAINED");
            threatService.updateThreat(threatId, threat);
            log.info("Threat {} automatically CONTAINED by agent {}", threatId, agentName);
        }
        
        // Update threat to RESOLVED when auto-resolved
        if (action.contains("AUTO_RESOLVE")) {
            threat.setStatus("RESOLVED");
            threat.setResolvedAt(java.time.LocalDateTime.now());
            threatService.updateThreat(threatId, threat);
            log.info("Threat {} automatically RESOLVED by agent {}", threatId, agentName);
        }
        
        log.info("Agent action executed: agent={}, action={}, threatId={}, finalRiskScore={}", 
                agentName, action, threatId, finalRiskScore);
        
        return savedDecision;
    }

    public List<AgentDecision> getDecisionsByAgent(String agentName) {
        return decisionRepository.findByAgentName(agentName);
    }

    public List<AgentInfo> getAllAgents() {
        List<AgentInfo> agents = new java.util.ArrayList<>();
        String[] agentNames = {"SENTINEL-ALPHA", "DEFENDER-PRIME", "RISK-EVALUATOR", "ANALYZER-BETA", "WATCHER", "ORCHESTRATOR", "RESOLVER"};
        String[] displayNames = {"Sentinel Alpha", "Defender Prime", "Risk Evaluator", "Analyzer Beta", "Watcher", "Orchestrator", "Resolver"};
        String[] descriptions = {
            "System isolation and containment specialist",
            "Network perimeter defense and IP blocking",
            "Threat assessment and surveillance escalation",
            "Deep packet inspection and forensic analysis",
            "Continuous monitoring and activity logging",
            "Honeypot deployment and deception tactics",
            "Auto-resolution of contained threats after timeout"
        };
        
        // Get active threats that agents are currently processing
        List<ThreatEvent> activeThreats = threatService.getThreatsByStatus("DETECTED");
        activeThreats.addAll(threatService.getThreatsByStatus("ACTIVE"));
        activeThreats.addAll(threatService.getThreatsByStatus("CONTAINED"));
        
        for (int i = 0; i < agentNames.length; i++) {
            List<AgentDecision> allDecisions = getDecisionsByAgent(agentNames[i]);
            double avgConfidence = allDecisions.isEmpty() ? 0.0 : 
                allDecisions.stream().mapToDouble(AgentDecision::getConfidenceScore).average().orElse(0.0);
            
            // Agent is active if there are threats to process or recent decisions
            boolean isActive = !activeThreats.isEmpty() || 
                (!allDecisions.isEmpty() && 
                 allDecisions.get(0).getCreatedAt().isAfter(java.time.LocalDateTime.now().minusMinutes(1)));
            
            String status = isActive ? "Active" : "Standby";
            
            agents.add(new AgentInfo(
                agentNames[i], displayNames[i], descriptions[i], 
                status, allDecisions.size(), avgConfidence
            ));
        }
        
        return agents;
    }

    public Map<String, Object> getAgentHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        String[] agentNames = {"SENTINEL-ALPHA", "DEFENDER-PRIME", "RISK-EVALUATOR", "ANALYZER-BETA", "WATCHER", "ORCHESTRATOR", "RESOLVER"};
        
        // Get active threats that agents are currently processing
        List<ThreatEvent> activeThreats = threatService.getThreatsByStatus("DETECTED");
        activeThreats.addAll(threatService.getThreatsByStatus("ACTIVE"));
        activeThreats.addAll(threatService.getThreatsByStatus("CONTAINED"));
        
        int activeAgents = 0;
        health.put("totalAgents", agentNames.length);
        
        Map<String, Object> agentStatus = new HashMap<>();
        for (String agentName : agentNames) {
            List<AgentDecision> allDecisions = getDecisionsByAgent(agentName);
            
            // Agent is active if there are threats to process or very recent decisions (1 minute)
            boolean isActive = !activeThreats.isEmpty() || 
                (!allDecisions.isEmpty() && 
                 allDecisions.get(0).getCreatedAt().isAfter(java.time.LocalDateTime.now().minusMinutes(1)));
            
            if (isActive) activeAgents++;
            
            Map<String, Object> status = new HashMap<>();
            status.put("connected", true);
            status.put("active", isActive);
            status.put("totalDecisions", allDecisions.size());
            status.put("threatsToProcess", activeThreats.size());
            status.put("lastActive", allDecisions.isEmpty() ? null : allDecisions.get(0).getCreatedAt());
            agentStatus.put(agentName, status);
        }
        
        health.put("activeAgents", activeAgents);
        health.put("status", activeAgents > 0 ? "OPERATIONAL" : "STANDBY");
        health.put("agents", agentStatus);
        return health;
    }
}
