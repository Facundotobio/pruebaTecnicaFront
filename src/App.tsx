import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import InvoiceForm from './pages/InvoiceForm';
import InvoiceList from './pages/InvoiceList';
import Footer from './components/Footer';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      padding: '15px',
      backgroundColor: '#1565c0',
    }}>
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
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          backgroundColor: '#1976d2',
          color: 'white',
          textAlign: 'center',
        }}>
          <div style={{ padding: '20px' }}>
            <h1 style={{ margin: 0 }}>Sistema de Facturación</h1>
          </div>
          <Navigation />
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<InvoiceForm />} />
            <Route path="/list" element={<InvoiceList />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;