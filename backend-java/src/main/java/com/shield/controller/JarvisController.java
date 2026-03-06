package com.shield.controller;

import com.shield.entity.ThreatEvent;
import com.shield.service.JarvisAIService;
import com.shield.service.ThreatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jarvis")
@CrossOrigin(origins = "*")
public class JarvisController {

    @Autowired
    private JarvisAIService jarvisAIService;

    @Autowired
    private ThreatService threatService;

    @PostMapping("/analyze-threat/{id}")
    public ResponseEntity<Map<String, Object>> analyzeThreat(@PathVariable Long id) {
        ThreatEvent threat = threatService.getThreatById(id);
        if (threat == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> analysis = jarvisAIService.analyzeThreat(threat);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/system-recommendations")
    public ResponseEntity<Map<String, Object>> getSystemRecommendations() {
        List<ThreatEvent> recentThreats = threatService.getAllThreats();
        Map<String, Object> recommendations = jarvisAIService.getSystemRecommendations(recentThreats);
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askJarvis(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String context = request.getOrDefault("context", "");
        
        String response = jarvisAIService.askJarvis(question, context);
        
        Map<String, String> result = new HashMap<>();
        result.put("response", response);
        result.put("timestamp", java.time.LocalDateTime.now().toString());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getJarvisStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("name", "JARVIS");
        status.put("version", "1.0.0");
        status.put("status", "ONLINE");
        status.put("capabilities", List.of(
            "Threat Analysis",
            "System Recommendations",
            "Natural Language Queries",
            "Real-time Insights"
        ));
        return ResponseEntity.ok(status);
    }
}
