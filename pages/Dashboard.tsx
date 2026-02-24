
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { AgentDecision } from '../types';
import { useNotify } from '../App';

const Dashboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  
  const [stats] = useState({
    total: 1248,
    active: 14,
    severity: 7.8,
    containment: 94.2
  });

  const [trendData] = useState([
    { time: '00:00', value: 34 },
    { time: '04:00', value: 45 },
    { time: '08:00', value: 28 },
    { time: '12:00', value: 89 },
    { time: '16:00', value: 65 },
    { time: '20:00', value: 42 },
    { time: '23:59', value: 55 },
  ]);

  const [distributionData] = useState([
    { name: 'DDoS', value: 400, color: '#ef4444' },
    { name: 'SQLi', value: 300, color: '#f59e0b' },
    { name: 'Phishing', value: 300, color: '#3b82f6' },
    { name: 'Malware', value: 200, color: '#10b981' },
  ]);

  const [decisions] = useState<AgentDecision[]>([
    {
      id: '1',
      agentName: 'Sentinel-Alpha',
      decisionSummary: 'Isolating System-04 due to anomalous outbound traffic.',
      confidenceScore: 0.98,
      linkedThreatId: 'TR-902',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      agentName: 'Risk-Evaluator',
      decisionSummary: 'Upgraded Threat Level to CRITICAL for IP 192.168.1.45.',
      confidenceScore: 0.85,
      linkedThreatId: 'TR-903',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      agentName: 'Orchestrator',
      decisionSummary: 'Deploying Deceptive Honeypot nodes in Sector G.',
      confidenceScore: 0.92,
      linkedThreatId: 'TR-904',
      createdAt: new Date().toISOString()
    }
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

              <button 
                onClick={() => {
                  notify(`Node ${selectedNode} isolated for deep inspection`, "warning");
                  setSelectedNode(null);
                }}
                className={`w-full py-3 font-bold rounded-xl transition-all border ${isDarkMode ? 'bg-red-600/20 hover:bg-red-600 border-red-500/50 text-red-500 hover:text-white' : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-200'}`}
              >
                ISOLATE NODE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Events" value={stats.total} icon="fa-database" color="text-cyan-600 dark:text-cyan-400" onClick={() => notify("Global telemetry log access synchronized")} isDarkMode={isDarkMode} />
        <MetricCard label="Active Threats" value={stats.active} icon="fa-radiation" color="text-red-500" pulse onClick={() => notify("Immediate intervention required in 3 sectors", "error")} isDarkMode={isDarkMode} />
        <MetricCard label="Avg Severity" value={stats.severity} icon="fa-fire" color="text-amber-500" onClick={() => notify("Severity score recalculated based on current heuristics")} isDarkMode={isDarkMode} />
        <MetricCard label="Containment Rate" value={`${stats.containment}%`} icon="fa-shield-halved" color="text-green-500" onClick={() => notify("Current containment strategy successful", "success")} isDarkMode={isDarkMode} />
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
            {Array.from({ length: 50 }).map((_, i) => {
              const status = i === 12 || i === 44 ? 'critical' : i === 7 || i === 29 ? 'warning' : 'healthy';
              return (
                <div 
                  key={i} 
                  onClick={() => handleNodeClick(i + 1)}
                  className={`cursor-pointer rounded-sm transition-all duration-300 flex items-center justify-center text-[8px] font-mono border hover:scale-110 hover:z-10 ${
                    status === 'critical' ? 'bg-red-500/40 border-red-500 animate-pulse' :
                    status === 'warning' ? 'bg-amber-500/20 border-amber-500' :
                    `${isDarkMode ? 'bg-slate-800/40 border-slate-700 hover:border-cyan-500' : 'bg-slate-100 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50'}`
                  } shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]`}
                  title={`Node ${i+1}: ${status.toUpperCase()}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className={`glass-card rounded-xl p-6 border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
           <h3 className="font-bold text-lg mb-6">Threat Vectors</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => notify(`Filtering view for ${entry.name} vectors`)}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                      border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`, 
                      borderRadius: '8px',
                      color: isDarkMode ? '#f8fafc' : '#0f172a'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4">
              {distributionData.map(d => (
                <div key={d.name} className={`flex items-center gap-2 text-xs cursor-pointer p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`} onClick={() => notify(`Drill-down: ${d.name}`)}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-slate-500 dark:text-slate-400">{d.name}</span>
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
                <XAxis dataKey="time" stroke={isDarkMode ? '#475569' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDarkMode ? '#475569' : '#94a3b8'} fontSize={10} />
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
                onClick={() => notify(`Viewing decision details for ${d.id}`)}
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
