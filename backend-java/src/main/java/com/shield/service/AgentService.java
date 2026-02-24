package com.shield.service;

import com.shield.entity.AgentDecision;
import com.shield.entity.ThreatEvent;
import com.shield.repository.AgentDecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentService {
    private final AgentDecisionRepository decisionRepository;
    private final ThreatService threatService;

    public List<AgentDecision> getAllDecisions() {
        return decisionRepository.findAll();
    }

    public List<AgentDecision> getDecisionsByThreat(Long threatId) {
        return decisionRepository.findByThreatEventId(threatId);
    }

    public AgentDecision createDecision(AgentDecision decision) {
        decision.setStatus("EXECUTED");
        return decisionRepository.save(decision);
    }

    public AgentDecision executeAgentAction(Long threatId, String agentName, String action) {
        ThreatEvent threat = threatService.getThreatById(threatId);
        
        AgentDecision decision = new AgentDecision();
        decision.setAgentName(agentName);
        decision.setAction(action);
        decision.setThreatEvent(threat);
        decision.setReasoning("Automated response based on threat analysis");
        decision.setStatus("EXECUTED");
        
        return decisionRepository.save(decision);
    }

    public List<AgentDecision> getDecisionsByAgent(String agentName) {
        return decisionRepository.findByAgentName(agentName);
    }
}
