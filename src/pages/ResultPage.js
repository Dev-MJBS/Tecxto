import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import FeedbackDisplay from '../components/FeedbackDisplay';

function ResultPage() {
  const location = useLocation();
  const { analysis, extractedText, fileType, plagiarismCheck, plagiarismDetails } = location.state || {};

  if (!analysis) {
    return (
      <div id="main-container">
        <div className="result-container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-file-alt" style={{ fontSize: '4rem', color: 'var(--text-secondary)', marginBottom: '20px' }}></i>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>Nenhum resultado encontrado</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              Por favor, envie uma redação primeiro para receber a análise.
            </p>
            <Link to="/" className="back-button">
              <i className="fas fa-arrow-left"></i> Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-container">
      <div className="result-container">
        <div className="result-header">
          <h2>
            <i className="fas fa-chart-line"></i> 
            Análise da sua redação {fileType && <span style={{ fontSize: '0.8em', color: 'var(--color-primary)' }}>({fileType})</span>}
          </h2>
          <Link to="/" className="back-button">
            <i className="fas fa-plus"></i> Nova análise
          </Link>
        </div>
        
        <FeedbackDisplay 
          analysis={analysis} 
          extractedText={extractedText}
          plagiarismCheck={plagiarismCheck}
          plagiarismDetails={plagiarismDetails}
        />
      </div>
    </div>
  );
}

export default ResultPage;