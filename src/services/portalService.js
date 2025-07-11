// src/services/portalService.js
import api from './api';
import { mapPedidosFromApi, mapCarritoFromApi } from '../mappers/pedidoMapper';
import { mapProductosCatalogoFromApi, mapDetallesProductoFromApi } from '../mappers/productoMapper';
import { mapReseñasFromApi, mapProductosParaReseñaFromApi } from '../mappers/reseñaMapper';

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    'Content-Type': 'application/json'
});

const fileAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('userToken')}`
    // Para multipart/form-data, no seteamos Content-Type, el navegador lo hace.
});

// --- Catálogo y Productos ---
const getCategorias = async () => {
    const response = await api.get('/portal/catalogo/categorias', { headers: authHeader() });
    return response.data;
};

const getProductosPorCategoria = async (categoria) => {
    const response = await api.get('/portal/catalogo/productos', { params: { categoria }, headers: authHeader() });
    return mapProductosCatalogoFromApi(response.data);
};

const getDetallesProducto = async (productoId) => {
    const response = await api.get(`/portal/productos/${productoId}/detalles`, { headers: authHeader() });
    return mapDetallesProductoFromApi(response.data);
};

// --- Carrito de Compras ---
const getCarrito = async () => {
    const response = await api.get('/portal/carrito', { headers: authHeader() });
    return mapCarritoFromApi(response.data);
};

const agregarAlCarrito = async (payload) => {
    const response = await api.post('/portal/carrito/items', payload, { headers: authHeader() });
    return response.data;
};

const quitarDelCarrito = async (detalleId) => {
    const response = await api.delete(`/portal/carrito/items/${detalleId}`, { headers: authHeader() });
    return response.data;
};

// --- Checkout y Pedidos ---
const getHistorialPedidos = async () => {
    const response = await api.get('/portal/pedidos/historial', { headers: authHeader() });
    return mapPedidosFromApi(response.data);
};

const finalizarPedido = async () => {
    const response = await api.post('/portal/carrito/checkout', {}, { headers: authHeader() });
    return response.data;
};

const ponerPedidoEnEspera = async (pedidoId, diasEspera) => {
    const response = await api.post(`/portal/pedidos/${pedidoId}/poner-en-espera`, { dias_espera: diasEspera }, { headers: authHeader() });
    return response.data;
};

const repetirPedido = async (pedidoId) => {
    const response = await api.post(`/portal/pedidos/${pedidoId}/repetir`, {}, { headers: authHeader() });
    return response.data;
};

const subirComprobante = async (pedidoId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/portal/pedidos/${pedidoId}/comprobante`, formData, { headers: fileAuthHeader() });
    return response.data;
};


// --- Reseñas y Solicitudes ---
const getMisResenas = async () => {
    const response = await api.get('/portal/resenas', { headers: authHeader() });
    return mapReseñasFromApi(response.data);
};



const crearReseña = async (data) => {
    const response = await api.post('/portal/resenas', data, { headers: authHeader() });
    return response.data;
};

const updateReseña = async (reseñaId, data) => {
    const response = await api.put(`/portal/resenas/${reseñaId}`, data, { headers: authHeader() });
    return response.data;
};

const solicitarProducto = async (nombre_producto, descripcion) => {
    const response = await api.post('/portal/solicitar-producto', { nombre_producto, descripcion }, { headers: authHeader() });
    return response.data;
};

// --- FUNCIÓN AÑADIDA ---
const getDatosPago = async () => {
    const response = await api.get('/portal/datos-pago', { headers: authHeader() });
    return response.data;
};

// --- FUNCIÓN AÑADIDA ---
const getProductosParaResena = async () => {
    const response = await api.get('/portal/productos-para-resena', { headers: authHeader() });
    // Aquí no se necesita un mapper complejo, la data ya viene simple
    return response.data;
};

// --- FUNCIÓN AÑADIDA ---
const getAhorroPotencial = async () => {
    const response = await api.get('/portal/carrito/ahorro-potencial', { headers: authHeader() });
    return response.data;
};

const getMisTickets = async () => {
    const response = await api.get('/portal/soporte/tickets', { headers: authHeader() });
    // No se necesita mapper si la data ya viene limpia del backend
    return response.data;
};

const solicitarAsesor = async (data) => {
    const response = await api.post('/portal/soporte/solicitar-asesor', data, { headers: authHeader() });
    return response.data;
};

// --- FUNCIÓN AÑADIDA ---
const getDisponibilidadReuniones = async () => {
    const response = await api.get('/portal/soporte/disponibilidad-reuniones', { headers: authHeader() });
    return response.data;
};

const getDashboardStats = async () => {
    const response = await api.get('/portal/panel/estadisticas', { headers: authHeader() });
    return response.data;
};

const getMiPerfil = async () => {
    const response = await api.get('/portal/perfil', { headers: authHeader() });
    return response.data;
};

const updateMiPerfil = async (profileData) => {
    const response = await api.put('/portal/perfil', profileData, { headers: authHeader() });
    return response.data;
};

const getDetallesPedido = async (pedidoId) => {
    const response = await api.get(`/portal/pedidos/${pedidoId}/detalles`, { headers: authHeader() });
    return response.data;
};

const portalService = {
    getCategorias, getProductosPorCategoria, getDetallesProducto, getDatosPago,
    getCarrito, agregarAlCarrito, quitarDelCarrito, getAhorroPotencial,
    getHistorialPedidos, finalizarPedido, ponerPedidoEnEspera, repetirPedido, subirComprobante,
    getMisResenas, getProductosParaResena, crearReseña, updateReseña,
    solicitarProducto, getMisTickets, solicitarAsesor,
    getDisponibilidadReuniones, getDashboardStats, getMiPerfil,
    updateMiPerfil, getDetallesPedido,
};

export default portalService;