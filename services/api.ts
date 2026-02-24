const API_BASE_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('shield_token');

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
};

export const authAPI = {
  login: (username: string, password: string) => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
};

export const threatAPI = {
  getAll: () => apiFetch('/threats'),
  getByStatus: (status: string) => apiFetch(`/threats/status/${status}`),
  create: (threat: any) => apiFetch('/threats', { method: 'POST', body: JSON.stringify(threat) }),
  getStats: () => apiFetch('/threats/stats'),
};

export const agentAPI = {
  getAllDecisions: () => apiFetch('/agents/decisions'),
  executeAction: (threatId: string, agentName: string, action: string) => 
    apiFetch('/agents/execute', { method: 'POST', body: JSON.stringify({ threatId, agentName, action }) }),
  getAgentStatus: () => apiFetch('/agents/status'),
};

export default { auth: authAPI, threats: threatAPI, agents: agentAPI };
