package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.repository.ThreatEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThreatCorrelationService {
    private final ThreatEventRepository threatRepository;

    public Map<String, Object> detectAttackPatterns() {
        List<ThreatEvent> recentThreats = threatRepository.findAll().stream()
            .filter(t -> t.getTimestamp().isAfter(LocalDateTime.now().minusHours(1)))
            .collect(Collectors.toList());

        Map<String, List<ThreatEvent>> ipGroups = recentThreats.stream()
            .collect(Collectors.groupingBy(ThreatEvent::getSourceIP));

        List<Map<String, Object>> suspiciousPatterns = new ArrayList<>();
        
        for (Map.Entry<String, List<ThreatEvent>> entry : ipGroups.entrySet()) {
            if (entry.getValue().size() >= 3) {
                Map<String, Object> pattern = new HashMap<>();
                pattern.put("sourceIP", entry.getKey());
                pattern.put("attackCount", entry.getValue().size());
                pattern.put("threatTypes", entry.getValue().stream()
                    .map(ThreatEvent::getThreatType)
                    .distinct()
                    .collect(Collectors.toList()));
                pattern.put("avgSeverity", entry.getValue().stream()
                    .mapToDouble(ThreatEvent::getSeverityScore)
                    .average().orElse(0));
                pattern.put("classification", entry.getValue().size() > 5 ? "COORDINATED_ATTACK" : "SUSPICIOUS_ACTIVITY");
                suspiciousPatterns.add(pattern);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("patternsDetected", suspiciousPatterns.size());
        result.put("patterns", suspiciousPatterns);
        result.put("riskLevel", suspiciousPatterns.isEmpty() ? "LOW" : suspiciousPatterns.size() > 2 ? "CRITICAL" : "MEDIUM");
        result.put("timestamp", LocalDateTime.now());

        return result;
    }

    public Map<String, Object> getAttackChainAnalysis() {
        List<ThreatEvent> threats = threatRepository.findAll().stream()
            .filter(t -> t.getTimestamp().isAfter(LocalDateTime.now().minusHours(6)))
            .sorted(Comparator.comparing(ThreatEvent::getTimestamp))
            .collect(Collectors.toList());

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalEvents", threats.size());
        analysis.put("uniqueSources", threats.stream().map(ThreatEvent::getSourceIP).distinct().count());
        analysis.put("attackVelocity", threats.size() / 6.0);
        analysis.put("multiStageAttack", threats.stream()
            .map(ThreatEvent::getThreatType)
            .distinct()
            .count() >= 3);

        return analysis;
    }
}
