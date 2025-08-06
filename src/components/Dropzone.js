import React, { useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Dropzone({ theme }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { api, isAuthenticated, isLoading: authLoading } = useContext(AuthContext);

  const onDrop = async (acceptedFiles) => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setError('Faça login para analisar sua redação.');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }
    
    const file = acceptedFiles[0];
    if (!file) return;

    // Verificar tipos de arquivo aceitos
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Por favor, envie apenas arquivos PDF ou imagens (PNG, JPG, JPEG).');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (theme && theme.trim()) {
      formData.append('theme', theme.trim());
    }

    try {
      const response = await api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });

      if (response.data.success) {
        navigate('/resultado', {
          state: {
            analysis: response.data.analysis,
            extractedText: response.data.extracted_text,
            fileType: response.data.file_type,
            plagiarismCheck: response.data.plagiarism_check,
            plagiarismDetails: response.data.plagiarism_details,
            theme: theme
          }
        });
      } else {
        setError('Erro ao analisar a redação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Tempo limite excedido. A análise está demorando mais que o esperado.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Erro ao conectar com o servidor. Verifique se a API está funcionando.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  return (
    <div className="dropzone-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Analisando sua redação...</p>
            <small>Isso pode levar alguns segundos</small>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              <i className="fas fa-cloud-upload-alt" style={{ color: 'var(--color-primary)', fontSize: '4rem', marginBottom: '15px' }}></i>
            </div>
            {isDragActive ? (
              <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                Solte o arquivo aqui...
              </p>
            ) : (
              <>
                <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)' }}>
                  📄 Envie sua redação
                </h3>
                <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)' }}>
                  Arraste e solte seu arquivo aqui ou clique no botão abaixo
                </p>
                <button 
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '10px',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    margin: '10px 0 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    minWidth: '250px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-primary-dark)';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-primary)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <i className="fas fa-file-plus" style={{ fontSize: '1.3rem' }}></i>
                  ESCOLHER ARQUIVO (PDF ou Foto)
                </button>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--bg-input)', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginTop: '10px'
                }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    📋 Formatos aceitos:
                  </p>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    • <strong>PDF</strong>: Redações digitadas<br />
                    • <strong>Imagens</strong>: PNG, JPG, JPEG (redações manuscritas)<br />
                    • <strong>Tamanho máximo</strong>: 10MB
                  </small>
                </div>
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
                  <small style={{ color: '#2e7d32', fontWeight: '600' }}>
                    ✨ Novidade: Agora analisamos redações escritas à mão!
                  </small>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
}

export default Dropzone;