from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self._train_baseline()
    
    def _train_baseline(self):
        baseline_data = np.random.randn(100, 3)
        self.model.fit(baseline_data)
    
    def analyze(self, threat_data: dict) -> dict:
        severity_map = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        threat_type_map = {
            "MALWARE": 3, "PHISHING": 2, "DDoS": 4, 
            "INTRUSION": 4, "DATA_BREACH": 5, "RANSOMWARE": 5
        }
        
        severity_score = severity_map.get(threat_data.get("severity", "MEDIUM"), 2)
        threat_score = threat_type_map.get(threat_data.get("threatType", "MALWARE"), 3)
        ip_score = len(threat_data.get("sourceIp", "0.0.0.0").split("."))
        
        features = np.array([[severity_score, threat_score, ip_score]])
        anomaly_score = -self.model.score_samples(features)[0]
        normalized_score = min(max(anomaly_score / 2, 0), 1)
        
        if normalized_score > 0.7:
            escalation = "CRITICAL"
            action = "ISOLATE_AND_BLOCK"
        elif normalized_score > 0.5:
            escalation = "HIGH"
            action = "QUARANTINE"
        elif normalized_score > 0.3:
            escalation = "MEDIUM"
            action = "MONITOR"
        else:
            escalation = "LOW"
            action = "LOG"
        
        return {
            "anomalyScore": round(normalized_score, 3),
            "predictedEscalation": escalation,
            "recommendedAction": action
        }
