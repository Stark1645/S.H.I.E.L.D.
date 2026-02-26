
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { AgentDecision } from '../types';
import { useNotify } from '../App';
import { threatAPI, agentAPI } from '../services/api';

const Dashboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [nodeStates, setNodeStates] = useState<string[]>(Array(50).fill('healthy'));
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    severity: 0,
    containment: 0
  });

  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    active: 0,
    severity: 0,
    containment: 0
  });

  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [trendData, setTrendData] = useState(() => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({ time: i, value: 50 + Math.sin(i * 0.2) * 20 });
    }
    return data;
  });

  useEffect(() => {
    const updateTrend = setInterval(() => {
      setTrendData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1].value;
        const baseValue = stats.active > 0 ? stats.severity * 10 : 30;
        const noise = (Math.random() - 0.5) * 15;
        const newValue = Math.max(10, Math.min(100, baseValue + noise + Math.sin(Date.now() / 1000) * 10));
        
        newData.push({
          time: newData.length,
          value: newValue
        });
        return newData;
      });
    }, 100);
    return () => clearInterval(updateTrend);
  }, [stats]);

  useEffect(() => {
    const updateNodes = setInterval(() => {
      setNodeStates(prev => {
        const newStates = [...prev];
        if (Math.random() > 0.7) {
          const idx = Math.floor(Math.random() * 50);
          const states = ['healthy', 'warning', 'critical'];
          newStates[idx] = states[Math.floor(Math.random() * states.length)];
        }
        return newStates;
      });
    }, 2000);
    return () => clearInterval(updateNodes);
  }, []);

  useEffect(() => {
    const updateDistribution = setInterval(() => {
      setDistributionData(prev => prev.map(item => ({
        ...item,
        value: Math.max(100, Math.min(500, Math.round(item.value + (Math.random() - 0.5) * 50)))
      })));
    }, 4000);
    return () => clearInterval(updateDistribution);
  }, []);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, decisionsData] = await Promise.all([
          threatAPI.getStats(),
          agentAPI.getAllDecisions()
        ]);
        setStats(statsData);
        setDecisions(decisionsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateStats = () => {
      setAnimatedStats(prev => ({
        total: prev.total + (stats.total - prev.total) * 0.1,
        active: prev.active + (stats.active - prev.active) * 0.1,
        severity: prev.severity + (stats.severity - prev.severity) * 0.1,
        containment: prev.containment + (stats.containment - prev.containment) * 0.1
      }));
    };
    const interval = setInterval(animateStats, 50);
    return () => clearInterval(interval);
  }, [stats]);

  const [distributionData, setDistributionData] = useState([
    { name: 'DDoS', value: 400, color: '#ef4444' },
    { name: 'SQLi', value: 300, color: '#f59e0b' },
    { name: 'Phishing', value: 300, color: '#3b82f6' },
    { name: 'Malware', value: 200, color: '#10b981' },
  ]);

  const handleNodeClick = (id: number) => {
    setSelectedNode(id);
    notify(`Intercepting data stream from Node ${id}...`, "info");
  };

  return (
    <div className="space-y-6">
      {/* Node Detail Modal Overlay */}
      {selectedNode !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedNode(null)}>
          <div className={`glass-card w-full max-w-lg p-8 rounded-2xl border transition-all ${isDarkMode ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]' : 'border-cyan-200 shadow-xl'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">Node Analysis: {selectedNode}</h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">SEC-CLUSTER-7 / REGION-ALPHA</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status</p>
                  <p className="text-green-500 font-bold">OPERATIONAL</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Traffic Load</p>
                  <p className="font-bold">{Math.floor(Math.random() * 100)} Mbps</p>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <p className="text-cyan-600 dark:text-cyan-500/80">&gt;&gt;&gt; TRACING PACKET 0x4f2...</p>
                <p className="text-slate-500">&gt;&gt;&gt; SOURCE: 12.4.90.112</p>
                <p className="text-slate-500">&gt;&gt;&gt; DEST: INTERNAL_LB_01</p>
                <p className="text-green-600 font-bold">&gt;&gt;&gt; VERDICT: ALLOWED</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    notify(`Node ${selectedNode} isolated for deep inspection`, "warning");
                    setNodeStates(prev => {
                      const newStates = [...prev];
                      if (selectedNode !== null) newStates[selectedNode - 1] = 'critical';
                      return newStates;
                    });
                    setSelectedNode(null);
                  }}
                  className={`py-3 font-bold rounded-xl transition-all border ${isDarkMode ? 'bg-red-600/20 hover:bg-red-600 border-red-500/50 text-red-500 hover:text-white' : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-200'}`}
                >
                  ISOLATE NODE
                </button>
                <button 
                  onClick={() => {
                    notify(`Node ${selectedNode} restored to healthy state`, "success");
                    setNodeStates(prev => {
                      const newStates = [...prev];
                      if (selectedNode !== null) newStates[selectedNode - 1] = 'healthy';
                      return newStates;
                    });
                    setSelectedNode(null);
                  }}
                  className={`py-3 font-bold rounded-xl transition-all border ${isDarkMode ? 'bg-green-600/20 hover:bg-green-600 border-green-500/50 text-green-500 hover:text-white' : 'bg-green-50 hover:bg-green-600 text-green-600 hover:text-white border-green-200'}`}
                >
                  RESTORE NODE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Events" value={Math.round(animatedStats.total)} icon="fa-database" color="text-cyan-600 dark:text-cyan-400" onClick={() => notify("Global telemetry log access synchronized")} isDarkMode={isDarkMode} />
        <MetricCard label="Active Threats" value={Math.round(animatedStats.active)} icon="fa-radiation" color="text-red-500" pulse onClick={() => notify("Immediate intervention required in 3 sectors", "error")} isDarkMode={isDarkMode} />
        <MetricCard label="Avg Severity" value={Math.round(animatedStats.severity)} icon="fa-fire" color="text-amber-500" onClick={() => notify("Severity score recalculated based on current heuristics")} isDarkMode={isDarkMode} />
        <MetricCard label="Containment Rate" value={`${Math.round(animatedStats.containment)}%`} icon="fa-shield-halved" color="text-green-500" onClick={() => notify("Current containment strategy successful", "success")} isDarkMode={isDarkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap/System Map */}
        <div className={`glass-card rounded-xl p-6 border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <i className="fa-solid fa-network-wired text-cyan-600 dark:text-cyan-400"></i>
              Real-Time System Integrity Map
            </h3>
            <span className={`text-[10px] font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>LIVE SCANNING</span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 min-h-[16rem]">
            {nodeStates.map((status, i) => (
              <div 
                key={i} 
                onClick={() => handleNodeClick(i + 1)}
                className={`cursor-pointer rounded-sm transition-all duration-500 flex items-center justify-center text-[8px] font-mono border hover:scale-110 hover:z-10 ${
                  status === 'critical' ? 'bg-red-500/40 border-red-500 animate-pulse' :
                  status === 'warning' ? 'bg-amber-500/20 border-amber-500' :
                  `${isDarkMode ? 'bg-slate-800/40 border-slate-700 hover:border-cyan-500' : 'bg-slate-100 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50'}`
                } shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]`}
                title={`Node ${i+1}: ${status.toUpperCase()}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className={`glass-card rounded-xl p-6 border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
           <h3 className="font-bold text-lg mb-6">Threat Vectors</h3>
           <div className="w-full h-64 flex items-center justify-center">
             <svg width="200" height="200" viewBox="0 0 200 200">
               {distributionData.map((d, i) => {
                 const total = distributionData.reduce((sum, item) => sum + item.value, 0);
                 const startAngle = distributionData.slice(0, i).reduce((sum, item) => sum + (item.value / total) * 360, 0);
                 const angle = (d.value / total) * 360;
                 const endAngle = startAngle + angle;
                 const largeArc = angle > 180 ? 1 : 0;
                 const x1 = 100 + 70 * Math.cos((startAngle - 90) * Math.PI / 180);
                 const y1 = 100 + 70 * Math.sin((startAngle - 90) * Math.PI / 180);
                 const x2 = 100 + 70 * Math.cos((endAngle - 90) * Math.PI / 180);
                 const y2 = 100 + 70 * Math.sin((endAngle - 90) * Math.PI / 180);
                 const xi1 = 100 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
                 const yi1 = 100 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
                 const xi2 = 100 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
                 const yi2 = 100 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
                 return (
                   <path
                     key={i}
                     d={`M ${xi1} ${yi1} L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A 50 50 0 ${largeArc} 0 ${xi1} ${yi1} Z`}
                     fill={d.color}
                     className="cursor-pointer hover:opacity-80 transition-opacity"
                     onClick={() => notify(`${d.name}: ${d.value} incidents`)}
                   />
                 );
               })}
             </svg>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4">
              {distributionData.map(d => (
                <div key={d.name} className={`flex items-center gap-2 text-xs cursor-pointer p-2 rounded transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`} onClick={() => notify(`Drill-down: ${d.name} - ${d.value} incidents`)}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="font-medium">{d.name}</span>
                  <span className="text-slate-500 ml-auto">{d.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalation Trend */}
        <div className={`glass-card rounded-xl p-6 border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className="font-bold text-lg mb-6">Escalation Probability (24h)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke={isDarkMode ? '#475569' : '#94a3b8'} fontSize={10} hide />
                <YAxis stroke={isDarkMode ? '#475569' : '#94a3b8'} fontSize={10} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} vertical={false} />
                <Tooltip 
                   contentStyle={{ 
                     backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                     border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`, 
                     borderRadius: '8px',
                     color: isDarkMode ? '#f8fafc' : '#0f172a'
                    }}
                />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Activity Feed */}
        <div className={`glass-card rounded-xl border flex flex-col ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className="font-bold text-lg">Agent Decision Feed</h3>
            <button onClick={() => notify("Agent history log export triggered")} className="text-slate-500 hover:text-cyan-600 transition-colors">
              <i className="fa-solid fa-download"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] p-4 space-y-4">
            {decisions.map(d => (
              <div 
                key={d.id} 
                onClick={() => {
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm';
                  modal.innerHTML = `
                    <div class="${isDarkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-slate-200'} border rounded-2xl p-8 max-w-2xl w-full">
                      <div class="flex justify-between items-start mb-6">
                        <div>
                          <h3 class="text-2xl font-bold">${d.agentName}</h3>
                          <p class="text-cyan-600 dark:text-cyan-400 font-mono text-sm">Decision ID: ${d.id} | Threat ID: ${d.linkedThreatId}</p>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                          <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                      </div>
                      <div class="space-y-4">
                        <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                          <p class="text-xs uppercase font-bold text-slate-500 mb-2">Decision Summary</p>
                          <p class="${isDarkMode ? 'text-slate-300' : 'text-slate-700'}">${d.decisionSummary}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                            <p class="text-xs uppercase font-bold text-slate-500 mb-1">Confidence Score</p>
                            <p class="text-2xl font-bold text-cyan-500">${(d.confidenceScore * 100).toFixed(1)}%</p>
                          </div>
                          <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                            <p class="text-xs uppercase font-bold text-slate-500 mb-1">Timestamp</p>
                            <p class="font-mono text-sm">${new Date(d.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
                  document.body.appendChild(modal);
                }}
                className={`p-3 rounded-lg border-l-4 transition-all cursor-pointer group hover:scale-[1.01] ${isDarkMode ? 'bg-slate-800/50 border-cyan-500 hover:bg-slate-800' : 'bg-white border-cyan-600 hover:bg-slate-50 border-slate-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 group-hover:underline font-bold uppercase">{d.agentName}</span>
                  <span className="text-[10px] text-slate-500">{new Date(d.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{d.decisionSummary}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Confidence: {(d.confidenceScore * 100).toFixed(1)}%</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>ID: {d.linkedThreatId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string, value: string | number, icon: string, color: string, pulse?: boolean, onClick?: () => void, isDarkMode: boolean }> = ({ label, value, icon, color, pulse, onClick, isDarkMode }) => (
  <div 
    onClick={onClick}
    className={`glass-card p-5 rounded-xl border cursor-pointer group transition-all active:scale-95 ${isDarkMode ? 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50' : 'border-slate-200 hover:border-cyan-200 hover:bg-white'} ${pulse ? 'animate-pulse-red' : ''}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{label}</p>
        <h4 className={`text-2xl font-bold ${color}`}>{value}</h4>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
    </div>
  </div>
);

export default Dashboard;
