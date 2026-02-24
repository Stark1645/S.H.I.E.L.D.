from pydantic import BaseModel
from typing import Optional

class ThreatInput(BaseModel):
    threatType: str
    severity: str
    sourceIp: str
    targetSystem: Optional[str] = None
    description: Optional[str] = None

class AnomalyResponse(BaseModel):
    anomalyScore: float
    predictedEscalation: str
    recommendedAction: str
