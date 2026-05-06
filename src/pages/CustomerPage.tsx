import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Customer } from '../types';
import Modal from '../components/Modal';

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info',
  });

  const showModal = (title: string, message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await api.get('/Customer');
      const data = Array.isArray(response.data) ? response.data : [];
      setCustomers(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      showModal('Error', 'Error al cargar la lista de clientes.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length > 120) {
      errors.nombre = 'El nombre no puede superar 120 caracteres';
    }

    if (formData.direccion.length > 200) {
      errors.direccion = 'La dirección no puede superar 200 caracteres';
    }

    if (formData.telefono.length > 50) {
      errors.telefono = 'El teléfono no puede superar 50 caracteres';
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'El email no es válido';
      }
      if (formData.email.length > 100) {
        errors.email = 'El email no puede superar 100 caracteres';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/Customer', formData);
      showModal('¡Cliente Creado!', 'El cliente fue creado exitosamente.', 'success');

      // Limpiar formulario
      setFormData({ nombre: '', direccion: '', telefono: '', email: '' });

      // Recargar lista
      await fetchCustomers();
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      showModal(
        'Error al Crear Cliente',
        error.response?.data?.title || error.message || 'Ocurrió un error al procesar la solicitud.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error del campo modificado
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>👥 Gestión de Clientes</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>👥 Gestión de Clientes</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Formulario de creación */}
        <div>
          <h3>Nuevo Cliente</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Ana García"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: formErrors.nombre ? '1px solid #d32f2f' : '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              {formErrors.nombre && (
                <span style={{ color: '#d32f2f', fontSize: '12px' }}>{formErrors.nombre}</span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle San Juan 456"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: formErrors.direccion ? '1px solid #d32f2f' : '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              {formErrors.direccion && (
                <span style={{ color: '#d32f2f', fontSize: '12px' }}>{formErrors.direccion}</span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 2613456789"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: formErrors.telefono ? '1px solid #d32f2f' : '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              {formErrors.telefono && (
                <span style={{ color: '#d32f2f', fontSize: '12px' }}>{formErrors.telefono}</span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: ana.garcia@email.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: formErrors.email ? '1px solid #d32f2f' : '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              {formErrors.email && (
                <span style={{ color: '#d32f2f', fontSize: '12px' }}>{formErrors.email}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                background: submitting ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Creando...' : 'Crear Cliente'}
            </button>
          </form>
        </div>

        {/* Lista de clientes */}
        <div>
          <h3>Clientes Existentes ({customers.length})</h3>
          {customers.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <p style={{ color: '#666' }}>No hay clientes registrados</p>
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {Array.isArray(customers) && customers.map((customer) => (
                <div
                  key={customer.customerId}
                  style={{
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0' }}>{customer.nombre}</h4>
                  <p style={{ margin: '3px 0', fontSize: '14px', color: '#666' }}>
                    📧 {customer.email || 'Sin email'}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '14px', color: '#666' }}>
                    📍 {customer.direccion || 'Sin dirección'}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '14px', color: '#666' }}>
                    📞 {customer.telefono || 'Sin teléfono'}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                    Registrado: {formatDate(customer.fechaCreacion)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

export default CustomerPage;
