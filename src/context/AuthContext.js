import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configurar axios para incluir token automaticamente
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');

      if (!token || !userData) {
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      setUser(user);
      setIsAuthenticated(true);

      // Verificar status da assinatura
      await checkSubscriptionStatus();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await api.get('/auth/subscription-status');
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      const { data } = response.data;
      
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('userData', JSON.stringify({
        id: data.user_id,
        username: data.username,
        is_admin: data.is_admin
      }));

      setUser({
        id: data.user_id,
        username: data.username,
        is_admin: data.is_admin
      });
      
      setSubscription({
        active: data.has_subscription,
        end_date: data.subscription_end,
        usage_count: data.usage_count
      });
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      throw new Error(message);
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('/auth/register', {
        username,
        email,
        password
      });
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar conta';
      throw new Error(message);
    }
  };

  const redeemPaymentCode = async (paymentCode) => {
    try {
      const response = await api.post('/auth/redeem-code', {
        payment_code: paymentCode
      });
      
      // Atualizar status da assinatura
      await checkSubscriptionStatus();
      
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao resgatar código';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setUser(null);
    setSubscription(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    subscription,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    redeemPaymentCode,
    checkSubscriptionStatus,
    api // Exportar api configurada para uso em outros componentes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
};

export { AuthContext };
