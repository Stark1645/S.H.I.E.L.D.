package com.shield.service;

import com.shield.entity.ThreatEvent;
import com.shield.repository.ThreatEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dynamic Risk Scoring Service
 * Computes enhanced risk scores using hybrid formula without modifying existing data structures
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskScoringService {
    
    private final ThreatEventRepository threatRepository;
    
    // Severity weights mapping
    private static final Map<String, Double> SEVERITY_WEIGHTS = Map.of(
        "LOW", 0.2,
        "MEDIUM", 0.5,
        "HIGH", 0.8,
        "CRITICAL", 1.0
    );
    
    /**
     * Calculate final risk score using hybrid formula:
     * finalRiskScore = (0.6 × anomaly_score) + (0.3 × severity_weight) + (0.1 × repeat_offense_factor)
     */
    public double calculateFinalRiskScore(ThreatEvent threat) {
        double severityScore = threat.getSeverityScore() != null ? threat.getSeverityScore() / 10.0 : 0.5;
        double repeatOffenseFactor = calculateRepeatOffenseFactor(threat.getSourceIP());
        
        double finalScore = (0.7 * severityScore) + (0.3 * repeatOffenseFactor);
        
        log.debug("Risk calculation for threat {}: severity={}, repeat={}, final={}", 
                threat.getId(), severityScore, repeatOffenseFactor, finalScore);
        
        return Math.min(finalScore, 1.0);
    }
    
    /**
     * Calculate dynamic threshold based on current active threats
     */
    public double calculateDynamicThreshold() {
        List<ThreatEvent> activeThreats = threatRepository.findByStatus("ACTIVE");
        
        if (activeThreats.isEmpty()) {
            return 0.7; // Default fallback
        }
        
        // Calculate average risk and standard deviation
        double[] riskScores = activeThreats.stream()
                .mapToDouble(this::calculateFinalRiskScore)
                .toArray();
        
        double average = calculateAverage(riskScores);
        double stdDev = calculateStandardDeviation(riskScores, average);
        
        double dynamicThreshold = average + stdDev;
        
        // Ensure reasonable bounds
        dynamicThreshold = Math.max(0.3, Math.min(0.9, dynamicThreshold));
        
        log.debug("Dynamic threshold calculated: avg={}, stdDev={}, threshold={}", 
                average, stdDev, dynamicThreshold);
        
        return dynamicThreshold;
    }
    
    /**
     * Calculate ML confidence indicator
     */
    public double calculateConfidence(double anomalyScore, double threshold) {
        return Math.abs(anomalyScore - threshold);
    }
    
    /**
     * Detect attack chain correlation without modifying database
     */
    public String detectAttackChain(ThreatEvent threat) {
        LocalDateTime timeWindow = LocalDateTime.now().minusHours(2);
        
        List<ThreatEvent> relatedThreats = threatRepository.findBySourceIPAndTargetSystemAndTimestampAfter(
                threat.getSourceIP(), 
                threat.getTargetSystem(), 
                timeWindow
        );
        
        long distinctThreatTypes = relatedThreats.stream()
                .map(ThreatEvent::getThreatType)
                .distinct()
                .count();
        
        if (distinctThreatTypes >= 3) {
            log.info("Potential attack campaign detected: IP={}, Target={}, ThreatTypes={}", 
                    threat.getSourceIP(), threat.getTargetSystem(), distinctThreatTypes);
            return "POTENTIAL_ATTACK_CAMPAIGN";
        }
        
        return "ISOLATED_INCIDENT";
    }
    
    private double calculateRepeatOffenseFactor(String sourceIP) {
        if (sourceIP == null) return 0.0;
        
        List<ThreatEvent> activeThreatsFromIP = threatRepository.findBySourceIPAndStatus(sourceIP, "ACTIVE");
        
        if (activeThreatsFromIP.size() > 3) {
            return Math.min(1.0, activeThreatsFromIP.size() * 0.2);
        }
        
        return 0.0;
    }
    
    private double calculateAverage(double[] values) {
        return java.util.Arrays.stream(values).average().orElse(0.5);
    }
    
    private double calculateStandardDeviation(double[] values, double mean) {
        double variance = java.util.Arrays.stream(values)
                .map(x -> Math.pow(x - mean, 2))
                .average()
                .orElse(0.0);
        return Math.sqrt(variance);
    }
}