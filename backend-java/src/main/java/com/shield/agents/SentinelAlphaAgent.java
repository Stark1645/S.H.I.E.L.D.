package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SentinelAlphaAgent {
    private final AgentService agentService;

    public void respond(ThreatEvent threat, double riskScore, double confidence) {
        agentService.executeAgentAction(threat.getId(), "SENTINEL-ALPHA", "ISOLATE_SYSTEM");
        log.info("SENTINEL-ALPHA: Isolated system {} due to critical threat (risk={}, confidence={})", 
                threat.getTargetSystem(), riskScore, confidence);
    }
}
