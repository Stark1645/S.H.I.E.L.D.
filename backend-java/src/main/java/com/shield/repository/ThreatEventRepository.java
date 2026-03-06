package com.shield.repository;

import com.shield.entity.ThreatEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ThreatEventRepository extends JpaRepository<ThreatEvent, Long> {
    List<ThreatEvent> findByStatus(String status);
    List<ThreatEvent> findBySourceIPAndStatus(String sourceIP, String status);
    List<ThreatEvent> findBySourceIPAndTargetSystemAndTimestampAfter(String sourceIP, String targetSystem, LocalDateTime after);
    List<ThreatEvent> findBySourceIPAndTimestampAfter(String sourceIP, LocalDateTime after);
    long countByStatusIn(List<String> statuses);
}
