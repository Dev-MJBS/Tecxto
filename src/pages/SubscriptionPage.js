import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css';

const SubscriptionPage = () => {
  const [paymentCode, setPaymentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { user, subscription, redeemPaymentCode } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const success = await redeemPaymentCode(paymentCode);
      if (success) {
        setMessage('Código resgatado com sucesso! Sua assinatura foi ativada.');
        setPaymentCode('');
      }
    } catch (err) {
      setError(err.message || 'Erro ao resgatar código');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSubscriptionActive = subscription?.active;
  const daysRemaining = subscription?.end_date ? 
    Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Tecxto IA</h1>
          <h2>Minha Assinatura</h2>
          <p>Olá, {user?.username}!</p>
        </div>

        <div className="subscription-status">
          <div className={`status-badge ${isSubscriptionActive ? 'active' : 'inactive'}`}>
            {isSubscriptionActive ? '✅ Assinatura Ativa' : '❌ Assinatura Inativa'}
          </div>
          
          {isSubscriptionActive ? (
            <div className="subscription-details">
              <p><strong>Válida até:</strong> {formatDate(subscription.end_date)}</p>
              <p><strong>Dias restantes:</strong> {daysRemaining > 0 ? daysRemaining : 0} dias</p>
              <p><strong>Análises realizadas:</strong> {subscription.usage_count || 0}</p>
              
              {daysRemaining <= 7 && daysRemaining > 0 && (
                <div className="warning-message">
                  ⚠️ Sua assinatura expira em {daysRemaining} dias. Renove em breve!
                </div>
              )}
              
              {daysRemaining <= 0 && (
                <div className="error-message">
                  ❌ Sua assinatura expirou. Ative um novo código para continuar usando.
                </div>
              )}
            </div>
          ) : (
            <div className="subscription-details">
              <p>Você precisa de uma assinatura ativa para usar o Tecxto IA.</p>
              <p>Adquira um código de acesso e insira abaixo para ativar.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="paymentCode">Código de Pagamento</label>
            <input
              type="text"
              id="paymentCode"
              name="paymentCode"
              value={paymentCode}
              onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
              required
              placeholder="Digite seu código de acesso"
              style={{ textTransform: 'uppercase' }}
            />
            <small className="form-help">
              Digite o código que você recebeu após o pagamento
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Ativando...' : 'Ativar Código'}
          </button>
        </form>

        <div className="subscription-info">
          <h3>💡 Como funciona?</h3>
          <ul>
            <li>Entre em contato pelo WhatsApp para adquirir um código</li>
            <li>Digite o código acima e clique em "Ativar Código"</li>
            <li>Sua assinatura será ativada imediatamente</li>
            <li>Use quantas vezes quiser durante o período ativo</li>
          </ul>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a 
              href="https://wa.me/5564981381981"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#25D366',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.2rem' }}>📱</span>
              Ativar Assinatura no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
