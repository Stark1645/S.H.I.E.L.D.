
import React, { useState, useEffect } from 'react';
import { useNotify } from '../App';
import { threatAPI, agentAPI } from '../services/api';

interface RemediationStep {
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  time: string;
}

interface Remediation {
  id: number;
  threatType: string;
  sourceIP: string;
  targetSystem: string;
  severity: number;
  progress: number;
  agent: string;
  action: string;
  steps: RemediationStep[];
  startTime: number;
}

const ThreatRemediation: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [activeRemediations, setActiveRemediations] = useState<Remediation[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchActiveThreats = async () => {
      try {
        const threats = await threatAPI.getAll();
        // Show DETECTED, ACTIVE, and CONTAINED threats
        const active = threats.filter((t: any) => 
          t.status === 'DETECTED' || t.status === 'ACTIVE' || t.status === 'CONTAINED'
        );
        
        setActiveRemediations(prev => {
          const existing = new Map(prev.map(r => [r.id, r]));
          
          return active.map((threat: any) => {
            const existingRem = existing.get(threat.id);
            
            if (existingRem) {
              return existingRem;
            }
            
            return {
              id: threat.id,
              threatType: threat.threatType,
              sourceIP: threat.sourceIP,
              targetSystem: threat.targetSystem,
              severity: threat.severityScore,
              progress: 0,
              agent: threat.severityScore > 7 ? 'SENTINEL-ALPHA' : threat.severityScore > 5 ? 'RISK-EVALUATOR' : 'WATCHER',
              action: threat.severityScore > 7 ? 'Isolating system and blocking IP' : threat.severityScore > 5 ? 'Increasing surveillance and monitoring' : 'Logging activity for analysis',
              steps: [
                { name: 'Threat Analysis', status: 'in-progress', time: '-' },
                { name: 'Risk Assessment', status: 'pending', time: '-' },
                { name: 'Action Selection', status: 'pending', time: '-' },
                { name: 'Execution', status: 'pending', time: '-' },
                { name: 'Verification', status: 'pending', time: '-' }
              ],
              startTime: Date.now()
            };
          });
        });
      } catch (error) {
        console.error('Failed to fetch threats:', error);
      }
    };

    fetchActiveThreats();
    const interval = setInterval(fetchActiveThreats, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateProgress = setInterval(() => {
      setActiveRemediations(prev => {
        return prev.map(rem => {
          const elapsed = (Date.now() - rem.startTime) / 1000;
          const newProgress = Math.min((elapsed / 30) * 100, 100);
          
          if (newProgress >= 100 && rem.progress < 100) {
            setCompletedCount(c => c + 1);
            notify(`Threat ${rem.id} successfully remediated by ${rem.agent}`, 'success');
            
            setTimeout(async () => {
              try {
                const threats = await threatAPI.getAll();
                const threat = threats.find((t: any) => t.id === rem.id);
                if (threat) {
                  await fetch(`http://localhost:8080/api/threats/${rem.id}`, {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('shield_token')}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...threat, status: 'CONTAINED' })
                  });
                }
              } catch (error) {
                console.error('Failed to update threat:', error);
              }
            }, 1000);
          }
          
          const steps = rem.steps.map((step, idx) => {
            const stepProgress = idx * 20;
            if (newProgress > stepProgress && newProgress < stepProgress + 20) {
              return { ...step, status: 'in-progress' as const, time: `${((newProgress - stepProgress) / 20 * 6).toFixed(1)}s` };
            } else if (newProgress >= stepProgress + 20) {
              return { ...step, status: 'completed' as const, time: `${(Math.random() * 5 + 1).toFixed(1)}s` };
            }
            return step;
          });
          
          return { ...rem, progress: newProgress, steps };
        }).filter(rem => rem.progress < 100);
      });
    }, 500);
    
    return () => clearInterval(updateProgress);
  }, [notify]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Autonomous Threat Remediation</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Watch agents neutralize threats in real-time</p>
        </div>
        <div className="flex gap-4">
          <div className={`px-6 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className="text-xs text-slate-500 uppercase font-bold">Active</p>
            <p className="text-2xl font-bold text-cyan-500">{activeRemediations.length}</p>
          </div>
          <div className={`px-6 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className="text-xs text-slate-500 uppercase font-bold">Completed</p>
            <p className="text-2xl font-bold text-green-500">{completedCount}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {activeRemediations.length === 0 ? (
          <div className={`glass-card rounded-xl border p-12 text-center ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <i className="fa-solid fa-shield-halved text-6xl text-green-500 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">All Clear</h3>
            <p className="text-slate-500">No active threats requiring remediation</p>
          </div>
        ) : (
          activeRemediations.map(rem => (
            <div key={rem.id} className={`glass-card rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{rem.threatType}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${rem.severity > 7 ? 'bg-red-500/20 text-red-500' : rem.severity > 5 ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                        SEVERITY {rem.severity}/10
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      <span className="font-mono">{rem.sourceIP}</span> → <span className="font-semibold">{rem.targetSystem}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Assigned Agent</p>
                    <p className="text-cyan-500 font-bold font-mono">{rem.agent}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        style={{ width: `${rem.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold font-mono">{Math.round(rem.progress)}%</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <i className="fa-solid fa-robot mr-2"></i>
                  {rem.action}
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {rem.steps.map((step: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step.status === 'completed' ? 'bg-green-500 border-green-500' :
                        step.status === 'in-progress' ? 'bg-cyan-500 border-cyan-500 animate-pulse' :
                        `${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`
                      }`}>
                        {step.status === 'completed' ? (
                          <i className="fa-solid fa-check text-white text-sm"></i>
                        ) : step.status === 'in-progress' ? (
                          <i className="fa-solid fa-spinner animate-spin text-white text-sm"></i>
                        ) : (
                          <span className="text-slate-500 text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${step.status === 'pending' ? 'text-slate-400' : ''}`}>
                          {step.name}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreatRemediation;
