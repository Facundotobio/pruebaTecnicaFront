import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface LoginPageProps {
  onLogin: (token: string, user: { nombre: string; email: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/Auth/login', { email });
      const { token, nombre, email: userEmail } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ nombre, email: userEmail }));
      
      onLogin(token, { nombre, email: userEmail });
      
      // Redirigir a la página principal
      navigate('/customers');
    } catch (err: any) {
      console.error('Error de login:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.title || 
        'Error al iniciar sesión. Verifique el email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0', textAlign: 'center', color: '#1976d2' }}>
          🔐 Iniciar Sesión
        </h2>
        <p style={{ margin: '0 0 30px 0', textAlign: 'center', color: '#666' }}>
          Sistema de Facturación
        </p>

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: loading ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
          Ingrese su email para acceder al sistema
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
