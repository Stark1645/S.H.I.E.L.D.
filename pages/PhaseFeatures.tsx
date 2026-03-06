import React, { useState } from 'react';
import { useNotify } from '../App';
import api from '../services/api';

const PhaseFeatures: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [loading, setLoading] = useState(false);
  const [simulatedThreat, setSimulatedThreat] = useState<any>(null);
  const [forensicData, setForensicData] = useState<any>(null);
  const [featuresStatus, setFeaturesStatus] = useState<any>(null);

  // Phase 2: Threat Simulation
  const simulateThreat = async (type: string, severity: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/advanced/simulate/threat?type=${type}&severity=${severity}`, {
        method: 'POST'
      });
      const data = await response.json();
      setSimulatedThreat(data);
      notify(`✅ ${type} threat simulated successfully!`, 'success');
    } catch (error) {
      notify('❌ Simulation failed', 'error');
    }
    setLoading(false);
  };

  const simulateCampaign = async (count: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/advanced/simulate/campaign?count=${count}`, {
        method: 'POST'
      });
      const data = await response.json();
      notify(`✅ Attack campaign simulated: ${data.length} threats created!`, 'success');
    } catch (error) {
      notify('❌ Campaign simulation failed', 'error');
    }
    setLoading(false);
  };

  // Phase 4: Forensics
  const getForensics = async (threatId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/advanced/forensics/${threatId}`);
      const data = await response.json();
      setForensicData(data);
      notify('✅ Forensic analysis complete!', 'success');
    } catch (error) {
      notify('❌ Forensic analysis failed', 'error');
    }
    setLoading(false);
  };

  // Check Features Status
  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/advanced/features/status');
      const data = await response.json();
      setFeaturesStatus(data);
      notify('✅ Features status loaded!', 'success');
    } catch (error) {
      notify('❌ Failed to load status', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-rocket text-cyan-500"></i>
          Phase 2, 3, 4 Features
        </h2>
        <button
          onClick={checkStatus}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'
          } text-white disabled:opacity-50`}
        >
          <i className="fa-solid fa-check-circle mr-2"></i>
          Check Status
        </button>
      </div>

      {/* Features Status */}
      {featuresStatus && (
        <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-green-500/30' : 'border-green-200'}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-green-500"></i>
            Features Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phase 2 */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className="font-bold text-cyan-500 mb-2">Phase 2: Real-Time</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>WebSocket</span>
                  <span className="text-green-500">✓ {featuresStatus.phase2?.websocket}</span>
                </div>
                <div className="flex justify-between">
                  <span>Simulation</span>
                  <span className="text-green-500">✓ {featuresStatus.phase2?.threatSimulation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Advanced ML</span>
                  <span className="text-orange-500">⏳ {featuresStatus.phase2?.advancedML}</span>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className="font-bold text-purple-500 mb-2">Phase 3: Enterprise</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Multi-Tenant</span>
                  <span className="text-green-500">✓ {featuresStatus.phase3?.multiTenant}</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS Alerts</span>
                  <span className="text-green-500">✓ {featuresStatus.phase3?.smsNotifications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom Dashboards</span>
                  <span className="text-green-500">✓ {featuresStatus.phase3?.customDashboards}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile API</span>
                  <span className="text-green-500">✓ {featuresStatus.phase3?.mobileAPI}</span>
                </div>
              </div>
            </div>

            {/* Phase 4 */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className="font-bold text-amber-500 mb-2">Phase 4: Cloud-Native</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Kubernetes</span>
                  <span className="text-green-500">✓ {featuresStatus.phase4?.kubernetes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Forensics</span>
                  <span className="text-green-500">✓ {featuresStatus.phase4?.forensics}</span>
                </div>
                <div className="flex justify-between">
                  <span>SIEM</span>
                  <span className="text-green-500">✓ {featuresStatus.phase4?.siemIntegration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tracing</span>
                  <span className="text-green-500">✓ {featuresStatus.phase4?.distributedTracing}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Threat Simulation */}
      <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-cyan-500/30' : 'border-cyan-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-flask text-cyan-500"></i>
          Phase 2: Threat Simulation
        </h3>
        <p className="text-sm text-slate-500 mb-4">Create fake threats for testing without real attacks</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => simulateThreat('DDoS Attack', 8.5)}
            disabled={loading}
            className={`p-4 rounded-lg font-bold transition-all ${
              isDarkMode ? 'bg-red-900/30 hover:bg-red-900/50 border border-red-500/30' : 'bg-red-50 hover:bg-red-100 border border-red-200'
            } disabled:opacity-50`}
          >
            <i className="fa-solid fa-bomb text-red-500 text-2xl mb-2"></i>
            <div className="text-sm">DDoS Attack</div>
          </button>

          <button
            onClick={() => simulateThreat('Ransomware', 9.0)}
            disabled={loading}
            className={`p-4 rounded-lg font-bold transition-all ${
              isDarkMode ? 'bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'
            } disabled:opacity-50`}
          >
            <i className="fa-solid fa-lock text-purple-500 text-2xl mb-2"></i>
            <div className="text-sm">Ransomware</div>
          </button>

          <button
            onClick={() => simulateThreat('SQL Injection', 7.5)}
            disabled={loading}
            className={`p-4 rounded-lg font-bold transition-all ${
              isDarkMode ? 'bg-orange-900/30 hover:bg-orange-900/50 border border-orange-500/30' : 'bg-orange-50 hover:bg-orange-100 border border-orange-200'
            } disabled:opacity-50`}
          >
            <i className="fa-solid fa-database text-orange-500 text-2xl mb-2"></i>
            <div className="text-sm">SQL Injection</div>
          </button>

          <button
            onClick={() => simulateCampaign(5)}
            disabled={loading}
            className={`p-4 rounded-lg font-bold transition-all ${
              isDarkMode ? 'bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500/30' : 'bg-cyan-50 hover:bg-cyan-100 border border-cyan-200'
            } disabled:opacity-50`}
          >
            <i className="fa-solid fa-burst text-cyan-500 text-2xl mb-2"></i>
            <div className="text-sm">Campaign (5x)</div>
          </button>
        </div>

        {simulatedThreat && (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <i className="fa-solid fa-check-circle text-green-500"></i>
              <span className="font-bold">Threat Simulated Successfully!</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-slate-500">ID:</span> <span className="font-mono">{simulatedThreat.id}</span>
              </div>
              <div>
                <span className="text-slate-500">Type:</span> <span className="font-bold">{simulatedThreat.threatType}</span>
              </div>
              <div>
                <span className="text-slate-500">Source:</span> <span className="font-mono">{simulatedThreat.sourceIP}</span>
              </div>
              <div>
                <span className="text-slate-500">Severity:</span> <span className="text-red-500 font-bold">{simulatedThreat.severityScore}/10</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase 4: Forensics */}
      <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-magnifying-glass text-amber-500"></i>
          Phase 4: Forensic Analysis
        </h3>
        <p className="text-sm text-slate-500 mb-4">Deep investigation of threats with timeline, evidence, and recommendations</p>

        <div className="flex gap-3 mb-4">
          <input
            type="number"
            placeholder="Threat ID"
            className={`flex-1 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
            } border`}
            id="forensicThreatId"
          />
          <button
            onClick={() => {
              const input = document.getElementById('forensicThreatId') as HTMLInputElement;
              const threatId = parseInt(input.value);
              if (threatId) getForensics(threatId);
            }}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              isDarkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'
            } text-white disabled:opacity-50`}
          >
            <i className="fa-solid fa-search mr-2"></i>
            Analyze
          </button>
        </div>

        {forensicData && (
          <div className="space-y-4">
            {/* Timeline */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-clock text-blue-500"></i>
                Timeline
              </h4>
              <div className="space-y-2">
                {forensicData.timeline?.map((event: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div>
                      <span className="font-bold">{event.event}</span>
                      <span className="text-slate-500 ml-2">{event.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attack Vector */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-crosshairs text-red-500"></i>
                Attack Vector
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Entry Point:</span> <span className="font-bold">{forensicData.attackVector?.entryPoint}</span></div>
                <div><span className="text-slate-500">Method:</span> <span className="font-bold">{forensicData.attackVector?.method}</span></div>
                <div><span className="text-slate-500">Sophistication:</span> <span className="text-red-500 font-bold">{forensicData.attackVector?.sophistication}</span></div>
              </div>
            </div>

            {/* Recommendations */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                Recommendations
              </h4>
              <ul className="space-y-1 text-sm">
                {forensicData.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Phase 3: Custom Dashboards (Concept) */}
      <div className={`glass-card p-6 rounded-xl border ${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-table-columns text-purple-500"></i>
          Phase 3: Custom Dashboards
        </h3>
        <p className="text-sm text-slate-500 mb-4">Personalize your dashboard layout (Database structure ready)</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-300'} text-center`}>
            <i className="fa-solid fa-save text-purple-500 text-3xl mb-2"></i>
            <div className="font-bold">Save Layout</div>
            <div className="text-xs text-slate-500 mt-1">Store custom widget positions</div>
          </div>

          <div className={`p-4 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-300'} text-center`}>
            <i className="fa-solid fa-folder-open text-cyan-500 text-3xl mb-2"></i>
            <div className="font-bold">Load Layouts</div>
            <div className="text-xs text-slate-500 mt-1">Switch between saved views</div>
          </div>

          <div className={`p-4 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-300'} text-center`}>
            <i className="fa-solid fa-share-nodes text-green-500 text-3xl mb-2"></i>
            <div className="font-bold">Share with Team</div>
            <div className="text-xs text-slate-500 mt-1">Make dashboards public</div>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-start gap-2 text-sm">
            <i className="fa-solid fa-info-circle text-blue-500 mt-0.5"></i>
            <div>
              <span className="font-bold">Database Ready:</span> Custom dashboard structure implemented. Users can save widget layouts, positions, and preferences. Frontend drag-drop UI can be added in future.
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <i className="fa-solid fa-spinner fa-spin text-4xl text-cyan-500"></i>
            <div className="mt-2 font-bold">Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseFeatures;
