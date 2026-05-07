import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Invoice } from '../types';
import Modal from '../components/Modal';

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/Invoice');
        // Validar que la respuesta sea un array
        const data = Array.isArray(response.data) ? response.data : [];
        setInvoices(data);
      } catch (error) {
        console.error('Error al cargar facturas:', error);
        setInvoices([]);
        setErrorModal({
          open: true,
          message: 'Error al cargar la lista de facturas. Por favor, intente nuevamente.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando facturas...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '25px' }}>📋 Listado de facturas</h1>

      {invoices.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontSize: '18px', color: '#666' }}>No hay facturas registradas</p>
          <p style={{ color: '#999' }}>Cree su primera factura desde la pestaña "Crear Factura"</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Factura</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Fecha</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Items</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(invoices) && invoices.map((invoice, index) => (
                <tr
                  key={invoice.invoiceId}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                  }}
                >
                  <td style={{ padding: '15px' }}>
                    <strong>{invoice.numero}</strong>
                  </td>
                  <td style={{ padding: '15px' }}>{formatDate(invoice.fecha || '')}</td>
                  <td style={{ padding: '15px' }}>
                    {invoice.customerNombre}
                    <br />
                    <small style={{ color: '#666' }}>{invoice.customerEmail}</small>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                    {formatCurrency(invoice.total)}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span
                      style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '5px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {invoice.items?.length || 0}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleViewDetails(invoice)}
                      style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalle de Factura */}
      <Modal
        isOpen={modalOpen}
        title={`Factura ${selectedInvoice?.numero}`}
        onClose={() => setModalOpen(false)}
        type="info"
      >
        {selectedInvoice && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Cliente:</strong> {selectedInvoice.customerNombre}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Fecha:</strong> {formatDate(selectedInvoice.fecha || '')}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Total:</strong>{' '}
                <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '18px' }}>
                  {formatCurrency(selectedInvoice.total)}
                </span>
              </p>
            </div>
            <h4 style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>Items:</h4>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Descripción</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Cant.</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>P. Unit.</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items?.map((item) => (
                  <tr key={item.invoiceItemId}>
                    <td style={{ padding: '8px' }}>{item.descripcion}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.cantidad}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      {formatCurrency(item.precioUnitario)}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      {formatCurrency(item.subtotal || item.cantidad * item.precioUnitario)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Modal de Error */}
      <Modal
        isOpen={errorModal.open}
        title="Error"
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: '' })}
        type="error"
      />

    </div>
  );
};

export default InvoiceList;
