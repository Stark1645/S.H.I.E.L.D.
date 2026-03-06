
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ThreatIntelligence from './pages/ThreatIntelligence';
import SimulationControl from './pages/SimulationControl';
import AgentMonitor from './pages/AgentMonitor';
import ForensicLogs from './pages/ForensicLogs';
import ThreatRemediation from './pages/ThreatRemediation';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import SystemHealth from './pages/SystemHealth';
import PhaseFeatures from './pages/PhaseFeatures';
import Login from './pages/Login';
import JarvisChat from './components/JarvisChat';

// --- Contexts ---
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Notification Context ---
interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notify: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotify must be used within NotificationProvider");
  return context;
};

// --- Layout Component ---
const Layout: React.FC<{ children: React.ReactNode, isDarkMode: boolean, toggleDarkMode: () => void }> = ({ children, isDarkMode, toggleDarkMode }) => {
  const { logout } = useAuth();
  const { notify } = useNotify();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'War Room', icon: 'fa-shield-halved' },
    { path: '/intelligence', label: 'Intelligence', icon: 'fa-brain' },
    { path: '/analytics', label: 'Analytics', icon: 'fa-chart-line' },
    { path: '/phases', label: 'Phase 2,3,4', icon: 'fa-rocket' },
    { path: '/remediation', label: 'Remediation', icon: 'fa-wand-magic-sparkles' },
    { path: '/simulation', label: 'Simulation', icon: 'fa-microchip' },
    { path: '/agents', label: 'Agents', icon: 'fa-robot' },
    { path: '/health', label: 'System Health', icon: 'fa-heart-pulse' },
    { path: '/logs', label: 'Forensics', icon: 'fa-terminal' },
  ];

  const handleTerminate = () => {
    notify("Terminating tactical session...", "warning");
    setTimeout(logout, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-200' : 'light bg-slate-50 text-slate-900'}`}>
      {/* Top Header */}
      <header className={`h-16 border-b flex items-center justify-between px-6 glass-card sticky top-0 z-50 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => notify("S.H.I.E.L.D Core Systems Online")}>
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-shield-virus text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-cyan-600 dark:text-cyan-400">S.H.I.E.L.D</h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Autonomous Cyber Defense</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <span className="text-xs text-slate-500 uppercase font-bold mr-2">Status:</span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                OPERATIONAL
              </span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <span className="text-xs text-slate-500 uppercase font-bold mr-2">Agents:</span>
              <span className="text-xs font-bold text-cyan-500">6 ACTIVE</span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border cursor-pointer hover:scale-105 transition-transform ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} onClick={() => notify(`System Uptime: ${Math.floor(Math.random() * 100)}d ${Math.floor(Math.random() * 24)}h`)}>
              <i className="fa-solid fa-clock text-xs text-slate-500 mr-2"></i>
              <span className="text-xs font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div 
            className="hidden md:flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold animate-pulse cursor-help"
            onClick={() => notify("Multiple breach attempts detected in Sector 7", "error")}
          >
             <span className="w-2 h-2 bg-red-500 rounded-full"></span>
             <span>LIVE: SECTOR 7 ATTACK</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Toggle Theme"
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button 
            onClick={handleTerminate}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 hover:bg-red-600/20 hover:text-red-500 border-transparent hover:border-red-500/50' : 'bg-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-600 border-slate-300 hover:border-red-200'}`}
          >
            <i className="fa-solid fa-power-off"></i>
            <span className="hidden lg:inline">TERMINATE</span>
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <nav className={`border-r flex flex-col p-4 space-y-2 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            {!sidebarCollapsed && <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">Command Center</span>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
              title={sidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              <i className={`fa-solid ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </button>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${sidebarCollapsed ? 'justify-center' : ''} ${
                location.pathname === item.path 
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                : `${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              {!sidebarCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
              {!sidebarCollapsed && location.pathname === item.path && (
                <i className="fa-solid fa-chevron-right ml-auto text-xs"></i>
              )}
            </Link>
          ))}
          
          {!sidebarCollapsed && (
            <div className={`mt-auto p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">System Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Orchestrator</span>
                <span className="text-green-500 font-bold">ACTIVE</span>
              </div>
              <div className="w-full bg-slate-300 dark:bg-slate-700 h-1 rounded-full overflow-hidden cursor-help" onClick={() => notify("Core Orchestrator running at 95% efficiency")}>
                <div className="bg-green-500 h-full w-[95%]"></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Decoy Nodes</span>
                <span className="text-amber-500 font-bold">ENGAGED</span>
              </div>
              <div className="w-full bg-slate-300 dark:bg-slate-700 h-1 rounded-full overflow-hidden cursor-help" onClick={() => notify("Decoy fleet partially compromised by simulator")}>
                <div className="bg-amber-500 h-full w-[72%]"></div>
              </div>
            </div>
          </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- App Component ---
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('shield_session') === 'active';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('shield_theme') !== 'light';
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    localStorage.setItem('shield_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const notify = (message: string, type: Notification['type'] = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const login = (token: string) => {
    localStorage.setItem('shield_session', 'active');
    setIsAuthenticated(true);
    notify("Access Granted. Welcome back, Agent.", "success");
  };

  const logout = () => {
    localStorage.removeItem('shield_session');
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    notify(`Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`, "info");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <NotificationContext.Provider value={{ notify }}>
        {/* Notification Toast Overlay */}
        <div className="fixed bottom-6 right-6 z-[9999] space-y-2 pointer-events-none">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`pointer-events-auto px-6 py-3 rounded-xl border shadow-2xl flex items-center gap-3 animate-slide-in font-semibold text-sm transition-all duration-300 ${
                n.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400' :
                n.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400' :
                n.type === 'warning' ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400' :
                'bg-cyan-500/10 border-cyan-500/50 text-cyan-600 dark:text-cyan-400'
              }`}
            >
              <i className={`fa-solid ${
                n.type === 'success' ? 'fa-circle-check' :
                n.type === 'error' ? 'fa-triangle-exclamation' :
                n.type === 'warning' ? 'fa-circle-exclamation' :
                'fa-circle-info'
              }`}></i>
              {n.message}
            </div>
          ))}
        </div>

        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
                    <Route path="/intelligence" element={<ThreatIntelligence isDarkMode={isDarkMode} />} />
                    <Route path="/analytics" element={<AdvancedAnalytics isDarkMode={isDarkMode} />} />
                    <Route path="/phases" element={<PhaseFeatures isDarkMode={isDarkMode} />} />
                    <Route path="/remediation" element={<ThreatRemediation isDarkMode={isDarkMode} />} />
                    <Route path="/simulation" element={<SimulationControl isDarkMode={isDarkMode} />} />
                    <Route path="/agents" element={<AgentMonitor isDarkMode={isDarkMode} />} />
                    <Route path="/health" element={<SystemHealth isDarkMode={isDarkMode} />} />
                    <Route path="/logs" element={<ForensicLogs isDarkMode={isDarkMode} />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                  <JarvisChat isDarkMode={isDarkMode} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>

        <style>{`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.3s cubic-bezier(0, 0, 0.2, 1);
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out forwards;
          }
        `}</style>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
