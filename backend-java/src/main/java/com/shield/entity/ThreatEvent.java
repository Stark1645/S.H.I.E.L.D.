package com.shield.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "threat_events")
@Data
public class ThreatEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String threatType;
    private String severity;
    private String sourceIp;
    private String targetSystem;
    private String status;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private Double anomalyScore;
    private String predictedEscalation;
    private String recommendedAction;

    private LocalDateTime detectedAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
}
