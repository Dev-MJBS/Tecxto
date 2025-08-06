// Configuração de URLs da API baseada no ambiente
const API_CONFIG = {
  development: 'http://localhost:5000',
  production: '', // Usa URL relativa no Vercel (mesmo domínio)
};

// Detecta se está em produção (Vercel) ou desenvolvimento
const isProduction = process.env.NODE_ENV === 'production' || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

export const API_BASE_URL = isProduction ? API_CONFIG.production : API_CONFIG.development;

// URLs completas da API
export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  verifyToken: `${API_BASE_URL}/api/verify-token`,
  
  // Upload e análise
  upload: `${API_BASE_URL}/api/upload`,
  
  // Admin
  adminStats: `${API_BASE_URL}/api/admin/stats`,
  adminUsers: `${API_BASE_URL}/api/admin/users`,
  adminToggleUser: `${API_BASE_URL}/api/admin/toggle-user`,
  adminDeleteUser: `${API_BASE_URL}/api/admin/delete-user`,
  adminGenerateCode: `${API_BASE_URL}/api/admin/generate-code`,
  adminGetCodes: `${API_BASE_URL}/api/admin/codes`,
  adminDeleteCode: `${API_BASE_URL}/api/admin/delete-code`,
  
  // Créditos e pagamento
  userCredits: `${API_BASE_URL}/api/user-credits`,
  createPayment: `${API_BASE_URL}/api/create-payment`,
  confirmPayment: `${API_BASE_URL}/api/confirm-payment`,
  
  // WhatsApp
  sendWhatsApp: `${API_BASE_URL}/api/send-whatsapp`,
};

console.log('API Configuration:', {
  isProduction,
  baseUrl: API_BASE_URL,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side'
});
