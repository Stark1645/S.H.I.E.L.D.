from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ThreatInput, AnomalyResponse
from app.services.anomaly_detector import AnomalyDetector

app = FastAPI(title="SHIELD ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = AnomalyDetector()

@app.get("/")
def root():
    return {"service": "SHIELD ML Service", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/analyze", response_model=AnomalyResponse)
def analyze_threat(threat: ThreatInput):
    result = detector.analyze(threat.dict())
    return AnomalyResponse(**result)

@app.post("/learn")
def learn_from_outcome(threat_data: dict, action_taken: str, success: bool):
    detector.learn_from_outcome(threat_data, action_taken, success)
    return {"status": "learned", "history_size": len(detector.threat_history)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
