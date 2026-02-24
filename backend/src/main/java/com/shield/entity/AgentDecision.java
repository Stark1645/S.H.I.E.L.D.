package com.shield.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_decisions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String agentName;
    private String decisionSummary;
    private Double confidenceScore;
    private String linkedThreatId;
    private LocalDateTime createdAt;
}
