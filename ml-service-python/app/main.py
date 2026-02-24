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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
