import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Customer, InvoiceItem, Invoice } from '../types';
import Modal from '../components/Modal';

const InvoiceForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<InvoiceItem>({
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/Customer');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error al cargar clientes', error);
      }
    };
    fetchCustomers();
  }, []);

  const showModal = (title: string, message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const addItem = () => {
    if (!newItem.descripcion.trim() || newItem.precioUnitario <= 0) {
      showModal('Validación Requerida', 'Debe completar descripción y precio unitario válido', 'error');
      return;
    }

    // Validación: no permitir productos duplicados (misma descripción)
    const descripcionNormalizada = newItem.descripcion.trim().toLowerCase();
    const productoDuplicado = items.some(
      item => item.descripcion.trim().toLowerCase() === descripcionNormalizada
    );

    if (productoDuplicado) {
      showModal(
        'Producto Duplicado',
        'Este producto ya ha sido agregado a la factura. No se permiten productos duplicados.',
        'error'
      );
      return;
    }

    setItems([...items, { ...newItem }]);
    setNewItem({ descripcion: '', cantidad: 1, precioUnitario: 0 });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCustomerId === 0) {
      showModal('Validación Requerida', 'Debe seleccionar un cliente', 'error');
      return;
    }
    if (items.length === 0) {
      showModal('Validación Requerida', 'Debe agregar al menos un producto', 'error');
      return;
    }

    setLoading(true);

    const invoiceData: Invoice = {
      customerId: selectedCustomerId,
      items: items,
      total: items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0)
    };

    try {
      const response = await api.post('/Invoice', invoiceData);
      showModal(
        '¡Factura Creada!',
        `La factura fue creada exitosamente.\n\nNúmero: ${response.data.numero || 'N/A'}`,
        'success'
      );

      // Limpiar formulario
      setItems([]);
      setSelectedCustomerId(0);
    } catch (error: any) {
      console.error(error);
      showModal(
        'Error al Crear Factura',
        error.response?.data?.title || error.message || 'Ocurrió un error al procesar la solicitud.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🧾 Crear nueva factura</h1>

      <form onSubmit={handleSubmit}>
        <h3>Cliente</h3>
        <div style={{ marginBottom: '20px' }}>
          <select 
            value={selectedCustomerId} 
            onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
            required
          >
            <option value={0}>-- Seleccione un cliente --</option>
            {customers.map((customer) => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.nombre} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <h3>Agregar productos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 1.5fr 80px', gap: '10px', marginBottom: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Descripción del producto</label>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Cantidad</label>
          <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Precio Unitario ($)</label>
          <span></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 1.5fr 80px', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Ej: Producto A"
            value={newItem.descripcion}
            onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="1"
            value={newItem.cantidad}
            onChange={(e) => setNewItem({ ...newItem, cantidad: Number(e.target.value) })}
            min="1"
          />
          <input
            type="number"
            placeholder="0.00"
            value={newItem.precioUnitario}
            onChange={(e) => setNewItem({ ...newItem, precioUnitario: Number(e.target.value) })}
            step="0.01"
          />
          <button type="button" onClick={addItem}>Agregar</button>
        </div>

        <h4>Items agregados ({items.length})</h4>
        <ul style={{ minHeight: '100px' }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
              {item.descripcion} × {item.cantidad} × ${item.precioUnitario.toFixed(2)}
              <button 
                type="button" 
                onClick={() => removeItem(index)}
                style={{ marginLeft: '15px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button
            type="submit"
            disabled={loading || items.length === 0 || selectedCustomerId === 0}
            style={{
              padding: '14px 40px',
              fontSize: '18px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Creando Factura...' : 'Generar Factura'}
          </button>
        </div>
      </form>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        type={modal.type}
      />
    </div>
  );
};

export default InvoiceForm;