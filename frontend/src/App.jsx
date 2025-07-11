// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// --- Páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import VerificarCuentaPage from './pages/VerificarCuentaPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ContactoPage from './pages/ContactoPage';


// --- Páginas de Admin ---
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPedidosPage from './pages/admin/AdminPedidosPage';
import AdminCatalogoPage from './pages/admin/AdminCatalogoPage';
import AdminProductoDetailPage from './pages/admin/AdminProductoDetailPage';
import AdminAgendaPage from './pages/admin/AdminAgendaPage';
import SoportePage from './pages/admin/SoportePage';
import AdminHerramientasPage from './pages/admin/AdminHerramientasPage'; // <-- IMPORTACIÓN NUEVA

import AdminPedidoFormPage from './pages/admin/AdminPedidoFormPage'; // <-- IMPORTACIÓN NUEVA


// Páginas del Portal de Cliente
import ClientePanelPage from './pages/portals/cliente/ClientePanelPage';
import ClientePedidosPage from './pages/portals/cliente/ClientePedidosPage';
import ClienteSoportePage from './pages/portals/cliente/ClienteSoportePage';
import PagarPedidoPage from './pages/portals/cliente/PagarPedidoPage';

// Páginas del Portal de Proveedor
import ProveedorPedidosPage from './pages/portals/proveedor/ProveedorPedidosPage';
import ProveedorInfoPage from './pages/portals/proveedor/ProveedorInfoPage';
import ProveedorContactoPage from './pages/portals/proveedor/ProveedorContactoPage';
import ProveedorEstadisticasPage from './pages/portals/proveedor/ProveedorEstadisticasPage';

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/verificar-cuenta" element={<VerificarCuentaPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
      </Route>

      {/* --- Rutas Protegidas del Administrador --- */}
      <Route 
        path="/admin" 
        element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="pedidos" element={<AdminPedidosPage />} />
        <Route path="catalogo" element={<AdminCatalogoPage />} />
        <Route path="productos/:productoId" element={<AdminProductoDetailPage />} />
        <Route path="agenda" element={<AdminAgendaPage />} />
        <Route path="soporte" element={<SoportePage />} />
        <Route path="herramientas" element={<AdminHerramientasPage />} /> {/* <-- RUTA NUEVA AÑADIDA */}
        <Route path="herramientas/pedidos/nuevo" element={<AdminPedidoFormPage />} />
        <Route path="herramientas/pedidos/:pedidoId" element={<AdminPedidoFormPage />} />
      </Route>
      
      {/* --- Rutas Protegidas del Portal de Cliente --- */}
      <Route 
        path="/portal/cliente" 
        element={<ProtectedRoute allowedRoles={['cliente']}><Layout /></ProtectedRoute>}
      >
          <Route index element={<Navigate to="panel" replace />} />
          <Route path="panel" element={<ClientePanelPage />} />
          <Route path="pedidos" element={<ClientePedidosPage />} />
          <Route path="soporte" element={<ClienteSoportePage />} />
          <Route path="pago/:pedidoId" element={<PagarPedidoPage />} />
      </Route>

      {/* --- Rutas Protegidas del Portal de Proveedor --- */}
      <Route 
        path="/portal/proveedor" 
        element={<ProtectedRoute allowedRoles={['proveedor']}><Layout /></ProtectedRoute>}
      >
          <Route index element={<Navigate to="pedidos" replace />} />
          <Route path="pedidos" element={<ProveedorPedidosPage />} />
          <Route path="informacion" element={<ProveedorInfoPage />} />
          <Route path="contacto" element={<ProveedorContactoPage />} />
          <Route path="estadisticas" element={<ProveedorEstadisticasPage />} />
      </Route>

    </Routes>
  );
}

export default App;