package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WatcherAgent {
    private final AgentService agentService;

    public void respond(ThreatEvent threat, double riskScore) {
        agentService.executeAgentAction(threat.getId(), "WATCHER", "LOG_ACTIVITY");
        log.info("WATCHER: Logging low-risk activity from {} to {} (risk={})", 
                threat.getSourceIP(), threat.getTargetSystem(), riskScore);
    }
}
