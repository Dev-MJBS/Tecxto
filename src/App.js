import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPage from './pages/AdminPage';
import './styles/GlobalStyles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas - TODAS LIBERADAS TEMPORARIAMENTE */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Rotas temporariamente sem proteção */}
            <Route path="/subscription" element={
              <>
                <Navbar />
                <SubscriptionPage />
              </>
            } />
            
            <Route path="/admin" element={
              <>
                <Navbar />
                <AdminPage />
              </>
            } />
            
            <Route path="/" element={<Home />} />
            
            <Route path="/result" element={
              <>
                <Navbar />
                <ResultPage />
              </>
            } />
            
            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;