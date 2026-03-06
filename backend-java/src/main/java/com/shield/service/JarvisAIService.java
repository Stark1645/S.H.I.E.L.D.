package com.shield.service;

import com.shield.entity.ThreatEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class JarvisAIService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public Map<String, Object> analyzeThreat(ThreatEvent threat) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (geminiApiKey == null || geminiApiKey.isEmpty()) {
                return getFallbackAnalysis(threat);
            }

            String prompt = buildThreatAnalysisPrompt(threat);
            String aiResponse = callGeminiAPI(prompt);
            
            response.put("analysis", aiResponse);
            response.put("recommendations", extractRecommendations(aiResponse));
            response.put("severity", assessSeverity(aiResponse));
            response.put("confidence", 0.92);
            
        } catch (Exception e) {
            return getFallbackAnalysis(threat);
        }
        
        return response;
    }

    public Map<String, Object> getSystemRecommendations(List<ThreatEvent> recentThreats) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (geminiApiKey == null || geminiApiKey.isEmpty()) {
                return getFallbackRecommendations(recentThreats);
            }

            String prompt = buildSystemAnalysisPrompt(recentThreats);
            String aiResponse = callGeminiAPI(prompt);
            
            response.put("summary", aiResponse);
            response.put("actions", extractActions(aiResponse));
            response.put("priority", "HIGH");
            
        } catch (Exception e) {
            return getFallbackRecommendations(recentThreats);
        }
        
        return response;
    }

    public String askJarvis(String question, String context) {
        try {
            if (geminiApiKey == null || geminiApiKey.isEmpty()) {
                return "JARVIS AI is in offline mode. Please configure Gemini API key in application-secrets.properties";
            }

            String prompt = "You are JARVIS, an advanced AI assistant for the S.H.I.E.L.D cybersecurity system. " +
                          "You are helpful, intelligent, and professional. " +
                          "Answer any question the user asks, whether it's about cybersecurity, technology, or general knowledge. " +
                          "Be concise but informative.\n\n" +
                          "Context: " + context + "\n\n" +
                          "Question: " + question;
            
            return callGeminiAPI(prompt);
            
        } catch (Exception e) {
            return "I apologize, sir. I'm experiencing technical difficulties. Error: " + e.getMessage();
        }
    }

    private String callGeminiAPI(String prompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
            
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", Collections.singletonList(part));
            requestBody.put("contents", Collections.singletonList(content));
            
            // Add generation config for better responses
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.9);
            generationConfig.put("topK", 1);
            generationConfig.put("topP", 1);
            generationConfig.put("maxOutputTokens", 2048);
            requestBody.put("generationConfig", generationConfig);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            System.out.println("Calling Gemini API with URL: " + url.replace(geminiApiKey, "***"));
            System.out.println("Request body: " + requestBody);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            
            System.out.println("Response status: " + response.getStatusCode());
            System.out.println("Response body: " + response.getBody());
            
            if (response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content2 = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, String>> parts = (List<Map<String, String>>) content2.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return parts.get(0).get("text");
                    }
                }
            }
            
            return "I apologize, sir. I received an empty response from my neural network.";
            
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            e.printStackTrace();
            return "I apologize, sir. Technical error: " + e.getMessage() + ". Please verify your API key is valid at https://makersuite.google.com/app/apikey";
        }
    }

    private String buildThreatAnalysisPrompt(ThreatEvent threat) {
        return String.format(
            "Analyze this cybersecurity threat:\n" +
            "Type: %s\n" +
            "Source IP: %s\n" +
            "Target: %s\n" +
            "Severity: %s/10\n" +
            "Status: %s\n\n" +
            "Provide: 1) Threat assessment 2) Immediate actions 3) Prevention measures. Keep response under 200 words.",
            threat.getThreatType(),
            threat.getSourceIP(),
            threat.getTargetSystem(),
            threat.getSeverityScore(),
            threat.getStatus()
        );
    }

    private String buildSystemAnalysisPrompt(List<ThreatEvent> threats) {
        StringBuilder sb = new StringBuilder("Analyze these recent threats:\n");
        threats.stream().limit(5).forEach(t -> 
            sb.append(String.format("- %s (Severity: %s)\n", t.getThreatType(), t.getSeverityScore()))
        );
        sb.append("\nProvide system-wide recommendations and priority actions. Keep under 150 words.");
        return sb.toString();
    }

    private List<String> extractRecommendations(String aiResponse) {
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Isolate affected systems immediately");
        recommendations.add("Block source IP at firewall level");
        recommendations.add("Enable enhanced monitoring");
        return recommendations;
    }

    private List<String> extractActions(String aiResponse) {
        List<String> actions = new ArrayList<>();
        actions.add("Review firewall rules");
        actions.add("Update intrusion detection signatures");
        actions.add("Conduct security audit");
        return actions;
    }

    private String assessSeverity(String aiResponse) {
        if (aiResponse.toLowerCase().contains("critical") || aiResponse.toLowerCase().contains("severe")) {
            return "CRITICAL";
        } else if (aiResponse.toLowerCase().contains("high")) {
            return "HIGH";
        }
        return "MEDIUM";
    }

    private Map<String, Object> getFallbackAnalysis(ThreatEvent threat) {
        Map<String, Object> response = new HashMap<>();
        response.put("analysis", String.format(
            "JARVIS Analysis: %s detected from %s targeting %s. " +
            "Severity level: %s/10. Immediate containment recommended.",
            threat.getThreatType(), threat.getSourceIP(), threat.getTargetSystem(), threat.getSeverityScore()
        ));
        response.put("recommendations", Arrays.asList(
            "Isolate compromised system",
            "Block malicious IP address",
            "Enable enhanced monitoring"
        ));
        response.put("severity", threat.getSeverityScore() > 7 ? "CRITICAL" : "HIGH");
        response.put("confidence", 0.85);
        return response;
    }

    private Map<String, Object> getFallbackRecommendations(List<ThreatEvent> threats) {
        Map<String, Object> response = new HashMap<>();
        response.put("summary", String.format(
            "JARVIS System Analysis: %d active threats detected. " +
            "Recommend immediate security posture review and enhanced monitoring.",
            threats.size()
        ));
        response.put("actions", Arrays.asList(
            "Review and update firewall rules",
            "Conduct comprehensive security audit",
            "Enable advanced threat detection"
        ));
        response.put("priority", "HIGH");
        return response;
    }
}
