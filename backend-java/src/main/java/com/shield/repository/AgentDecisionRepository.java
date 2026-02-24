package com.shield.repository;

import com.shield.entity.AgentDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentDecisionRepository extends JpaRepository<AgentDecision, Long> {
    List<AgentDecision> findByThreatEventId(Long threatEventId);
    List<AgentDecision> findByAgentName(String agentName);
}
