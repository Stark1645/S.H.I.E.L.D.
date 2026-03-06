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
    private String sourceIP;
    private String targetSystem;
    private String status;
    private Double severityScore;
    private String intentClassification;
    private Double anomalyScore;
    private Double confidenceLevel;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String predictedEscalation;
    private String recommendedAction;

    private LocalDateTime timestamp = LocalDateTime.now();
    private LocalDateTime detectedAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
}
