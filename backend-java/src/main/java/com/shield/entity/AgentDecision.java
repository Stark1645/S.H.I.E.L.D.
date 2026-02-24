package com.shield.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_decisions")
@Data
public class AgentDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String agentName;
    private String decisionSummary;
    private Double confidenceScore;
    private Long linkedThreatId;
    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();
}
