
import React, { useState, useEffect } from 'react';
import { useNotify } from '../App';

const SimulationControl: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [activeSim, setActiveSim] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [intensity, setIntensity] = useState(50);
  const [velocity, setVelocity] = useState(30);

  useEffect(() => {
    let interval: number;
    if (activeSim) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (Math.random() * 5 + 1);
        });
      }, 300);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [activeSim]);

  useEffect(() => {
    if (progress >= 100 && activeSim) {
      notify(`Simulation [${activeSim}] successful. All containment protocols verified.`, "success");
      setActiveSim(null);
    }
  }, [progress, activeSim]);

  const startSimulation = (name: string) => {
    if (activeSim) return;
    setActiveSim(name);
    notify(`Initializing War Game: ${name}`, "warning");
  };

  const scenarios = [
    { id: 1, name: 'Distributed Ransomware Burst', complexity: 'High', duration: '12m', icon: 'fa-lock' },
    { id: 2, name: 'State-Sponsor Data Siphon', complexity: 'Critical', duration: '45m', icon: 'fa-user-secret' },
    { id: 3, name: 'Cloud Config Poisoning', complexity: 'Medium', duration: '8m', icon: 'fa-cloud' },
    { id: 4, name: 'DNS Hijack / Redirect', complexity: 'Low', duration: '5m', icon: 'fa-globe' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Simulation Engine</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stress test S.H.I.E.L.D with synthetic threat vectors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`glass-card rounded-xl border p-6 relative overflow-hidden ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          {activeSim && (
             <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <i className="fa-solid fa-atom animate-spin text-4xl text-cyan-600 dark:text-cyan-500"></i>
                <div>
                   <h4 className="text-lg font-bold">RUNNING SIMULATION</h4>
                   <p className="text-cyan-600 dark:text-cyan-400 font-mono text-xs">{activeSim}</p>
                </div>
                <div className={`w-full max-w-xs h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                   <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <button 
                  onClick={() => { notify("Aborting simulation sequence...", "error"); setActiveSim(null); }}
                  className="px-4 py-1 text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest transition-colors"
                >
                  ABORT SESSION
                </button>
             </div>
          )}
          
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-vial text-cyan-600 dark:text-cyan-400"></i>
            Active Scenario Parameters
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Threat Intensity</label>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">{intensity}%</span>
                </div>
                <input 
                  type="range" 
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Escalation Velocity</label>
                  <span className="text-[10px] font-mono text-amber-600 font-bold">{velocity}%</span>
                </div>
                <input 
                  type="range" 
                  value={velocity}
                  onChange={(e) => setVelocity(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none" 
                />
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border group transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/30' : 'bg-slate-50 border-slate-200 hover:border-cyan-300'}`}>
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                 Running a simulation will trigger the <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">PredictiveSimulationAgent</span>. All logs will be marked as <span className={`px-1 rounded font-bold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>[SIMULATED]</span>.
               </p>
            </div>
            
            <button 
              onClick={() => startSimulation("Manual Tactical Stress Test")}
              disabled={!!activeSim}
              className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 border ${activeSim ? 'bg-slate-300 text-slate-500 border-transparent cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 border-cyan-400/20'}`}
            >
              {activeSim ? 'WAR ROOM LOCKED' : 'INITIALIZE WAR GAME'}
            </button>
          </div>
        </div>

        <div className={`glass-card rounded-xl border overflow-hidden flex flex-col ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
            <h3 className="font-bold text-sm">Preset Scenarios</h3>
            <span className="text-[10px] text-slate-500 font-mono">4 AVAILABLE</span>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[18rem]">
            {scenarios.map(s => (
              <div 
                key={s.id} 
                onClick={() => startSimulation(s.name)}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all cursor-pointer group hover:scale-[1.02] ${activeSim ? 'opacity-40 border-slate-200 pointer-events-none' : `${isDarkMode ? 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50' : 'border-slate-200 hover:border-cyan-200 hover:bg-white shadow-sm'}`}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-inner ${isDarkMode ? 'bg-slate-800 text-slate-400 group-hover:text-cyan-400' : 'bg-slate-100 text-slate-500 group-hover:text-cyan-600'}`}>
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold transition-colors">{s.name}</h4>
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">{s.complexity} • {s.duration}</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  DEPLOY <i className="fa-solid fa-chevron-right ml-1"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`glass-card rounded-xl border p-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Historical Simulation Effectiveness</h3>
          <div className="flex gap-2">
            <button onClick={() => notify("View updated to Weekly interval")} className={`px-2 py-1 text-[10px] rounded hover:bg-cyan-500/20 transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>WEEK</button>
            <button className="px-2 py-1 bg-cyan-600 text-[10px] rounded text-white font-bold">MONTH</button>
          </div>
        </div>
        <div className="flex items-end gap-2 h-32 px-2 overflow-x-auto pb-2">
           {[65, 78, 45, 90, 82, 88, 95, 70, 85, 92, 77, 89, 94, 60, 81].map((v, i) => (
             <div 
               key={i} 
               onClick={() => notify(`Session record ${i + 1}: ${v}% containment effectiveness`)}
               className={`flex-1 min-w-[12px] rounded-t-lg relative group cursor-pointer transition-colors ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-200 hover:bg-slate-300'}`}
             >
               <div className="absolute bottom-0 w-full bg-cyan-500 rounded-t-lg transition-all duration-1000 group-hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" style={{ height: `${v}%` }}></div>
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[10px] bg-slate-900 text-white px-2 py-1 rounded border border-slate-700 z-10 whitespace-nowrap shadow-xl">
                 {v}%
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationControl;
