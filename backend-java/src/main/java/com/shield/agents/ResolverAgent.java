package com.shield.agents;

import com.shield.entity.ThreatEvent;
import com.shield.service.AgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResolverAgent {
    private final AgentService agentService;

    public void resolve(ThreatEvent threat) {
        agentService.executeAgentAction(threat.getId(), "RESOLVER", "AUTO_RESOLVE");
        log.info("RESOLVER: Auto-resolved threat {} after verification period", threat.getId());
    }

    public boolean shouldResolve(ThreatEvent threat) {
        if (!"CONTAINED".equals(threat.getStatus())) {
            return false;
        }
        
        LocalDateTime now = LocalDateTime.now();
        long minutesSinceUpdate = ChronoUnit.MINUTES.between(threat.getTimestamp(), now);
        
        // Auto-resolve after 5 minutes if contained and no re-occurrence
        return minutesSinceUpdate >= 5;
    }
}
