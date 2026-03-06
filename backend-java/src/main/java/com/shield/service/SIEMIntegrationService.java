package com.shield.service;

import com.shield.entity.ThreatEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
public class SIEMIntegrationService {

    @Value("${siem.splunk.url:}")
    private String splunkUrl;

    @Value("${siem.splunk.token:}")
    private String splunkToken;

    @Value("${siem.qradar.url:}")
    private String qradarUrl;

    @Value("${siem.qradar.token:}")
    private String qradarToken;

    @Value("${siem.elk.url:}")
    private String elkUrl;

    @Value("${siem.enabled:false}")
    private boolean siemEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendToSplunk(ThreatEvent threat) {
        if (!siemEnabled || splunkUrl.isEmpty()) return;

        try {
            Map<String, Object> event = Map.of(
                "event", buildSplunkEvent(threat),
                "sourcetype", "shield:threat",
                "index", "security"
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Splunk " + splunkToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(event, headers);
            restTemplate.postForEntity(splunkUrl + "/services/collector/event", entity, String.class);
        } catch (Exception e) {
            System.err.println("Splunk integration error: " + e.getMessage());
        }
    }

    public void sendToQRadar(ThreatEvent threat) {
        if (!siemEnabled || qradarUrl.isEmpty()) return;

        try {
            String syslogMessage = buildSyslogMessage(threat);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("SEC", qradarToken);
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> entity = new HttpEntity<>(syslogMessage, headers);
            restTemplate.postForEntity(qradarUrl + "/api/siem/offenses", entity, String.class);
        } catch (Exception e) {
            System.err.println("QRadar integration error: " + e.getMessage());
        }
    }

    public void sendToELK(ThreatEvent threat) {
        if (!siemEnabled || elkUrl.isEmpty()) return;

        try {
            Map<String, Object> document = buildElkDocument(threat);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(document, headers);
            restTemplate.postForEntity(elkUrl + "/shield-threats/_doc", entity, String.class);
        } catch (Exception e) {
            System.err.println("ELK integration error: " + e.getMessage());
        }
    }

    public void broadcastThreat(ThreatEvent threat) {
        sendToSplunk(threat);
        sendToQRadar(threat);
        sendToELK(threat);
    }

    private Map<String, Object> buildSplunkEvent(ThreatEvent threat) {
        return Map.of(
            "threat_id", threat.getId(),
            "threat_type", threat.getThreatType(),
            "source_ip", threat.getSourceIP(),
            "target_system", threat.getTargetSystem(),
            "severity", threat.getSeverityScore(),
            "status", threat.getStatus(),
            "timestamp", threat.getDetectedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        );
    }

    private String buildSyslogMessage(ThreatEvent threat) {
        return String.format(
            "<134>1 %s shield-backend - - - [threat_id=\"%d\" severity=\"%.1f\"] %s detected from %s targeting %s",
            LocalDateTime.now(), threat.getId(), threat.getSeverityScore(),
            threat.getThreatType(), threat.getSourceIP(), threat.getTargetSystem()
        );
    }

    private Map<String, Object> buildElkDocument(ThreatEvent threat) {
        Map<String, Object> doc = new HashMap<>();
        doc.put("@timestamp", threat.getDetectedAt());
        doc.put("threat_id", threat.getId());
        doc.put("threat_type", threat.getThreatType());
        doc.put("source_ip", threat.getSourceIP());
        doc.put("target_system", threat.getTargetSystem());
        doc.put("severity", threat.getSeverityScore());
        doc.put("status", threat.getStatus());
        doc.put("anomaly_score", threat.getAnomalyScore());
        doc.put("confidence", threat.getConfidenceLevel());
        return doc;
    }
}
