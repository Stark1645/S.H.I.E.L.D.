package com.shield.integration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class MLServiceClient {
    @Value("${ml.service.url}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public MLResponse analyzeAnomaly(Map<String, Object> threatData) {
        try {
            return restTemplate.postForObject(
                mlServiceUrl + "/analyze", 
                threatData, 
                MLResponse.class
            );
        } catch (Exception e) {
            return new MLResponse(0.5, "MEDIUM", "MONITOR");
        }
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
