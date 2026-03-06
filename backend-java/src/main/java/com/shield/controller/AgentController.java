package com.shield.controller;

import com.shield.dto.AgentInfo;
import com.shield.entity.AgentDecision;
import com.shield.service.AgentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentController {
    private final AgentService agentService;

    @GetMapping("/decisions")
    public ResponseEntity<List<AgentDecision>> getAllDecisions() {
        return ResponseEntity.ok(agentService.getAllDecisions());
    }

    @GetMapping("/decisions/threat/{threatId}")
    public ResponseEntity<List<AgentDecision>> getDecisionsByThreat(@PathVariable Long threatId) {
        return ResponseEntity.ok(agentService.getDecisionsByThreat(threatId));
    }

    @GetMapping("/decisions/agent/{agentName}")
    public ResponseEntity<List<AgentDecision>> getDecisionsByAgent(@PathVariable String agentName) {
        return ResponseEntity.ok(agentService.getDecisionsByAgent(agentName));
    }

    @PostMapping("/decisions")
    public ResponseEntity<AgentDecision> createDecision(@RequestBody AgentDecision decision) {
        return ResponseEntity.ok(agentService.createDecision(decision));
    }

    @PostMapping("/execute")
    public ResponseEntity<AgentDecision> executeAction(@RequestBody ExecuteRequest request) {
        return ResponseEntity.ok(agentService.executeAgentAction(
            request.getThreatId(), 
            request.getAgentName(), 
            request.getAction()
        ));
    }

    @GetMapping("/list")
    public ResponseEntity<List<AgentInfo>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getAgentHealth() {
        return ResponseEntity.ok(agentService.getAgentHealthStatus());
    }

    @Data
    static class ExecuteRequest {
        private Long threatId;
        private String agentName;
        private String action;
    }
}
