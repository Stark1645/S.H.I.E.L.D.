package com.shield.service;

import com.shield.entity.ThreatEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendThreatAlert(ThreatEvent threat) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("id", threat.getId());
        alert.put("type", threat.getThreatType());
        alert.put("severity", threat.getSeverityScore());
        alert.put("source", threat.getSourceIP());
        alert.put("status", threat.getStatus());
        alert.put("timestamp", threat.getDetectedAt());
        messagingTemplate.convertAndSend("/topic/threats", alert);
    }

    public void sendAgentAction(String agentName, String action, Long threatId) {
        Map<String, Object> message = new HashMap<>();
        message.put("agent", agentName);
        message.put("action", action);
        message.put("threatId", threatId);
        message.put("timestamp", LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/agents", message);
    }

    public void sendSystemAlert(String message, String severity) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("message", message);
        alert.put("severity", severity);
        alert.put("timestamp", LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/system", alert);
    }
}
