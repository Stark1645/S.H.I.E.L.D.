from sklearn.ensemble import IsolationForest, RandomForestClassifier
import numpy as np
import json
import os
from datetime import datetime

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.learning_model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.history_file = 'threat_history.json'
        self.threat_history = self._load_history()
        self._train_baseline()
        if len(self.threat_history) > 10:
            self._train_from_history()
    
    def _load_history(self):
        if os.path.exists(self.history_file):
            with open(self.history_file, 'r') as f:
                return json.load(f)
        return []
    
    def _save_history(self):
        with open(self.history_file, 'w') as f:
            json.dump(self.threat_history[-1000:], f)
    
    def _train_baseline(self):
        baseline_data = np.random.randn(100, 3)
        self.model.fit(baseline_data)
    
    def _train_from_history(self):
        if len(self.threat_history) < 10:
            return
        
        X = []
        y = []
        for record in self.threat_history:
            if 'features' in record and 'success' in record:
                X.append(record['features'])
                y.append(1 if record['success'] else 0)
        
        if len(X) > 10:
            self.learning_model.fit(np.array(X), np.array(y))
    
    def learn_from_outcome(self, threat_data: dict, action_taken: str, success: bool):
        severity_map = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        threat_type_map = {
            "MALWARE": 3, "PHISHING": 2, "DDoS": 4, 
            "INTRUSION": 4, "DATA_BREACH": 5, "RANSOMWARE": 5
        }
        
        severity_score = severity_map.get(threat_data.get("severity", "MEDIUM"), 2)
        threat_score = threat_type_map.get(threat_data.get("threatType", "MALWARE"), 3)
        ip_score = len(threat_data.get("sourceIp", "0.0.0.0").split("."))
        
        record = {
            'timestamp': datetime.now().isoformat(),
            'features': [severity_score, threat_score, ip_score],
            'action': action_taken,
            'success': success,
            'threat_type': threat_data.get('threatType', 'UNKNOWN')
        }
        
        self.threat_history.append(record)
        self._save_history()
        
        if len(self.threat_history) % 10 == 0:
            self._train_from_history()
    
    def analyze(self, threat_data: dict) -> dict:
        severity_map = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        threat_type_map = {
            "MALWARE": 3, "PHISHING": 2, "DDoS": 4, 
            "INTRUSION": 4, "DATA_BREACH": 5, "RANSOMWARE": 5
        }
        
        severity_score = severity_map.get(threat_data.get("severity", "MEDIUM"), 2)
        threat_score = threat_type_map.get(threat_data.get("threatType", "MALWARE"), 3)
        source_ip = threat_data.get("sourceIp") or threat_data.get("sourceIP", "0.0.0.0")
        ip_score = len(source_ip.split("."))
        
        features = np.array([[severity_score, threat_score, ip_score]])
        anomaly_score = -self.model.score_samples(features)[0]
        normalized_score = min(max(anomaly_score / 2, 0), 1)
        
        if len(self.threat_history) > 10:
            try:
                success_prob = self.learning_model.predict_proba(features)[0][1]
                normalized_score = (normalized_score + success_prob) / 2
            except:
                pass
        
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
            "recommendedAction": action,
            "learnedFromHistory": len(self.threat_history)
        }
