package com.shield.controller;

import com.shield.entity.ThreatEvent;
import com.shield.service.ThreatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
