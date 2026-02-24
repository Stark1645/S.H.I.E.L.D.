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
    private String action;
    private String reasoning;
    private String status;

    @ManyToOne
    @JoinColumn(name = "threat_event_id")
    private ThreatEvent threatEvent;

    private LocalDateTime timestamp = LocalDateTime.now();
}
