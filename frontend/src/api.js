import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile')
};

// Wallet endpoints
export const walletAPI = {
  getWallet: () => api.get('/wallet'),
  getBalance: () => api.get('/wallet/balance')
};

// Deposit endpoints
export const depositAPI = {
  requestDeposit: (amount) => api.post('/deposits/request', { amount }),
  getBankDetails: () => api.get('/deposits/bank-details'),
  getDeposits: () => api.get('/deposits'),
  approveDeposit: (id, bonusPercentage) => api.post(`/deposits/${id}/approve`, { bonusPercentage }),
  rejectDeposit: (id) => api.post(`/deposits/${id}/reject`)
};

// Withdrawal endpoints
export const withdrawalAPI = {
  requestWithdrawal: (amount) => api.post('/withdrawals/request', { amount }),
  getWithdrawals: () => api.get('/withdrawals'),
  approveWithdrawal: (id) => api.post(`/withdrawals/${id}/approve`),
  completeWithdrawal: (id) => api.post(`/withdrawals/${id}/complete`),
  rejectWithdrawal: (id) => api.post(`/withdrawals/${id}/reject`)
};

// Betting endpoints
export const bettingAPI = {
  placeBet: (stake, selections) => api.post('/betting/place', { stake, selections }),
  getOpenBets: () => api.get('/betting/open'),
  getBetHistory: () => api.get('/betting/history'),
  settleBet: (id, status, actualWinning) => api.post(`/betting/${id}/settle`, { status, actualWinning })
};

// Casino endpoints
export const casinoAPI = {
  playGame: (gameType, stake) => api.post('/casino/play', { gameType, stake }),
  getGames: () => api.get('/casino'),
  setOutcome: (id, outcome, odds) => api.post(`/casino/${id}/outcome`, { outcome, odds })
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  freezeUser: (id) => api.post(`/admin/users/${id}/freeze`),
  unfreezeUser: (id) => api.post(`/admin/users/${id}/unfreeze`),
  editBalance: (id, mainBalance, bonusBalance, withdrawableBalance) => 
    api.post(`/admin/users/${id}/balance`, { mainBalance, bonusBalance, withdrawableBalance }),
  uploadVirtualGames: (games) => api.post('/admin/virtual-games/upload', { games }),
  getVirtualGames: () => api.get('/admin/virtual-games'),
  updateVirtualGame: (id, status, timeline, finalScore) => 
    api.put(`/admin/virtual-games/${id}`, { status, timeline, finalScore }),
  createPromoCode: (code, bonusPercentage, minSettledBetsRequired, description, maxUses, expiresAt) =>
    api.post('/admin/promo-codes', { code, bonusPercentage, minSettledBetsRequired, description, maxUses, expiresAt }),
  getPromoCodes: () => api.get('/admin/promo-codes'),
  getLogs: () => api.get('/admin/logs'),
  getStats: () => api.get('/admin/stats')
};

export default api;
