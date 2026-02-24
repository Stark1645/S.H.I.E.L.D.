package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import com.shield.service.ThreatService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class AgentCoordinator {
    private final ThreatService threatService;
    private final AgentService agentService;

    @Scheduled(fixedDelay = 30000)
    public void coordinateAgents() {
        List<ThreatEvent> activeThreats = threatService.getThreatsByStatus("ACTIVE");
        
        for (ThreatEvent threat : activeThreats) {
            if (threat.getAnomalyScore() != null && threat.getAnomalyScore() > 0.7) {
                agentService.executeAgentAction(threat.getId(), "DEFENDER", "ISOLATE_SYSTEM");
            } else if (threat.getAnomalyScore() != null && threat.getAnomalyScore() > 0.4) {
                agentService.executeAgentAction(threat.getId(), "MONITOR", "INCREASE_SURVEILLANCE");
            }
        }
    }
}
