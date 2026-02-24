package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RiskEvaluatorAgent {
    private final AgentService agentService;

    public void respond(ThreatEvent threat, double confidence) {
        agentService.executeAgentAction(threat.getId(), "RISK-EVALUATOR", "INCREASE_SURVEILLANCE");
        log.info("RISK-EVALUATOR: Increased surveillance on {} from {} (confidence={})", 
                threat.getTargetSystem(), threat.getSourceIP(), confidence);
    }
}
