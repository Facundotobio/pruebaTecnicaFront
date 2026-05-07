import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import InvoiceForm from './pages/InvoiceForm';
import InvoiceList from './pages/InvoiceList';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import './App.css';

interface User {
  nombre: string;
  email: string;
}

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#1565c0',
    }}>
      {/* Links de navegación - izquierda */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link
          to="/"
          style={{
            padding: '10px 20px',
            backgroundColor: location.pathname === '/' ? 'white' : 'transparent',
            color: location.pathname === '/' ? '#1976d2' : 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
        >
          🧾 Crear Factura
        </Link>
        <Link
          to="/list"
          style={{
            padding: '10px 20px',
            backgroundColor: location.pathname === '/list' ? 'white' : 'transparent',
            color: location.pathname === '/list' ? '#1976d2' : 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
        >
          📋 Ver Facturas
        </Link>
        <Link
          to="/customers"
          style={{
            padding: '10px 20px',
            backgroundColor: location.pathname === '/customers' ? 'white' : 'transparent',
            color: location.pathname === '/customers' ? '#1976d2' : 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
        >
          👥 Clientes
        </Link>
      </div>

      {/* Usuario y logout - derecha */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
            👤 {user.nombre}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Ruta pública de login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/customers" replace /> : 
                <LoginPage onLogin={handleLogin} />
            } 
          />
          
          {/* Rutas protegidas con layout completo */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <>
                  <header style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                    <div style={{ padding: '20px' }}>
                      <h1 style={{ margin: 0 }}>Sistema de Facturación</h1>
                    </div>
                    <Navigation user={user} onLogout={handleLogout} />
                  </header>

                  <main style={{ flex: 1 }}>
                    <Routes>
                      <Route path="/" element={<InvoiceForm />} />
                      <Route path="/list" element={<InvoiceList />} />
                      <Route path="/customers" element={<CustomerPage />} />
                    </Routes>
                  </main>

                  <Footer />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;