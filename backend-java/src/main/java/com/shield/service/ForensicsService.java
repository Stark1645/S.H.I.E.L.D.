package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.repository.ThreatEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ForensicsService {

    private final ThreatEventRepository threatRepository;

    public ForensicsService(ThreatEventRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    public Map<String, Object> performDeepAnalysis(Long threatId) {
        Optional<ThreatEvent> threatOpt = threatRepository.findById(threatId);
        if (threatOpt.isEmpty()) {
            return Map.of("error", "Threat not found");
        }

        ThreatEvent threat = threatOpt.get();
        Map<String, Object> analysis = new HashMap<>();

        analysis.put("threatId", threatId);
        analysis.put("timeline", buildTimeline(threat));
        analysis.put("relatedThreats", findRelatedThreats(threat));
        analysis.put("attackVector", analyzeAttackVector(threat));
        analysis.put("impactAssessment", assessImpact(threat));
        analysis.put("evidenceChain", buildEvidenceChain(threat));
        analysis.put("recommendations", generateRecommendations(threat));

        return analysis;
    }

    public Map<String, Object> generateForensicReport(Long threatId) {
        Map<String, Object> analysis = performDeepAnalysis(threatId);
        analysis.put("reportGenerated", LocalDateTime.now());
        analysis.put("reportType", "COMPREHENSIVE_FORENSIC_ANALYSIS");
        return analysis;
    }

    private List<Map<String, Object>> buildTimeline(ThreatEvent threat) {
        List<Map<String, Object>> timeline = new ArrayList<>();
        Map<String, Object> detection = new HashMap<>();
        detection.put("timestamp", threat.getDetectedAt());
        detection.put("event", "Threat Detected");
        detection.put("details", "Initial detection by monitoring system");
        timeline.add(detection);
        
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("timestamp", LocalDateTime.now());
        analysis.put("event", "Analysis Initiated");
        analysis.put("details", "Forensic analysis started");
        timeline.add(analysis);
        
        return timeline;
    }

    private List<Map<String, Object>> findRelatedThreats(ThreatEvent threat) {
        return threatRepository.findAll().stream()
            .filter(t -> !t.getId().equals(threat.getId()))
            .filter(t -> t.getSourceIP().equals(threat.getSourceIP()) || 
                        t.getThreatType().equals(threat.getThreatType()))
            .limit(5)
            .map(t -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", t.getId());
                map.put("type", t.getThreatType());
                map.put("severity", t.getSeverityScore());
                map.put("timestamp", t.getDetectedAt());
                return map;
            })
            .collect(Collectors.toList());
    }

    private Map<String, Object> analyzeAttackVector(ThreatEvent threat) {
        return Map.of(
            "entryPoint", threat.getTargetSystem(),
            "method", threat.getThreatType(),
            "sophistication", threat.getSeverityScore() > 7 ? "HIGH" : "MEDIUM",
            "persistence", "UNKNOWN"
        );
    }

    private Map<String, Object> assessImpact(ThreatEvent threat) {
        return Map.of(
            "severity", threat.getSeverityScore(),
            "affectedSystems", List.of(threat.getTargetSystem()),
            "dataExfiltration", "NONE_DETECTED",
            "businessImpact", threat.getSeverityScore() > 7 ? "CRITICAL" : "MODERATE"
        );
    }

    private List<String> buildEvidenceChain(ThreatEvent threat) {
        return List.of(
            "Source IP: " + threat.getSourceIP(),
            "Target: " + threat.getTargetSystem(),
            "Detection Time: " + threat.getDetectedAt(),
            "Anomaly Score: " + threat.getAnomalyScore(),
            "Confidence: " + threat.getConfidenceLevel()
        );
    }

    private List<String> generateRecommendations(ThreatEvent threat) {
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Isolate affected system: " + threat.getTargetSystem());
        recommendations.add("Block source IP: " + threat.getSourceIP());
        recommendations.add("Review access logs for the past 24 hours");
        recommendations.add("Update security signatures");
        recommendations.add("Conduct full system scan");
        return recommendations;
    }
}
