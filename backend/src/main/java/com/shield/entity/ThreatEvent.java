
package com.shield.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "threat_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreatEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String sourceIP;
    private String targetSystem;
    private String threatType;
    private Double severityScore;
    private String intentClassification;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime timestamp;

    public enum Status {
        DETECTED, SIMULATED, CONTAINED, RESOLVED
    }
}
