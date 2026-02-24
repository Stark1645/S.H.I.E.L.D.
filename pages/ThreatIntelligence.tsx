
import React, { useState, useMemo } from 'react';
import { ThreatEvent, ThreatStatus } from '../types';
import { useNotify } from '../App';

const ThreatIntelligence: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [filterText, setFilterText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const threats: ThreatEvent[] = [
    {
      id: 'TR-902',
      sourceIP: '104.18.23.45',
      targetSystem: 'API-Gateway-Primary',
      threatType: 'DDoS / SYN Flood',
      severityScore: 9.4,
      intentClassification: 'Resource Exhaustion',
      status: ThreatStatus.CONTAINED,
      timestamp: new Date().toISOString()
    },
    {
      id: 'TR-903',
      sourceIP: '192.168.1.101',
      targetSystem: 'User-DB-Master',
      threatType: 'SQL Injection',
      severityScore: 8.7,
      intentClassification: 'Data Exfiltration',
      status: ThreatStatus.DETECTED,
      timestamp: new Date().toISOString()
    },
    {
      id: 'TR-904',
      sourceIP: '45.132.8.12',
      targetSystem: 'Worker-Node-07',
      threatType: 'Reverse Shell',
      severityScore: 9.8,
      intentClassification: 'System Takeover',
      status: ThreatStatus.SIMULATED,
      timestamp: new Date().toISOString()
    },
    {
      id: 'TR-905',
      sourceIP: '172.24.5.11',
      targetSystem: 'Auth-Cluster',
      threatType: 'Credential Stuffing',
      severityScore: 6.2,
      intentClassification: 'Account Takeover',
      status: ThreatStatus.RESOLVED,
      timestamp: new Date().toISOString()
    }
  ];

  const filteredThreats = useMemo(() => {
    return threats.filter(t => 
      t.id.toLowerCase().includes(filterText.toLowerCase()) ||
      t.sourceIP.includes(filterText) ||
      t.threatType.toLowerCase().includes(filterText.toLowerCase()) ||
      t.targetSystem.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    notify("Compiling cryptographic threat report...", "info");
    setTimeout(() => {
      setIsGenerating(false);
      notify("Report generated and saved to Secure Vault", "success");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Threat Intelligence</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed analysis of active and resolved security events.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search Intelligence..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:border-cyan-500 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}
            />
          </div>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`px-4 py-2 bg-cyan-600 rounded-lg text-sm font-semibold text-white hover:bg-cyan-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10 ${isGenerating ? 'opacity-50 cursor-wait' : 'active:scale-95'}`}
          >
            {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-file-contract"></i>}
            <span className="hidden sm:inline">Generate Report</span>
          </button>
        </div>
      </div>

      <div className={`glass-card rounded-xl border overflow-hidden shadow-xl ${isDarkMode ? 'border-slate-800' : 'border-slate-200 shadow-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`border-b text-slate-500 uppercase text-[10px] font-mono tracking-widest ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <tr>
                <th className="px-6 py-4">Threat ID</th>
                <th className="px-4 py-4">Source IP</th>
                <th className="px-4 py-4">Target System</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Severity</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/50' : 'divide-slate-200'}`}>
              {filteredThreats.length > 0 ? filteredThreats.map((t) => (
                <tr key={t.id} className="hover:bg-cyan-500/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-cyan-600 dark:text-cyan-400 font-bold group-hover:underline cursor-pointer" onClick={() => notify(`Opening detailed log for ${t.id}`)}>{t.id}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs">{t.sourceIP}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 text-xs font-semibold">{t.targetSystem}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{t.threatType}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 w-12 h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className={`h-full transition-all duration-1000 ${t.severityScore > 9 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : t.severityScore > 7 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${t.severityScore * 10}%` }}></div>
                      </div>
                      <span className="font-bold w-6 text-xs">{t.severityScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${
                      t.status === ThreatStatus.CONTAINED ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                      t.status === ThreatStatus.DETECTED ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                      t.status === ThreatStatus.RESOLVED ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                      'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-1">
                    <button 
                      onClick={() => notify(`Analyzing source origin for ${t.sourceIP}...`)}
                      className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-2 transition-transform hover:scale-125"
                      title="Trace Origin"
                    >
                      <i className="fa-solid fa-crosshairs"></i>
                    </button>
                    <button 
                      onClick={() => notify(`Viewing forensic evidence for ${t.id}`)}
                      className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-2 transition-transform hover:scale-125"
                      title="View Evidence"
                    >
                      <i className="fa-solid fa-magnifying-glass-plus"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                    No threats found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligence;
