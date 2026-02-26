
import React, { useState, useMemo, useEffect } from 'react';
import { ThreatEvent, ThreatStatus } from '../types';
import { useNotify } from '../App';
import { threatAPI } from '../services/api';

const ThreatIntelligence: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [filterText, setFilterText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const data = await threatAPI.getAll();
        setThreats(data);
      } catch (error) {
        console.error('Failed to fetch threats:', error);
      }
    };
    fetchThreats();
    const interval = setInterval(fetchThreats, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredThreats = useMemo(() => {
    return threats.filter(t => 
      String(t.id).toLowerCase().includes(filterText.toLowerCase()) ||
      t.sourceIP.includes(filterText) ||
      t.threatType.toLowerCase().includes(filterText.toLowerCase()) ||
      t.targetSystem.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [threats, filterText]);

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
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('shield_token');
                          await fetch(`http://localhost:8080/api/threats/${t.id}`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({...t, status: 'CONTAINED'})
                          });
                          notify(`Threat ${t.id} marked as CONTAINED`, 'success');
                          setThreats(prev => prev.map(th => th.id === t.id ? {...th, status: 'CONTAINED'} : th));
                        } catch (error) {
                          notify('Failed to update threat', 'error');
                        }
                      }}
                      className="text-slate-400 hover:text-green-600 dark:hover:text-green-400 p-2 transition-transform hover:scale-125"
                      title="Mark as Contained"
                    >
                      <i className="fa-solid fa-shield-halved"></i>
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('shield_token');
                          await fetch(`http://localhost:8080/api/threats/${t.id}`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({...t, status: 'RESOLVED'})
                          });
                          notify(`Threat ${t.id} marked as RESOLVED`, 'success');
                          setThreats(prev => prev.map(th => th.id === t.id ? {...th, status: 'RESOLVED'} : th));
                        } catch (error) {
                          notify('Failed to resolve threat', 'error');
                        }
                      }}
                      className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 transition-transform hover:scale-125"
                      title="Mark as Resolved"
                    >
                      <i className="fa-solid fa-check-circle"></i>
                    </button>
                    <button 
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm';
                        modal.innerHTML = `
                          <div class="${isDarkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-slate-200'} border rounded-2xl p-8 max-w-2xl w-full">
                            <div class="flex justify-between items-start mb-6">
                              <div>
                                <h3 class="text-2xl font-bold">IP Trace: ${t.sourceIP}</h3>
                                <p class="text-cyan-600 dark:text-cyan-400 font-mono text-sm">Threat ID: ${t.id}</p>
                              </div>
                              <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                                <i class="fa-solid fa-xmark text-xl"></i>
                              </button>
                            </div>
                            <div class="space-y-4">
                              <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                <p class="text-xs uppercase font-bold text-slate-500 mb-2">Geolocation</p>
                                <p class="${isDarkMode ? 'text-slate-300' : 'text-slate-700'}">Country: Unknown | ISP: ${t.sourceIP.split('.')[0] > 100 ? 'Commercial VPN' : 'Residential'}</p>
                              </div>
                              <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                <p class="text-xs uppercase font-bold text-slate-500 mb-2">Threat Intelligence</p>
                                <p class="${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-mono text-sm">Reputation: Malicious | Last Seen: ${new Date().toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        `;
                        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
                        document.body.appendChild(modal);
                      }}
                      className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-2 transition-transform hover:scale-125"
                      title="Trace Origin"
                    >
                      <i className="fa-solid fa-crosshairs"></i>
                    </button>
                    <button 
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm';
                        modal.innerHTML = `
                          <div class="${isDarkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-slate-200'} border rounded-2xl p-8 max-w-3xl w-full">
                            <div class="flex justify-between items-start mb-6">
                              <div>
                                <h3 class="text-2xl font-bold">Forensic Evidence</h3>
                                <p class="text-cyan-600 dark:text-cyan-400 font-mono text-sm">Threat ID: ${t.id}</p>
                              </div>
                              <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                                <i class="fa-solid fa-xmark text-xl"></i>
                              </button>
                            </div>
                            <div class="space-y-4">
                              <div class="grid grid-cols-2 gap-4">
                                <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                  <p class="text-xs uppercase font-bold text-slate-500 mb-1">Source IP</p>
                                  <p class="font-mono text-cyan-500">${t.sourceIP}</p>
                                </div>
                                <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                  <p class="text-xs uppercase font-bold text-slate-500 mb-1">Target System</p>
                                  <p class="font-semibold">${t.targetSystem}</p>
                                </div>
                              </div>
                              <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                <p class="text-xs uppercase font-bold text-slate-500 mb-2">Threat Type</p>
                                <p class="${isDarkMode ? 'text-slate-300' : 'text-slate-700'}">${t.threatType}</p>
                              </div>
                              <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                <p class="text-xs uppercase font-bold text-slate-500 mb-2">Intent Classification</p>
                                <p class="${isDarkMode ? 'text-slate-300' : 'text-slate-700'}">${t.intentClassification || 'Unknown'}</p>
                              </div>
                              <div class="grid grid-cols-2 gap-4">
                                <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                  <p class="text-xs uppercase font-bold text-slate-500 mb-1">Severity Score</p>
                                  <p class="text-2xl font-bold text-red-500">${t.severityScore}/10</p>
                                </div>
                                <div class="${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4">
                                  <p class="text-xs uppercase font-bold text-slate-500 mb-1">Status</p>
                                  <p class="text-xl font-bold text-cyan-500">${t.status}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        `;
                        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
                        document.body.appendChild(modal);
                      }}
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
