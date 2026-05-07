# Sistema de Facturación - Frontend

Aplicación web para la gestión de facturas y clientes desarrollada con React y TypeScript.

## 🚀 Demo en Vivo

- **Frontend**: [https://prueba-tecnica-front-sigma.vercel.app](https://prueba-tecnica-front-sigma.vercel.app)
- **Backend**: [https://pruebatecnicaback-q0cq.onrender.com/api](https://pruebatecnicaback-q0cq.onrender.com/api)

## 📋 Funcionalidades

### 🔐 Autenticación
- Login con email (JWT)
- Protección de rutas
- Token con validez de 8 horas
- Logout automático al expirar

### 🧾 Gestión de Facturas
- Crear facturas con selección de cliente
- Agregar múltiples ítems (productos/servicios)
- Validación anti-duplicados de productos
- Listado de facturas con detalle completo
- Visualización de ítems por factura

### 👥 Gestión de Clientes
- Crear nuevos clientes
- Editar clientes existentes
- Eliminar clientes (con validación de facturas activas)
- Listado de clientes con información completa
- Validación de email y campos obligatorios

### 🔔 Notificaciones
- Modales personalizados para alertas
- Mensajes de éxito y error
- Confirmaciones para acciones críticas

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP
- **React Router DOM** - Navegación
- **JWT** - Autenticación
- **CSS-in-JS** - Estilos inline

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pruebatecnicafacundotobiofront.git

# Entrar al directorio
cd pruebatecnicafacundotobiofront

# Instalar dependencias
npm install
```

## 🔧 Configuración

Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=https://pruebatecnicaback-q0cq.onrender.com/api
```

Para desarrollo local:
```env
REACT_APP_API_URL=https://localhost:7136/api
```

## 🚀 Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Crear build de producción
npm run build

# Ejecutar tests
npm test
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Footer.tsx          # Pie de página
│   └── Modal.tsx           # Componente modal reutilizable
├── pages/
│   ├── LoginPage.tsx       # Página de login
│   ├── InvoiceForm.tsx     # Crear facturas
│   ├── InvoiceList.tsx     # Listar facturas
│   └── CustomerPage.tsx    # Gestión de clientes
├── services/
│   └── api.ts              # Configuración de Axios + JWT
├── types/
│   └── index.ts            # Interfaces TypeScript
├── App.tsx                 # Componente principal + rutas
└── index.tsx               # Punto de entrada
```

## 🔐 Seguridad

- **JWT**: Tokens almacenados en localStorage, enviados en header `Authorization: Bearer <token>`
- **Protección de rutas**: Redirección automática a login si no hay sesión
- **Manejo de 401**: Limpieza de tokens y redirección al expirar
- **Validaciones**: Frontend valida campos antes de enviar al backend
- **No expone credenciales**: Sin passwords ni secrets hardcodeados

## 🌐 API Endpoints Consumidos

```
POST   /api/Auth/login              # Login (público)
GET    /api/Customer                # Listar clientes
POST   /api/Customer                # Crear cliente
PUT    /api/Customer/{id}          # Actualizar cliente
DELETE /api/Customer/{id}          # Eliminar cliente
GET    /api/Invoice                 # Listar facturas
POST   /api/Invoice                 # Crear factura
```

## 📱 Flujo de Uso

1. **Login**: Ingresar email válido del sistema
2. **Clientes**: Crear/editar clientes del sistema
3. **Crear Factura**: Seleccionar cliente y agregar ítems
4. **Ver Facturas**: Consultar facturas existentes con detalle

## 🚀 Despliegue

### Vercel (Frontend)
1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variable de entorno: `REACT_APP_API_URL`
3. Deploy automático en cada push

### Render (Backend)
El backend ya está desplegado y listo para consumir.

## 👨‍💻 Autor

**Facundo Tobio** - Prueba Técnica Full Stack
