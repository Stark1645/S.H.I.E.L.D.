package com.shield.repository;

import com.shield.entity.ThreatEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ThreatEventRepository extends JpaRepository<ThreatEvent, Long> {
    List<ThreatEvent> findByStatus(String status);
    List<ThreatEvent> findBySeverity(String severity);
}
