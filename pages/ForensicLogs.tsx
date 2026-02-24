
import React, { useState, useMemo } from 'react';
import { LogType } from '../types';
import { useNotify } from '../App';

const ForensicLogs: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const logs = [
    { id: 1, type: LogType.SECURITY, msg: 'Firewall drop from 103.45.1.2: SQL Injection attempt detected.', time: '2 mins ago', details: 'Target: UserDB-Prod-01, Vector: Union-Based Injection, Payload: SELECT * FROM users...' },
    { id: 2, type: LogType.AGENT, msg: 'Sentinel-Alpha: Initiating process memory scan on WebNode-01.', time: '5 mins ago', details: 'Scanning for known ransomware signatures: Wannacry-X, Locky-2.0.' },
    { id: 3, type: LogType.SYSTEM, msg: 'Database replication latency exceeded 200ms.', time: '12 mins ago', details: 'Region: US-EAST-1, Current: 245ms, Threshold: 200ms.' },
    { id: 4, type: LogType.ERROR, msg: 'Authentication service heartbeat timeout.', time: '15 mins ago', details: 'Instance: Auth-Svc-A, Status: Unresponsive, Auto-Restarting...' },
    { id: 5, type: LogType.SECURITY, msg: 'Unauthorized SSH attempt from unknown origin. Brute force suspected.', time: '22 mins ago', details: 'Attempts: 45 in 2 minutes, Origin: 45.12.89.21 (VPN), Outcome: IP Banned.' },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(l => 
      l.msg.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleDownload = () => {
    setIsDownloading(true);
    notify("Preparing encrypted log bundle for export...", "info");
    setTimeout(() => {
      setIsDownloading(false);
      notify("Log export downloaded (shield_logs_audit.pdf)", "success");
    }, 2000);
  };

  const getLogStyle = (type: LogType) => {
    switch(type) {
      case LogType.ERROR: return isDarkMode ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-red-600 bg-red-50 border-red-100';
      case LogType.SECURITY: return isDarkMode ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-amber-600 bg-amber-50 border-amber-100';
      case LogType.AGENT: return isDarkMode ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-cyan-600 bg-cyan-50 border-cyan-100';
      default: return isDarkMode ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Forensic Timeline</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Immutable audit trail of all system activities.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                placeholder="Filter logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:border-cyan-500 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`} 
              />
           </div>
           <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center ${isDownloading ? 'animate-pulse opacity-50' : 'hover:scale-110 active:scale-95'} ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-300 hover:bg-slate-50 shadow-sm'}`}
              title="Download Logs"
           >
             {isDownloading ? <i className="fa-solid fa-spinner animate-spin text-cyan-600"></i> : <i className="fa-solid fa-download text-slate-600 dark:text-slate-400"></i>}
           </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredLogs.length > 0 ? filteredLogs.map(log => (
          <div 
            key={log.id} 
            onClick={() => notify(`Trace Record ${log.id}: ${log.details}`)}
            className={`glass-card p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all cursor-pointer group active:scale-[0.99] ${isDarkMode ? 'border-slate-800 hover:border-cyan-500/30' : 'border-slate-200 hover:border-cyan-200 shadow-sm'}`}
          >
            <div className={`px-2 py-1 rounded text-[10px] font-bold font-mono border min-w-[75px] text-center uppercase tracking-tighter ${getLogStyle(log.type)}`}>
              {log.type}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>{log.msg}</p>
            </div>
            <div className={`text-[10px] font-mono whitespace-nowrap px-2 py-1 rounded hidden sm:block ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-500'}`}>
              {log.time}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
              <i className="fa-solid fa-chevron-right text-slate-400"></i>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/20">
             NO FORENSIC DATA MATCHING: "{searchQuery}"
          </div>
        )}
      </div>

      <div className={`p-8 rounded-xl border border-dashed text-center flex flex-col items-center space-y-4 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
         <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
           <i className="fa-solid fa-cloud-arrow-down text-xl"></i>
         </div>
         <div>
           <p className="text-slate-500 text-sm font-medium">Viewing local session buffer (last 50 entries).</p>
           <p className="text-slate-400 text-xs mt-1">Full immutable archives are accessible via Level 8 tactical clearance.</p>
         </div>
         <button 
           onClick={() => notify("Connecting to Cloud Archive... Requesting clearance.", "warning")}
           className={`px-6 py-2 text-xs font-bold rounded-lg border transition-all ${isDarkMode ? 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800' : 'text-slate-600 border-slate-300 hover:bg-white hover:border-cyan-500 hover:text-cyan-600 shadow-sm'}`}
         >
           BROWSE CLOUD ARCHIVES
         </button>
      </div>
    </div>
  );
};

export default ForensicLogs;
