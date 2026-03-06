
import React, { useState, useEffect } from 'react';
import { useNotify } from '../App';
import { agentAPI } from '../services/api';
import { AgentDecision } from '../types';

const AgentMonitor: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [actingAgents, setActingAgents] = useState<Set<string>>(new Set());
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [agentStats, setAgentStats] = useState<any>({});

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await agentAPI.getAllDecisions();
        setDecisions(data.slice(0, 10));
        
        // Calculate agent statistics from real decisions
        const stats: any = {};
        const agentNames = ['SENTINEL-ALPHA', 'DEFENDER-PRIME', 'RISK-EVALUATOR', 'ANALYZER-BETA', 'WATCHER', 'ORCHESTRATOR'];
        
        agentNames.forEach(name => {
          const agentDecisions = data.filter((d: any) => d.agentName === name);
          const recentDecisions = agentDecisions.filter((d: any) => 
            new Date(d.createdAt).getTime() > Date.now() - 3600000 // Last hour
          );
          
          stats[name] = {
            totalDecisions: agentDecisions.length,
            recentDecisions: recentDecisions.length,
            avgConfidence: agentDecisions.length > 0 
              ? agentDecisions.reduce((sum: number, d: any) => sum + d.confidenceScore, 0) / agentDecisions.length 
              : 0,
            lastActive: agentDecisions.length > 0 
              ? new Date(agentDecisions[0].createdAt).getTime()
              : 0
          };
        });
        
        setAgentStats(stats);
      } catch (error) {
        console.error('Failed to fetch agent decisions:', error);
      }
    };
    fetchDecisions();
    const interval = setInterval(fetchDecisions, 10000);
    return () => clearInterval(interval);
  }, []);

  const getAgentData = (agentName: string) => {
    const stats = agentStats[agentName] || { totalDecisions: 0, recentDecisions: 0, avgConfidence: 0, lastActive: 0 };
    const isActive = stats.lastActive > Date.now() - 300000; // Active in last 5 min
    const load = Math.min(95, Math.max(5, stats.recentDecisions * 15 + (Math.random() * 10)));
    
    let status = 'Healthy';
    if (stats.recentDecisions > 5) status = 'Engaged';
    if (!isActive && stats.totalDecisions === 0) status = 'Standby';
    
    return { stats, status, load: Math.round(load) };
  };

  const agents = [
    { name: 'SENTINEL-ALPHA', displayName: 'Sentinel Alpha', desc: 'System isolation and containment specialist' },
    { name: 'DEFENDER-PRIME', displayName: 'Defender Prime', desc: 'Network perimeter defense and IP blocking' },
    { name: 'RISK-EVALUATOR', displayName: 'Risk Evaluator', desc: 'Threat assessment and surveillance escalation' },
    { name: 'ANALYZER-BETA', displayName: 'Analyzer Beta', desc: 'Deep packet inspection and forensic analysis' },
    { name: 'WATCHER', displayName: 'Watcher', desc: 'Continuous monitoring and activity logging' },
    { name: 'ORCHESTRATOR', displayName: 'Orchestrator', desc: 'Honeypot deployment and deception tactics' },
  ];

  const handleAction = (agentName: string, action: string) => {
    if (actingAgents.has(agentName)) return;
    
    setActingAgents(prev => new Set(prev).add(agentName));
    notify(`${action} sequence initiated for ${agentName}...`, action === 'REBOOT' ? 'warning' : 'info');
    
    setTimeout(() => {
      setActingAgents(prev => {
        const next = new Set(prev);
        next.delete(agentName);
        return next;
      });
      notify(`${agentName} ${action.toLowerCase()}ed and synchronized.`, "success");
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Multi-Agent Hive</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time telemetry of autonomous decision modules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(a => {
          const { stats, status, load } = getAgentData(a.name);
          const isActing = actingAgents.has(a.name);
          const uptime = stats.totalDecisions > 0 
            ? `${Math.floor((Date.now() - stats.lastActive) / 3600000)}h ago`
            : 'Standby';
          
          return (
            <div key={a.name} 
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm';
                modal.innerHTML = `
                  <div class="${isDarkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-slate-200'} border rounded-2xl p-8 max-w-2xl w-full">
                    <div class="flex justify-between items-start mb-6">
                      <div>
                        <h3 class="text-2xl font-bold">${a.displayName}</h3>
                        <p class="text-cyan-600 dark:text-cyan-400 font-mono text-sm">Status: ${status} | Load: ${load}%</p>
                      </div>
                      <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                        <i class="fa-solid fa-xmark text-xl"></i>
                      </button>
                    </div>
                    <div class="space-y-4">
                      <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                        <p class="text-xs uppercase font-bold text-slate-500 mb-2">Description</p>
                        <p class="${isDarkMode ? 'text-slate-300' : 'text-slate-700'}">${a.desc}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                          <p class="text-xs uppercase font-bold text-slate-500 mb-1">Current Load</p>
                          <p class="text-2xl font-bold ${load > 80 ? 'text-red-500' : 'text-cyan-500'}">${load}%</p>
                        </div>
                        <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                          <p class="text-xs uppercase font-bold text-slate-500 mb-1">Avg Confidence</p>
                          <p class="font-mono text-lg font-bold">${(stats.avgConfidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                        <p class="text-xs uppercase font-bold text-slate-500 mb-2">Recent Activity</p>
                        <div class="space-y-1 font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}">
                          <p>• Total decisions: ${stats.totalDecisions}</p>
                          <p>• Last hour: ${stats.recentDecisions} decisions</p>
                          <p>• Last active: ${uptime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
                document.body.appendChild(modal);
              }}
              className={`glass-card rounded-xl border transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer ${isActing ? 'border-amber-500 scale-[0.98] opacity-80' : `${isDarkMode ? 'border-slate-800 hover:border-cyan-500/50' : 'border-slate-200 hover:border-cyan-200 shadow-sm'}`}`}>
              <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                <h3 className="font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{a.displayName}</h3>
                {isActing ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 animate-pulse border border-amber-500/20 uppercase">PROCESSING</span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                    status === 'Healthy' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    status === 'Engaged' ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' :
                    'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  } uppercase`}>{status}</span>
                )}
              </div>
              <div className="p-5 space-y-4 flex-1">
                <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px] leading-relaxed">{a.desc}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span className="font-bold uppercase tracking-tighter">Current Load</span>
                    <span className={`font-bold ${load > 80 ? 'text-red-500' : 'text-slate-500'}`}>{load}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-full transition-all duration-1000 ${load > 80 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]'}`} 
                      style={{ width: `${load}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`flex justify-between items-center pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Decisions</div>
                  <div className="text-xs font-mono text-slate-400">{stats.totalDecisions} total</div>
                </div>
              </div>
              <div className={`px-5 py-3 flex gap-3 ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <button 
                  disabled={isActing}
                  onClick={(e) => { e.stopPropagation(); handleAction(a.name, 'REBOOT'); }}
                  className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline disabled:opacity-30 uppercase tracking-widest"
                >
                  REBOOT
                </button>
                <button 
                  disabled={isActing}
                  onClick={(e) => { e.stopPropagation(); handleAction(a.name, 'RECONFIGURE'); }}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 disabled:opacity-30 uppercase tracking-widest"
                >
                  RECONFIGURE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`glass-card rounded-xl border p-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Recent Agent Decisions (Live)</h3>
            <span className={`text-[10px] font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>AUTO-REFRESH 10s</span>
         </div>
         <div className={`rounded-xl border p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-2 shadow-inner ${isDarkMode ? 'bg-slate-950 border-slate-800 text-green-500/80' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
            {decisions.length > 0 ? decisions.map(d => (
              <div key={d.id} className={`flex gap-4 border-b pb-2 hover:bg-black/5 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`} onClick={() => notify(`Decision ${d.id}: ${d.decisionSummary}`)}>
                <span className="text-slate-500 shrink-0 font-bold">[{new Date(d.createdAt).toLocaleTimeString()}]</span>
                <span><span className="text-cyan-600 dark:text-cyan-400 font-bold">[{d.agentName}]</span> {d.decisionSummary.substring(0, 80)}...</span>
              </div>
            )) : (
              <div className="text-center text-slate-500 italic py-8">No agent decisions yet. Waiting for threats...</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AgentMonitor;
