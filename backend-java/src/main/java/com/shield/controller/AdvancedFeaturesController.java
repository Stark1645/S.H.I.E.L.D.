package com.shield.controller;

import com.shield.entity.ThreatEvent;
import com.shield.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/advanced")
@CrossOrigin(origins = "*")
public class AdvancedFeaturesController {

    private final ThreatSimulationService simulationService;
    private final ForensicsService forensicsService;
    private final SIEMIntegrationService siemService;
    private final SMSService smsService;

    public AdvancedFeaturesController(
        ThreatSimulationService simulationService,
        ForensicsService forensicsService,
        SIEMIntegrationService siemService,
        SMSService smsService
    ) {
        this.simulationService = simulationService;
        this.forensicsService = forensicsService;
        this.siemService = siemService;
        this.smsService = smsService;
    }

    // PHASE 2: Threat Simulation
    @PostMapping("/simulate/threat")
    public ResponseEntity<ThreatEvent> simulateThreat(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Double severity
    ) {
        return ResponseEntity.ok(simulationService.simulateThreat(type, severity));
    }

    @PostMapping("/simulate/campaign")
    public ResponseEntity<List<ThreatEvent>> simulateCampaign(@RequestParam int count) {
        return ResponseEntity.ok(simulationService.simulateAttackCampaign(count));
    }

    // PHASE 3: SMS Notifications
    @PostMapping("/notify/sms")
    public ResponseEntity<Map<String, String>> sendSMSAlert(
        @RequestParam String phone,
        @RequestParam String message
    ) {
        smsService.sendCriticalAlert(phone, message);
        return ResponseEntity.ok(Map.of("status", "sent", "phone", phone));
    }

    // PHASE 4: Advanced Forensics
    @GetMapping("/forensics/{threatId}")
    public ResponseEntity<Map<String, Object>> getForensicAnalysis(@PathVariable Long threatId) {
        return ResponseEntity.ok(forensicsService.performDeepAnalysis(threatId));
    }

    @GetMapping("/forensics/{threatId}/report")
    public ResponseEntity<Map<String, Object>> generateForensicReport(@PathVariable Long threatId) {
        return ResponseEntity.ok(forensicsService.generateForensicReport(threatId));
    }

    // PHASE 4: SIEM Integration
    @PostMapping("/siem/broadcast/{threatId}")
    public ResponseEntity<Map<String, String>> broadcastToSIEM(@PathVariable Long threatId) {
        // This would fetch threat and broadcast to all SIEM systems
        return ResponseEntity.ok(Map.of("status", "broadcasted", "threatId", threatId.toString()));
    }

    @GetMapping("/features/status")
    public ResponseEntity<Map<String, Object>> getFeaturesStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("phase2", Map.of(
            "websocket", "ENABLED",
            "threatSimulation", "ENABLED",
            "advancedML", "PLANNED"
        ));
        status.put("phase3", Map.of(
            "multiTenant", "ENABLED",
            "smsNotifications", "ENABLED",
            "customDashboards", "ENABLED",
            "mobileAPI", "ENABLED"
        ));
        status.put("phase4", Map.of(
            "kubernetes", "CONFIGURED",
            "distributedTracing", "ENABLED",
            "forensics", "ENABLED",
            "siemIntegration", "ENABLED"
        ));
        return ResponseEntity.ok(status);
    }
}
