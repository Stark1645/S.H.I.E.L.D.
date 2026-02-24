package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DefenderPrimeAgent {
    private final AgentService agentService;

    public void respond(ThreatEvent threat, double riskScore) {
        agentService.executeAgentAction(threat.getId(), "DEFENDER-PRIME", "BLOCK_IP");
        log.info("DEFENDER-PRIME: Blocked malicious IP {} targeting {} (risk={})", 
                threat.getSourceIP(), threat.getTargetSystem(), riskScore);
    }
}
