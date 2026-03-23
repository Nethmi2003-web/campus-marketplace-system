const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const userAPI = {
  register: (data) => fetch(`${API_BASE}/users/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  login: (data) => fetch(`${API_BASE}/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  getMe: (token) => fetch(`${API_BASE}/users/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
};

export const itemAPI = {
  getAll: (params = '') => fetch(`${API_BASE}/items${params}`).then(r => r.json()),
  getById: (id) => fetch(`${API_BASE}/items/${id}`).then(r => r.json()),
  create: (data, token) => fetch(`${API_BASE}/items`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
};

export const trustAPI = {
  getRecommendations: (token) => fetch(`${API_BASE}/trust/recommendations`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
  submitReview: (data, token) => fetch(`${API_BASE}/trust/reviews`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  getTrustScore: (sellerId) => fetch(`${API_BASE}/trust/score/${sellerId}`).then(r => r.json()),
};
