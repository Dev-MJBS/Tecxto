import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activationData, setActivationData] = useState({ user_id: '', days: 30 });
  
  const { api, user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.is_admin) {
      return;
    }
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (err) {
      setError('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateUser = async (userId, days) => {
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/admin/activate-user', {
        user_id: userId,
        days: parseInt(days)
      });

      setSuccess(response.data.message);
      loadUsers(); // Recarregar a lista
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao ativar usuário');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user?.is_admin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '20px' }}>
      <div className="auth-card" style={{ maxWidth: '1000px', width: '95%' }}>
        <div className="auth-header">
          <h1>🔧 Painel Administrativo</h1>
          <p>Gerenciar usuários e assinaturas</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="admin-stats" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          <div className="stat-card" style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#27AE60' }}>{users.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Total de Usuários</p>
          </div>
          <div className="stat-card" style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#27AE60' }}>
              {users.filter(u => u.has_subscription).length}
            </h3>
            <p style={{ margin: 0, color: '#666' }}>Assinaturas Ativas</p>
          </div>
        </div>

        <div className="users-table" style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #27AE60' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Usuário</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Cadastro</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Assinatura</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Usos</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#27AE60' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ padding: '10px' }}>{user.id}</td>
                  <td style={{ padding: '10px' }}><strong>{user.username}</strong></td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>{formatDate(user.created_at)}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      background: user.is_active ? '#d4edda' : '#f8d7da',
                      color: user.is_active ? '#155724' : '#721c24'
                    }}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      background: user.has_subscription ? '#d4edda' : '#f8d7da',
                      color: user.has_subscription ? '#155724' : '#721c24'
                    }}>
                      {user.has_subscription ? `Até ${formatDate(user.subscription_end)}` : 'Sem assinatura'}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{user.usage_count || 0}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleActivateUser(user.id, 30)}
                        style={{
                          background: '#27AE60',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        30 dias
                      </button>
                      <button
                        onClick={() => handleActivateUser(user.id, 7)}
                        style={{
                          background: '#f39c12',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        7 dias
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Nenhum usuário encontrado
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
