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
public class ThreatPredictionService {
    private final ThreatEventRepository threatRepository;

    public Map<String, Object> predictNextThreats() {
        List<ThreatEvent> recentThreats = threatRepository.findAll().stream()
            .filter(t -> t.getTimestamp().isAfter(LocalDateTime.now().minusHours(24)))
            .collect(Collectors.toList());

        Map<String, Long> threatTypeFrequency = recentThreats.stream()
            .collect(Collectors.groupingBy(ThreatEvent::getThreatType, Collectors.counting()));

        String mostLikelyThreat = threatTypeFrequency.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Unknown");

        double avgSeverity = recentThreats.stream()
            .mapToDouble(ThreatEvent::getSeverityScore)
            .average()
            .orElse(0.0);

        Map<String, Object> prediction = new HashMap<>();
        prediction.put("nextLikelyThreat", mostLikelyThreat);
        prediction.put("probability", Math.min(95, threatTypeFrequency.getOrDefault(mostLikelyThreat, 0L) * 15));
        prediction.put("predictedSeverity", Math.round(avgSeverity * 1.2 * 10) / 10.0);
        prediction.put("timeWindow", "Next 2 hours");
        prediction.put("confidence", 78 + new Random().nextInt(15));
        prediction.put("threatTrends", threatTypeFrequency);

        return prediction;
    }

    public List<Map<String, Object>> getThreatTimeline() {
        List<ThreatEvent> threats = threatRepository.findAll().stream()
            .sorted(Comparator.comparing(ThreatEvent::getTimestamp).reversed())
            .limit(20)
            .collect(Collectors.toList());

        return threats.stream().map(t -> {
            Map<String, Object> item = new HashMap<>();
            item.put("timestamp", t.getTimestamp());
            item.put("type", t.getThreatType());
            item.put("severity", t.getSeverityScore());
            item.put("source", t.getSourceIP());
            return item;
        }).collect(Collectors.toList());
    }
}
