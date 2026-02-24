
import React, { useState } from 'react';
import { useNotify } from '../App';

const AgentMonitor: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [actingAgents, setActingAgents] = useState<Set<string>>(new Set());

  const agents = [
    { name: 'MonitoringAgent', status: 'Healthy', load: 12, uptime: '142d 4h', desc: 'Ingesting raw telemetry' },
    { name: 'RiskIntentAgent', status: 'Healthy', load: 45, uptime: '142d 4h', desc: 'Heuristic intent analysis' },
    { name: 'PredictiveSimAgent', status: 'Degraded', load: 88, uptime: '12d 1h', desc: 'Running future-state simulations' },
    { name: 'HeadOrchestrator', status: 'Healthy', load: 5, uptime: '304d 9h', desc: 'Strategy selection engine' },
    { name: 'DefenseDeception', status: 'Engaged', load: 62, uptime: '45d 12h', desc: 'Executing honeypot deployment' },
    { name: 'TrafficScrubber', status: 'Healthy', load: 24, uptime: '89d 22h', desc: 'Real-time payload filtering' },
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
          const isActing = actingAgents.has(a.name);
          return (
            <div key={a.name} className={`glass-card rounded-xl border transition-all duration-500 overflow-hidden flex flex-col group ${isActing ? 'border-amber-500 scale-[0.98] opacity-80' : `${isDarkMode ? 'border-slate-800 hover:border-cyan-500/50' : 'border-slate-200 hover:border-cyan-200 shadow-sm'}`}`}>
              <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                <h3 className="font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{a.name}</h3>
                {isActing ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 animate-pulse border border-amber-500/20 uppercase">PROCESSING</span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                    a.status === 'Healthy' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    a.status === 'Engaged' ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' :
                    'bg-red-500/10 text-red-600 border-red-500/20'
                  } uppercase`}>{a.status}</span>
                )}
              </div>
              <div className="p-5 space-y-4 flex-1">
                <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px] leading-relaxed">{a.desc}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span className="font-bold uppercase tracking-tighter">Current Load</span>
                    <span className={`font-bold ${a.load > 80 ? 'text-red-500' : 'text-slate-500'}`}>{a.load}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-full transition-all duration-1000 ${a.load > 80 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]'}`} 
                      style={{ width: `${a.load}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`flex justify-between items-center pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">System Uptime</div>
                  <div className="text-xs font-mono text-slate-400">{a.uptime}</div>
                </div>
              </div>
              <div className={`px-5 py-3 flex gap-3 ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <button 
                  disabled={isActing}
                  onClick={() => handleAction(a.name, 'REBOOT')}
                  className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline disabled:opacity-30 uppercase tracking-widest"
                >
                  REBOOT
                </button>
                <button 
                  disabled={isActing}
                  onClick={() => handleAction(a.name, 'RECONFIGURE')}
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
            <h3 className="font-bold">Inter-Agent Communication (RPC Logs)</h3>
            <button onClick={() => notify("RPC stream paused for manual review", "warning")} className={`text-[10px] font-bold px-3 py-1 rounded transition-colors ${isDarkMode ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}>
              PAUSE STREAM
            </button>
         </div>
         <div className={`rounded-xl border p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-2 shadow-inner ${isDarkMode ? 'bg-slate-950 border-slate-800 text-green-500/80' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
            <div className={`flex gap-4 border-b pb-2 hover:bg-black/5 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`} onClick={() => notify("Trace details for TR-902-A encrypted")}>
              <span className="text-slate-500 shrink-0 font-bold">[12:04:12]</span>
              <span>CALL <span className="text-cyan-600 dark:text-cyan-400 font-bold">[RiskIntentAgent]</span> -&gt; <span className="text-amber-600 dark:text-amber-500 font-bold">[HeadOrchestrator]</span> Payload: <code className={`px-1 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200 text-slate-900 font-bold'}`}>{"{ threatId: 'TR-902', severity: 9.2 }"}</code></span>
            </div>
            <div className={`flex gap-4 border-b pb-2 hover:bg-black/5 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
              <span className="text-slate-500 shrink-0 font-bold">[12:04:13]</span>
              <span>RESP <span className="text-amber-600 dark:text-amber-500 font-bold">[HeadOrchestrator]</span> <span className="text-green-600 dark:text-green-500 font-bold">OK</span>: Ack Strategy 'ISOLATION_V4'</span>
            </div>
            <div className={`flex gap-4 border-b pb-2 hover:bg-black/5 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
              <span className="text-slate-500 shrink-0 font-bold">[12:04:15]</span>
              <span>CALL <span className="text-amber-600 dark:text-amber-500 font-bold">[HeadOrchestrator]</span> -&gt; <span className="text-cyan-600 dark:text-cyan-400 font-bold">[DefenseDeception]</span> Trigger: Deploy Honeypot-B</span>
            </div>
            <div className={`flex gap-4 border-b pb-2 hover:bg-black/5 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
              <span className="text-cyan-600 dark:text-cyan-400 shrink-0 font-bold">[12:04:22]</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">EVENT: Honeypot-B active at 172.16.0.45</span>
            </div>
            <div className={`flex gap-4 border-b pb-2 hover:bg-black/5 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
              <span className="text-slate-500 shrink-0 font-bold">[12:04:30]</span>
              <span className="italic opacity-80">SYNC: Multi-Agent state consistent across cluster (6 nodes).</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AgentMonitor;
