# SHIELD ML Service - Python FastAPI

## Prerequisites
- Python 3.11+
- pip

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Run

```bash
cd app
python main.py
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Default Port
- ML Service runs on port 8000

## API Documentation

Once running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Health Check
- GET `/` - Service info
- GET `/health` - Health status

### Analysis
- POST `/analyze` - Analyze threat and return anomaly score

Example request:
```json
{
  "threatType": "MALWARE",
  "severity": "HIGH",
  "sourceIp": "192.168.1.100",
  "targetSystem": "web-server-01",
  "description": "Suspicious activity detected"
}
```

Example response:
```json
{
  "anomalyScore": 0.756,
  "predictedEscalation": "CRITICAL",
  "recommendedAction": "ISOLATE_AND_BLOCK"
}
```

## ML Model

Uses scikit-learn IsolationForest for anomaly detection:
- Trained on baseline normal behavior
- Analyzes threat severity, type, and source
- Returns normalized anomaly score (0-1)
- Provides escalation prediction and recommended action

## Integration

This service is called by the Java backend at:
- `http://localhost:8000/analyze`

Configure the URL in backend's `application.properties`:
```properties
ml.service.url=http://localhost:8000
```
