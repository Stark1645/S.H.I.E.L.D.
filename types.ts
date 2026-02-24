
export enum ThreatStatus {
  DETECTED = 'DETECTED',
  SIMULATED = 'SIMULATED',
  CONTAINED = 'CONTAINED',
  RESOLVED = 'RESOLVED'
}

export enum LogType {
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  AGENT = 'AGENT',
  ERROR = 'ERROR'
}

export interface ThreatEvent {
  id: string;
  sourceIP: string;
  targetSystem: string;
  threatType: string;
  severityScore: number;
  intentClassification: string;
  status: ThreatStatus;
  timestamp: string;
}

export interface AgentDecision {
  id: string;
  agentName: string;
  decisionSummary: string;
  confidenceScore: number;
  linkedThreatId: string;
  createdAt: string;
}

export interface SimulationLog {
  id: string;
  threatId: string;
  escalationProbability: number;
  predictedImpact: string;
  recommendedAction: string;
  simulationTime: string;
}

export interface SystemLog {
  id: string;
  logType: LogType;
  description: string;
  createdAt: string;
}

export interface DashboardStats {
  totalThreats: number;
  activeThreats: number;
  averageSeverity: number;
  containmentRate: number;
  threatHeatmapData: { x: number; y: number; value: number }[];
  recentDecisions: AgentDecision[];
  escalationTrendData: { time: string; probability: number }[];
}
