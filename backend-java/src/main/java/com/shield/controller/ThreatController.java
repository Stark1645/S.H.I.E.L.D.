package com.shield.controller;

import com.shield.entity.ThreatEvent;
import com.shield.service.ThreatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/threats")
@RequiredArgsConstructor
public class ThreatController {
    private final ThreatService threatService;

    @GetMapping
    public ResponseEntity<List<ThreatEvent>> getAllThreats() {
        return ResponseEntity.ok(threatService.getAllThreats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreatEvent> getThreatById(@PathVariable Long id) {
        return ResponseEntity.ok(threatService.getThreatById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ThreatEvent>> getThreatsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(threatService.getThreatsByStatus(status));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<ThreatEvent> allThreats = threatService.getAllThreats();
        long activeThreats = allThreats.stream()
            .filter(t -> "DETECTED".equals(t.getStatus()) || "ACTIVE".equals(t.getStatus()) || "CONTAINED".equals(t.getStatus()))
            .count();
        
        double avgSeverity = allThreats.stream()
            .mapToDouble(ThreatEvent::getSeverityScore)
            .average()
            .orElse(0.0);
        
        long containedThreats = allThreats.stream()
            .filter(t -> "CONTAINED".equals(t.getStatus()) || "RESOLVED".equals(t.getStatus()))
            .count();
        
        double containmentRate = allThreats.isEmpty() ? 0 : 
            (containedThreats * 100.0) / allThreats.size();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", allThreats.size());
        stats.put("active", activeThreats);
        stats.put("severity", Math.round(avgSeverity * 10.0) / 10.0);
        stats.put("containment", Math.round(containmentRate * 10.0) / 10.0);
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<ThreatEvent> createThreat(@RequestBody ThreatEvent threat) {
        return ResponseEntity.ok(threatService.createThreat(threat));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThreatEvent> updateThreat(@PathVariable Long id, @RequestBody ThreatEvent threat) {
        return ResponseEntity.ok(threatService.updateThreat(id, threat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteThreat(@PathVariable Long id) {
        threatService.deleteThreat(id);
        return ResponseEntity.ok().build();
    }
}
