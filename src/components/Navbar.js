import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, subscription, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const daysRemaining = subscription?.end_date ? 
    Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Tecxto IA</h2>
      </div>
      
      <div className="navbar-user">
        <div className="subscription-info">
          {subscription?.active ? (
            <span className={`subscription-status active ${daysRemaining <= 7 ? 'expiring' : ''}`}>
              {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Expirado'}
            </span>
          ) : (
            <span className="subscription-status inactive">Sem assinatura</span>
          )}
        </div>
        
        <div className="user-dropdown">
          <button 
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            👤 {user?.username}
          </button>
          
          {showUserMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <small>
                  Assinatura: {subscription?.active ? 'Ativa' : 'Inativa'}
                </small>
              </div>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/subscription');
                  setShowUserMenu(false);
                }}
              >
                Minha Assinatura
              </button>
              
              {user?.is_admin && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/admin');
                    setShowUserMenu(false);
                  }}
                  style={{ color: '#27AE60', fontWeight: 'bold' }}
                >
                  🔧 Painel Admin
                </button>
              )}
              
              <div className="dropdown-divider" />
              
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
