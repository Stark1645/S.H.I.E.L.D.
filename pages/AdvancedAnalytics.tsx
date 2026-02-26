import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useNotify } from '../App';
import api from '../services/api';

const AdvancedAnalytics: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [prediction, setPrediction] = useState<any>(null);
  const [patterns, setPatterns] = useState<any>(null);
  const [geolocation, setGeolocation] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [attackChain, setAttackChain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [pred, patt, geo, time, chain] = await Promise.all([
        api.get('/analytics/predictions'),
        api.get('/analytics/patterns'),
        api.get('/analytics/geolocation'),
        api.get('/analytics/timeline'),
        api.get('/analytics/attack-chain')
      ]);
      setPrediction(pred);
      setPatterns(patt);
      setGeolocation(Array.isArray(geo) ? geo : []);
      setTimeline(Array.isArray(time) ? time : []);
      setAttackChain(chain);
      setLoading(false);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setLoading(false);
    }
  };

  const radarData = prediction?.threatTrends ? Object.entries(prediction.threatTrends).map(([key, value]) => ({
    threat: key,
    frequency: value
  })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-cyan-500"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-chart-line text-cyan-500"></i>
          Advanced Threat Analytics
        </h2>
        <button onClick={() => { fetchAnalytics(); notify('Analytics refreshed', 'success'); }} className={`px-4 py-2 rounded-lg font-bold transition-all ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'} text-white`}>
          <i className="fa-solid fa-rotate mr-2"></i>Refresh
        </button>
      </div>

      {prediction && (
        <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-transparent' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-transparent'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-crystal-ball text-purple-500"></i>
                AI Threat Prediction
              </h3>
              <p className="text-sm text-slate-500 mt-1">Predictive intelligence based on historical patterns</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              {prediction.confidence}% Confidence
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Next Likely Threat</p>
              <p className="text-lg font-bold text-purple-500">{prediction.nextLikelyThreat}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Probability</p>
              <p className="text-lg font-bold text-orange-500">{prediction.probability}%</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Predicted Severity</p>
              <p className="text-lg font-bold text-red-500">{prediction.predictedSeverity}/10</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Time Window</p>
              <p className="text-lg font-bold text-cyan-500">{prediction.timeWindow}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patterns && (
          <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-red-500/30' : 'border-red-200'}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-red-500"></i>
              Attack Pattern Detection
            </h3>
            <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Risk Level</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  patterns.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                  patterns.riskLevel === 'MEDIUM' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-green-500/20 text-green-500'
                }`}>{patterns.riskLevel}</span>
              </div>
              <div className="text-2xl font-bold">{patterns.patternsDetected} Patterns Detected</div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {patterns.patterns && patterns.patterns.length > 0 ? patterns.patterns.map((p: any, i: number) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 ${
                  p.classification === 'COORDINATED_ATTACK' 
                    ? `border-red-500 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}` 
                    : `border-orange-500 ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm font-bold">{p.sourceIP}</span>
                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                      {p.attackCount} attacks
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.threatTypes && p.threatTypes.map((t: string, j: number) => (
                      <span key={j} className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">No patterns detected</p>}
            </div>
          </div>
        )}

        <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-radar text-cyan-500"></i>
            Threat Frequency Analysis
          </h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="threat" tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                <Radar name="Frequency" dataKey="frequency" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-slate-500">No threat data available</p>
            </div>
          )}
        </div>
      </div>

      <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-earth-americas text-green-500"></i>
          Global Threat Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {geolocation.length > 0 ? geolocation.map((loc, i) => (
            <div key={i} className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500' : 'bg-slate-50 border-slate-200 hover:border-cyan-400'}`} onClick={() => notify(`${loc.country}: ${loc.threatCount} threats detected`, 'info')}>
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-location-dot text-red-500"></i>
                <span className="font-bold text-sm">{loc.country}</span>
              </div>
              <div className="text-2xl font-bold text-cyan-500">{loc.threatCount}</div>
              <div className="text-xs text-slate-500 mt-1">Avg Severity: {loc.avgSeverity.toFixed(1)}</div>
            </div>
          )) : <p className="text-sm text-slate-500 col-span-full text-center py-8">No geolocation data available</p>}
        </div>
      </div>

      {attackChain && (
        <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-amber-500"></i>
            Attack Chain Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Total Events (6h)</p>
              <p className="text-2xl font-bold">{attackChain.totalEvents}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Unique Sources</p>
              <p className="text-2xl font-bold text-orange-500">{attackChain.uniqueSources}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Attack Velocity</p>
              <p className="text-2xl font-bold text-purple-500">{attackChain.attackVelocity.toFixed(1)}/hr</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500 uppercase mb-1">Multi-Stage Attack</p>
              <p className={`text-2xl font-bold ${attackChain.multiStageAttack ? 'text-red-500' : 'text-green-500'}`}>
                {attackChain.multiStageAttack ? 'DETECTED' : 'NONE'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-blue-500"></i>
          Recent Threat Timeline
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timeline.length > 0 ? timeline.map((item, i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-slate-50 hover:bg-slate-100'} transition-colors cursor-pointer`} onClick={() => notify(`${item.type} from ${item.source}`, 'info')}>
              <div className={`w-2 h-2 rounded-full ${item.severity > 7 ? 'bg-red-500' : item.severity > 4 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
              <span className="text-xs text-slate-500 w-32">{new Date(item.timestamp).toLocaleString()}</span>
              <span className="font-mono text-sm flex-1">{item.type}</span>
              <span className="text-xs text-slate-500">{item.source}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${item.severity > 7 ? 'bg-red-500/20 text-red-500' : item.severity > 4 ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                {item.severity}/10
              </span>
            </div>
          )) : <p className="text-sm text-slate-500 text-center py-8">No timeline data available</p>}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
