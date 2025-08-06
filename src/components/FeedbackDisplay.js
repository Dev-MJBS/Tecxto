import React, { useState } from 'react';

function FeedbackDisplay({ analysis, extractedText, plagiarismCheck, plagiarismDetails }) {
  const [showOriginalText, setShowOriginalText] = useState(false);

  const formatAnalysis = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        const title = line.replace(/\*\*/g, '');
        
        // Verificar se é a nota geral para dar destaque especial
        if (title.includes('NOTA GERAL')) {
          return (
            <div key={index} className="score-line" style={{ 
              fontSize: '1.2em', 
              background: 'var(--color-primary)', 
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <i className="fas fa-star" style={{ marginRight: '8px' }}></i>
              {title}
            </div>
          );
        }
        
        return (
          <h3 key={index} className="analysis-header">
            <i className="fas fa-check-circle" style={{ marginRight: '8px', color: 'var(--color-accent)' }}></i>
            {title}
          </h3>
        );
      }
      
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="analysis-item">
            {line.substring(2)}
          </li>
        );
      }
      
      if (line.startsWith('Nota:')) {
        return (
          <div key={index} className="score-line">
            <i className="fas fa-award" style={{ marginRight: '8px' }}></i>
            {line}
          </div>
        );
      }
      
      if (line.startsWith('Análise:')) {
        return (
          <div key={index} className="analysis-text">
            <i className="fas fa-clipboard-list" style={{ marginRight: '8px' }}></i>
            {line}
          </div>
        );
      }
      
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      return (
        <p key={index} className="analysis-paragraph">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <button 
          onClick={() => setShowOriginalText(!showOriginalText)}
          className="toggle-button"
        >
          <i className={`fas ${showOriginalText ? 'fa-eye-slash' : 'fa-eye'}`} style={{ marginRight: '8px' }}></i>
          {showOriginalText ? 'Ocultar texto original' : 'Ver texto original'}
        </button>
      </div>

      {showOriginalText && (
        <div className="original-text">
          <h3>
            <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
            Texto extraído do PDF:
          </h3>
          <div className="text-content">
            {extractedText}
          </div>
        </div>
      )}

      {/* Seção de Verificação de Plágio */}
      {(plagiarismCheck !== undefined || plagiarismDetails) && (
        <div className="plagiarism-section" style={{
          marginBottom: '20px',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid',
          borderColor: plagiarismDetails && plagiarismDetails.length > 0 ? '#e74c3c' : '#27ae60'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0',
            color: plagiarismDetails && plagiarismDetails.length > 0 ? '#e74c3c' : '#27ae60'
          }}>
            <i className={`fas ${plagiarismDetails && plagiarismDetails.length > 0 ? 'fa-exclamation-triangle' : 'fa-shield-alt'}`} 
               style={{ marginRight: '8px' }}></i>
            Verificação de Plágio
          </h3>
          
          {plagiarismDetails && plagiarismDetails.length > 0 ? (
            <div>
              <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '10px' }}>
                🚨 Possível plágio detectado em {plagiarismDetails.length} trecho(s):
              </p>
              {plagiarismDetails.map((result, index) => (
                <div key={index} style={{
                  backgroundColor: '#ffebee',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  border: '1px solid #ffcdd2'
                }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    Trecho suspeito:
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontStyle: 'italic' }}>
                    "{result.sentence}"
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9em' }}>
                    <strong>Fonte encontrada:</strong> {result.url}
                  </p>
                </div>
              ))}
              <p style={{ 
                color: '#d32f2f', 
                fontSize: '0.9em',
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#ffebee',
                borderRadius: '5px'
              }}>
                💡 <strong>Importante:</strong> Certifique-se de usar suas próprias palavras e citar adequadamente qualquer fonte utilizada.
              </p>
            </div>
          ) : (
            <p style={{ color: '#27ae60', margin: 0 }}>
              ✅ Nenhum plágio detectado - Texto original!
            </p>
          )}
        </div>
      )}

      <div className="analysis-content">
        {formatAnalysis(analysis)}
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid var(--border-color)', 
        background: 'var(--bg-input)' 
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9em', margin: 0 }}>
          <i className="fas fa-robot" style={{ marginRight: '8px' }}></i>
          Análise gerada por Inteligência Artificial • Use como orientação para seus estudos
        </p>
      </div>
    </div>
  );
}

export default FeedbackDisplay;