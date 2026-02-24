from pydantic import BaseModel
from typing import Optional

class ThreatInput(BaseModel):
    threatType: str
    severity: Optional[str] = "MEDIUM"
    severityScore: Optional[float] = None
    sourceIp: Optional[str] = None
    sourceIP: Optional[str] = None
    targetSystem: Optional[str] = None
    description: Optional[str] = None

class AnomalyResponse(BaseModel):
    anomalyScore: float
    predictedEscalation: str
    recommendedAction: str
    learnedFromHistory: Optional[int] = 0
