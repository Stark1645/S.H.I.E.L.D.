
import React, { useState } from 'react';
import { useAuth } from '../App';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('mock-jwt-token');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0e14] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-md space-y-8 z-10 animate-fade-in">
        <div className="text-center space-y-4">
           <div className="inline-flex w-20 h-20 bg-cyan-600 dark:bg-cyan-500 rounded-2xl items-center justify-center text-white dark:text-slate-900 shadow-2xl shadow-cyan-500/30 mb-2">
             <i className="fa-solid fa-shield-halved text-4xl"></i>
           </div>
           <div>
             <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white">S.H.I.E.L.D</h1>
             <p className="text-slate-500 dark:text-slate-400 text-xs font-mono tracking-widest uppercase mt-1">Tactical Operations Hub</p>
           </div>
        </div>

        <div className="glass-card rounded-2xl border p-8 shadow-2xl relative bg-white dark:bg-slate-900/80 border-slate-200 dark:border-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-1">Tactical ID</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  defaultValue="Agent_Coulson"
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-12 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-1">Security Key</label>
              <div className="relative">
                <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="password" 
                  defaultValue="********"
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-12 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter Passkey"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-cyan-600/20 transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  AUTHORIZING...
                </>
              ) : 'ESTABLISH LINK'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center">
             <p className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
               Clearance Level 7 Required
             </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center opacity-50 z-10">
        <p className="text-[9px] text-slate-500 font-mono tracking-widest">© 2025 S.H.I.E.L.D CYBER DIVISION • ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

export default Login;
