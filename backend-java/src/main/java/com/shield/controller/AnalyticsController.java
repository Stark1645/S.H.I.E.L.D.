package com.shield.controller;

import com.shield.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final ThreatPredictionService predictionService;
    private final ThreatCorrelationService correlationService;
    private final GeolocationService geolocationService;
    private final SystemHealthService healthService;

    @GetMapping("/predictions")
    public ResponseEntity<Map<String, Object>> getThreatPredictions() {
        return ResponseEntity.ok(predictionService.predictNextThreats());
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<Map<String, Object>>> getThreatTimeline() {
        return ResponseEntity.ok(predictionService.getThreatTimeline());
    }

    @GetMapping("/patterns")
    public ResponseEntity<Map<String, Object>> getAttackPatterns() {
        return ResponseEntity.ok(correlationService.detectAttackPatterns());
    }

    @GetMapping("/attack-chain")
    public ResponseEntity<Map<String, Object>> getAttackChainAnalysis() {
        return ResponseEntity.ok(correlationService.getAttackChainAnalysis());
    }

    @GetMapping("/geolocation")
    public ResponseEntity<List<Map<String, Object>>> getThreatGeolocation() {
        return ResponseEntity.ok(geolocationService.getThreatGeolocation());
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(healthService.getSystemHealth());
    }

    @GetMapping("/performance")
    public ResponseEntity<List<Map<String, Object>>> getPerformanceMetrics() {
        return ResponseEntity.ok(healthService.getPerformanceMetrics());
    }
}
