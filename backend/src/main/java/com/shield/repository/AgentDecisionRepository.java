package com.shield.repository;

import com.shield.entity.AgentDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentDecisionRepository extends JpaRepository<AgentDecision, String> {
}
