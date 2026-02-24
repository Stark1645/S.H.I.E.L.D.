package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyzerBetaAgent {
    private final AgentService agentService;

    public void respond(ThreatEvent threat) {
        agentService.executeAgentAction(threat.getId(), "ANALYZER-BETA", "DEEP_PACKET_INSPECTION");
        log.info("ANALYZER-BETA: Performing deep packet inspection on traffic from {} (type={})", 
                threat.getSourceIP(), threat.getThreatType());
    }
}
