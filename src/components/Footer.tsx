import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1976d2',
        borderTop: '1px solid #1565c0',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px',
      }}
    >
      <p style={{ margin: 0, color: 'white', fontSize: '14px' }}>
        Creado por <strong>Facundo Tobio</strong>
      </p>
      <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
        Prueba Técnica Full Stack - Mayo {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
