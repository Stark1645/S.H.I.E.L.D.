package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import com.shield.service.ThreatService;
import com.shield.service.RiskScoringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * Enhanced Agent Coordinator with dynamic risk-based decision making
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AgentCoordinator {
    private final ThreatService threatService;
    private final AgentService agentService;
    private final RiskScoringService riskScoringService;
    private final SentinelAlphaAgent sentinelAlphaAgent;
    private final DefenderPrimeAgent defenderPrimeAgent;
    private final RiskEvaluatorAgent riskEvaluatorAgent;
    private final AnalyzerBetaAgent analyzerBetaAgent;
    private final WatcherAgent watcherAgent;
    private final OrchestratorAgent orchestratorAgent;
    private final ResolverAgent resolverAgent;

    @Scheduled(fixedDelay = 30000)
    public void coordinateAgents() {
        List<ThreatEvent> detectedThreats = threatService.getThreatsByStatus("DETECTED");
        List<ThreatEvent> activeThreats = threatService.getThreatsByStatus("ACTIVE");
        List<ThreatEvent> containedThreats = threatService.getThreatsByStatus("CONTAINED");
        
        List<ThreatEvent> allThreats = new java.util.ArrayList<>();
        allThreats.addAll(detectedThreats);
        allThreats.addAll(activeThreats);
        allThreats.addAll(containedThreats);
        
        if (allThreats.isEmpty()) {
            log.debug("No threats found for agent coordination");
            return;
        }
        
        // Calculate dynamic threshold based on current threat landscape
        double dynamicThreshold = riskScoringService.calculateDynamicThreshold();
        log.info("Agent coordination cycle started with {} threats, dynamic threshold: {}", 
                allThreats.size(), dynamicThreshold);
        
        for (ThreatEvent threat : allThreats) {
            if ("CONTAINED".equals(threat.getStatus())) {
                if (resolverAgent.shouldResolve(threat)) {
                    resolverAgent.resolve(threat);
                }
            } else {
                processThreadWithEnhancedLogic(threat, dynamicThreshold);
            }
        }
    }
    
    /**
     * Enhanced threat processing with dynamic risk scoring and confidence indicators
     */
    private void processThreadWithEnhancedLogic(ThreatEvent threat, double dynamicThreshold) {
        double finalRiskScore = riskScoringService.calculateFinalRiskScore(threat);
        
        double confidence = riskScoringService.calculateConfidence(
                threat.getSeverityScore() != null ? threat.getSeverityScore() / 10.0 : 0.5, 
                dynamicThreshold
        );
        
        String attackChainStatus = riskScoringService.detectAttackChain(threat);
        
        if (finalRiskScore > dynamicThreshold) {
            sentinelAlphaAgent.respond(threat, finalRiskScore, confidence);
            defenderPrimeAgent.respond(threat, finalRiskScore);
            
        } else if (finalRiskScore > (dynamicThreshold * 0.6)) {
            riskEvaluatorAgent.respond(threat, confidence);
            analyzerBetaAgent.respond(threat);
        } else {
            watcherAgent.respond(threat, finalRiskScore);
        }
        
        if ("POTENTIAL_ATTACK_CAMPAIGN".equals(attackChainStatus)) {
            orchestratorAgent.respond(threat, attackChainStatus);
        }
    }
}
