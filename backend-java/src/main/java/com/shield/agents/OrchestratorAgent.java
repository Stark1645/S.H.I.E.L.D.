package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrchestratorAgent {
    private final AgentService agentService;

    public void respond(ThreatEvent threat, String attackChain) {
        agentService.executeAgentAction(threat.getId(), "ORCHESTRATOR", "DEPLOY_HONEYPOT");
        log.warn("ORCHESTRATOR: Deploying honeypot to trap attack campaign from {} (chain={})", 
                threat.getSourceIP(), attackChain);
    }
}
