package com.shield.integration;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@Slf4j
public class MLServiceClient {
    @Value("${ml.service.url}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Enhanced ML service client with health monitoring fallback
     */
    public MLResponse analyzeAnomaly(Map<String, Object> threatData) {
        try {
            MLResponse response = restTemplate.postForObject(
                mlServiceUrl + "/analyze", 
                threatData, 
                MLResponse.class
            );
            
            if (response != null) {
                log.debug("ML analysis successful for threat: {}", threatData);
                return response;
            }
            
        } catch (Exception e) {
            log.warn("ML service call failed, using fallback scoring: {}", e.getMessage());
        }
        
        // Health monitoring fallback - assign default values and continue processing
        log.info("Applying ML service fallback with anomaly_score=0.5");
        return new MLResponse(0.5, "MEDIUM", "MONITOR");
    }

    @Data
    public static class MLResponse {
        private double anomalyScore;
        private String predictedEscalation;
        private String recommendedAction;

        public MLResponse() {}

        public MLResponse(double anomalyScore, String predictedEscalation, String recommendedAction) {
            this.anomalyScore = anomalyScore;
            this.predictedEscalation = predictedEscalation;
            this.recommendedAction = recommendedAction;
        }
    }
}
