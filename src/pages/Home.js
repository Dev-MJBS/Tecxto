import React, { useState, useContext } from 'react';
import Dropzone from '../components/Dropzone';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [theme, setTheme] = useState('');
  const [activeTab, setActiveTab] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Tema escuro por padrão
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'como-funciona':
        return (
          <div className="donation-plea">
            <strong>🔧 Como funciona o Tecxto IA:</strong><br /><br />
            <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <strong>1. 📄 Upload do Arquivo:</strong><br />
              • Faça upload do PDF (redação digitada) ou imagem (manuscrita)<br />
              • Suportamos PNG, JPG, JPEG até 10MB<br /><br />

              <strong>2. 🤖 Análise Inteligente:</strong><br />
              • IA analisa seguindo critérios rigorosos do ENEM<br />
              • Detecção automática de plágio na internet<br />
              • Análise personalizada para seu estilo<br /><br />

              <strong>3. 🔍 Verificações Específicas:</strong><br />
              • Períodos curtos e introduções concisas<br />
              • Duas problemáticas bem definidas<br />
              • Conectivos para fluência textual<br /><br />

              <strong>4. 📊 Feedback Completo:</strong><br />
              • Nota geral (0-1000) e por competência<br />
              • Análise detalhada 5W2H da proposta<br />
              • Versão corrigida e dicas personalizadas<br />
            </div>
          </div>
        );
      
      case 'criterios':
        return (
          <div className="donation-plea">
            <strong>📋 Critérios do ENEM - 5 Competências:</strong><br /><br />
            <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <strong>Competência 1 (0-200): Domínio da Norma Padrão</strong><br />
              • Gramática, ortografia e concordância<br />
              • Regência verbal e nominal<br />
              • Pontuação adequada<br />
              • Acentuação correta<br /><br />

              <strong>Competência 2 (0-200): Compreensão da Proposta</strong><br />
              • Adequação ao tema proposto<br />
              • Tipo textual dissertativo-argumentativo<br />
              • Não fuga do tema<br />
              • Desenvolvimento das duas problemáticas<br /><br />

              <strong>Competência 3 (0-200): Seleção e Organização</strong><br />
              • Argumentação consistente<br />
              • Repertório sociocultural<br />
              • Organização das ideias<br />
              • Progressão temática<br /><br />

              <strong>Competência 4 (0-200): Mecanismos Linguísticos</strong><br />
              • Coesão e coerência<br />
              • Conectivos variados<br />
              • Articulação entre parágrafos<br />
              • Progressão textual<br /><br />

              <strong>Competência 5 (0-200): Proposta de Intervenção</strong><br />
              • QUEM resolve • ONDE • QUANDO • COMO • O QUE SE ESPERA<br />
              • Nome criativo para a solução<br />
              • Detalhamento da proposta<br />
            </div>
          </div>
        );
      
      case 'dicas':
        return (
          <div className="donation-plea">
            <strong>💡 Dicas para Dissertativo-Argumentativo:</strong><br /><br />
            <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <strong>🏗️ Estrutura Ideal:</strong><br />
              • <strong>Introdução:</strong> Apresente o tema + 2 problemáticas<br />
              • <strong>Desenvolvimento:</strong> 1 parágrafo para cada problemática<br />
              • <strong>Conclusão:</strong> Proposta de intervenção 5W2H<br /><br />

              <strong>✍️ Períodos Curtos (seu estilo):</strong><br />
              • Use frases objetivas e claras<br />
              • Evite períodos com mais de 3 linhas<br />
              • Uma ideia por frase<br />
              • Introduções de 4-5 linhas máximo<br /><br />

              <strong>🔗 Conectivos Essenciais:</strong><br />
              • <strong>Introdução:</strong> Atualmente, Diante disso, É notório<br />
              • <strong>Contraste:</strong> Entretanto, Contudo, Por outro lado<br />
              • <strong>Adição:</strong> Além disso, Ademais, Somado a isso<br />
              • <strong>Conclusão:</strong> Portanto, Logo, Assim sendo<br /><br />

              <strong>🎯 Proposta 5W2H:</strong><br />
              • <strong>QUEM:</strong> Governo, Ministério, Sociedade, Escolas<br />
              • <strong>ONDE:</strong> Âmbito nacional, local, escolar, familiar<br />
              • <strong>QUANDO:</strong> A curto prazo, imediatamente, gradualmente<br />
              • <strong>COMO:</strong> Por meio de, através de, mediante<br />
              • <strong>O QUE SE ESPERA:</strong> A fim de, para que, com o objetivo de<br />
              • <strong>NOME:</strong> Dê um nome criativo à sua proposta!<br /><br />

              <strong>⚠️ Evite:</strong><br />
              • Gírias e informalidade<br />
              • Períodos muito longos<br />
              • Repetição de conectivos<br />
              • Proposta vaga ou genérica<br />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="donation-plea">
            <strong>Como funciona o Tecxto IA:</strong><br />
            1. Faça upload do arquivo PDF ou imagem (PNG, JPG, JPEG) com sua redação<br />
            2. Nossa IA analisará seguindo os critérios do ENEM<br />
            3. Detectamos plágio automaticamente pesquisando na internet<br />
            4. Receba feedback detalhado com nota, análise personalizada e dicas<br />
            5. Use as sugestões para melhorar sua escrita
            <br /><br />
            <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
              ✨ Novidades: Redações manuscritas + Detecção de plágio + Análise personalizada!
            </div>
            <br />
            <em>Desenvolvido para estudantes que buscam excelência na escrita acadêmica.</em>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx>{`
        :root {
          --color-primary: #27AE60;
          --color-primary-dark: #1E8449;
          --color-accent: #F39C12;
          --dark-bg-body: #121212;
          --dark-bg-sidebar: #1E1E1E;
          --dark-bg-main: #121212;
          --dark-bg-chat-bubble: #2C2C2C;
          --dark-bg-input: #252525;
          --dark-text-primary: #EAEAEA;
          --dark-text-secondary: #B0B0B0;
          --dark-border-color: #333333;
          --dark-shadow-color: rgba(0, 0, 0, 0.5);
          --light-bg-body: #F4F6F8;
          --light-bg-sidebar: #FFFFFF;
          --light-bg-main: #F4F6F8;
          --light-bg-chat-bubble: #FFFFFF;
          --light-bg-input: #FFFFFF;
          --light-text-primary: #212121;
          --light-text-secondary: #616161;
          --light-border-color: #E0E0E0;
          --light-shadow-color: rgba(0, 0, 0, 0.1);
          ${isDarkMode ? `
          --bg-body: var(--dark-bg-body);
          --bg-sidebar: var(--dark-bg-sidebar);
          --bg-main: var(--dark-bg-main);
          --bg-chat-bubble: var(--dark-bg-chat-bubble);
          --bg-input: var(--dark-bg-input);
          --text-primary: var(--dark-text-primary);
          --text-secondary: var(--dark-text-secondary);
          --border-color: var(--dark-border-color);
          --shadow-color: var(--dark-shadow-color);
          ` : `
          --bg-body: var(--light-bg-body);
          --bg-sidebar: var(--light-bg-sidebar);
          --bg-main: var(--light-bg-main);
          --bg-chat-bubble: var(--light-bg-chat-bubble);
          --bg-input: var(--light-bg-input);
          --text-primary: var(--light-text-primary);
          --text-secondary: var(--light-text-secondary);
          --border-color: var(--light-border-color);
          --shadow-color: var(--light-shadow-color);
          `}
        }
        
        html { height: -webkit-fill-available; }
        body {
          height: 100vh;
          height: 100dvh;
          margin: 0;
          overflow: hidden;
          font-family: 'Roboto', 'Montserrat', sans-serif;
          background-color: var(--bg-body);
          color: var(--text-primary);
          -webkit-text-size-adjust: 100%;
        }
        
        .app-container { 
          display: flex; 
          height: 100%; 
          width: 100%; 
          transition: background-color 0.3s; 
        }
        
        .history-sidebar {
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          flex-shrink: 0;
          width: 260px;
          min-width: 220px;
          z-index: 1001;
        }
        
        .history-sidebar .header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .history-sidebar .new-chat-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1em;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
        }
        
        .history-sidebar .footer {
          padding: 15px;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
        }
        
        .history-sidebar .footer a {
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
          font-size: 0.98em;
          cursor: pointer;
        }
        
        .history-sidebar .footer a:hover { 
          background-color: var(--bg-input); 
          color: var(--color-primary); 
        }
        
        .history-sidebar .footer a i { 
          margin-right: 10px; 
          width: 20px; 
          text-align: center; 
        }
        
        .footer-btn {
          color: var(--text-secondary);
          background: none;
          border: none;
          text-decoration: none;
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
          font-size: 0.98em;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        
        .footer-btn:hover { 
          background-color: var(--bg-input); 
          color: var(--color-primary); 
        }
        
        .footer-btn i { 
          margin-right: 10px; 
          width: 20px; 
          text-align: center; 
        }
        
        .main-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .main-header {
          display: none;
          padding: 0 15px;
          height: 50px;
          border-bottom: 1px solid var(--border-color);
          align-items: center;
          background-color: var(--bg-body);
          flex-shrink: 0;
          box-sizing: border-box;
        }
        
        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.5em;
          cursor: pointer;
        }
        
        .chat-view { 
          display: flex; 
          flex-direction: column; 
          flex-grow: 1; 
          height: 100%; 
          overflow: hidden; 
        }
        
        .welcome-screen, .chat-container { 
          flex-grow: 1; 
          overflow-y: auto; 
          padding: 20px; 
          -webkit-overflow-scrolling: touch; 
        }
        
        .chat-container { 
          display: none; 
        }
        
        .welcome-screen {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
        }
        
        .welcome-screen .logo {
          font-family: 'Montserrat', sans-serif;
          font-size: 2.6em;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 6px;
        }
        
        .welcome-screen .subtitle {
          font-size: 1.15em;
          color: var(--text-secondary);
          margin-top: 10px;
          max-width: 90%;
        }
        
        .suggestion-pills {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          max-width: 90%;
        }
        
        .suggestion-pill {
          padding: 10px 15px;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 0.88em;
        }
        
        .suggestion-pill:hover {
          background-color: var(--color-primary-dark);
          color: white;
          border-color: var(--color-primary-dark);
        }
        
        .suggestion-pill.active {
          background-color: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        
        .donation-plea {
          margin-top: 30px;
          max-width: 500px;
          padding: 15px;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.95em;
          line-height: 1.6;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2em;
          z-index: 1003;
          transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
          background: var(--color-primary);
          color: white;
        }
        
        .upload-area-wrapper {
          margin-top: 40px;
          max-width: 600px;
          width: 100%;
        }
        
        .upload-area {
          background-color: var(--bg-input);
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .upload-area:hover {
          border-color: var(--color-primary);
          background-color: var(--bg-chat-bubble);
        }
        
        .upload-area.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        }
        
        .upload-area.disabled:hover {
          border-color: var(--border-color);
        }
        
        .upload-icon {
          font-size: 3em;
          color: var(--color-primary);
          margin-bottom: 15px;
        }
        
        .upload-text {
          font-size: 1.1em;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        
        .upload-subtext {
          font-size: 0.9em;
          color: var(--text-secondary);
        }
        
        .login-warning {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        }
        
        .overlay {
          display: none;
          position: fixed;
          top: 0; 
          left: 0;
          width: 100%; 
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 999;
        }
        
        .overlay.open { 
          display: block; 
        }
        
        .main-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          padding: 20px;
          padding-bottom: 100px; /* Adicionar espaço extra no final */
        }
        
        .home-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: var(--bg-chat-bubble);
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px var(--shadow-color);
          margin-bottom: 50px; /* Espaço extra no final */
        }
        
        .instructions h2 {
          color: var(--color-primary);
          margin-bottom: 20px;
          font-size: 1.8em;
        }
        
        .instructions ol {
          background-color: var(--bg-input);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        
        .instructions ol li {
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        
        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .back-button:hover {
          color: var(--color-primary-dark);
        }
        
        @media (max-width: 768px) {
          .history-sidebar {
            position: fixed;
            height: 100%;
            width: 80%;
            max-width: 300px;
            transform: translateX(-100%);
            border-right: 1px solid var(--border-color);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 1002;
          }
          
          .history-sidebar.open { 
            transform: translateX(0); 
          }
          
          .main-header { 
            display: flex; 
          }
          
          .main-container {
            padding: 15px;
            padding-bottom: 120px; /* Mais espaço em mobile */
          }
          
          .welcome-screen .logo {
            font-size: 2.2em;
          }
          
          .welcome-screen .subtitle {
            font-size: 1em;
          }
          
          .suggestion-pill {
            font-size: 0.8em;
            padding: 8px 12px;
          }
          
          .home-container {
            margin: 0 10px;
            padding: 20px;
            margin-bottom: 40px;
          }
          
          .theme-toggle {
            top: 10px;
            right: 10px;
            padding: 8px;
            font-size: 1em;
          }
        }
        
        /* Estilo para botões de login/registro */
        .auth-buttons a:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
        }
        
        .auth-buttons a:first-child:hover {
          background-color: var(--color-primary-dark);
        }
        
        .auth-buttons a:last-child:hover {
          background-color: var(--color-primary);
          color: white;
        }
      `}</style>

      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="app-container">
        {isAuthenticated && (
          <aside className={`history-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="header">
              <button 
                className="new-chat-btn" 
                onClick={() => {
                  setShowInstructions(true);
                  setActiveTab('inicio');
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-plus"></i> Nova Análise
              </button>
            </div>
            <div className="footer">
              <button 
                type="button" 
                className="footer-btn"
                onClick={() => toggleTheme()}
              >
                <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
                {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
              </button>
              <button 
                type="button" 
                className="footer-btn"
                onClick={() => { setShowInstructions(true); setActiveTab('inicio'); setSidebarOpen(false); }}
              >
                <i className="fas fa-home"></i>Início
              </button>
              <button 
                type="button" 
                className="footer-btn"
                onClick={() => window.location.href = '/subscription'}
              >
                <i className="fas fa-crown"></i>Minha Assinatura
              </button>
              <button 
                type="button" 
                className="footer-btn"
                onClick={() => logout()}
              >
                <i className="fas fa-sign-out-alt"></i>Logout ({user?.username})
              </button>
            </div>
          </aside>
        )}
        
        <main className="main-content">
          {isAuthenticated && (
            <header className="main-header">
              <button 
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </header>
          )}
          
          <div className="chat-view">
            {showInstructions ? (
              <div className="welcome-screen">
                <div className="logo">Tecxto IA 📝</div>
                <div className="subtitle">
                  {isAuthenticated 
                    ? "Sua plataforma inteligente de correção de redações ENEM."
                    : "Experimente nossa correção inteligente - Veja como funciona antes de comprar!"
                  }
                </div>
                
                <div className="suggestion-pills">
                  <div 
                    className="suggestion-pill"
                    onClick={() => {
                      if (isAuthenticated) {
                        setShowInstructions(false);
                      } else {
                        alert('Faça login para começar a análise');
                      }
                    }}
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    🚀 Começar análise
                  </div>
                  <div 
                    className={`suggestion-pill ${activeTab === 'como-funciona' ? 'active' : ''}`}
                    onClick={() => setActiveTab('como-funciona')}
                  >
                    🔧 Como funciona?
                  </div>
                  <div 
                    className={`suggestion-pill ${activeTab === 'criterios' ? 'active' : ''}`}
                    onClick={() => setActiveTab('criterios')}
                  >
                    📋 Critérios do ENEM
                  </div>
                  <div 
                    className={`suggestion-pill ${activeTab === 'dicas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dicas')}
                  >
                    💡 Dicas de redação
                  </div>
                </div>
                
                {renderContent()}
                
                {!isAuthenticated && (
                  <div style={{ 
                    marginTop: '40px', 
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '30px'
                  }}>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      marginBottom: '20px',
                      fontSize: '1rem'
                    }}>
                      Para começar a usar o Tecxto IA:
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }} className="auth-buttons">
                      <a 
                        href="/login" 
                        style={{ 
                          display: 'inline-block',
                          padding: '12px 24px',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          minWidth: '120px'
                        }}
                      >
                        🔑 Fazer Login
                      </a>
                      <a 
                        href="/register" 
                        style={{ 
                          display: 'inline-block',
                          padding: '12px 24px',
                          backgroundColor: 'transparent',
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          border: '2px solid var(--color-primary)',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          minWidth: '120px'
                        }}
                      >
                        ✨ Criar Conta
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="main-container">
                <button 
                  className="back-button" 
                  onClick={() => setShowInstructions(true)}
                >
                  <i className="fas fa-arrow-left"></i> Voltar ao início
                </button>
                
                <div className="home-container">
                  <div className="instructions">
                    <h2><i className="fas fa-graduation-cap"></i> Análise de Redação</h2>
                    
                    <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                      Envie sua redação em PDF ou imagem (PNG, JPG, JPEG) e receba uma análise completa baseada nos critérios do ENEM.
                      <br /><span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>✨ Com detecção de plágio e análise personalizada!</span>
                    </p>
                    
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                        <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
                        Tema da redação
                      </h3>
                      <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Coloque aqui o tema da redação (opcional)"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-chat-bubble)',
                          color: 'var(--text-primary)',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                      <small style={{ color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
                        💡 Se informado, a análise será mais precisa. Caso contrário, a IA identificará o tema automaticamente.
                      </small>
                    </div>

                    <ol>
                      <li><strong>Domínio da norma padrão:</strong> Gramática, ortografia e concordância</li>
                      <li><strong>Compreensão da proposta:</strong> Adequação ao tema e tipo textual</li>
                      <li><strong>Argumentação:</strong> Repertório sociocultural e organização das ideias</li>
                      <li><strong>Coesão e coerência:</strong> Mecanismos linguísticos de articulação</li>
                      <li><strong>Proposta de intervenção:</strong> Solução com agente, ação, meio e detalhamento</li>
                    </ol>
                  </div>
                  
                  <Dropzone theme={theme} />
                </div>
              </div>
            )}
          </div>
        </main>
        
        <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      </div>
    </>
  );
}

export default Home;