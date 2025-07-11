// src/services/adminService.js
import api from './api';

// Tu función helper para las cabeceras de autenticación. La mantenemos.
const authHeader = () => {
    const token = localStorage.getItem('userToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Objeto de Servicio Unificado ---
const adminService = {
    // === Pedidos (Panel Principal) ===
    getPedidos: (status = '') => {
        const url = status ? `/admin/pedidos?estado=${status}` : '/admin/pedidos';
        return api.get(url, { headers: authHeader() }).then(res => res.data);
    },
    aprobarPedido: (pedidoId) => api.post(`/admin/pedidos/${pedidoId}/aprobar`, {}, { headers: authHeader() }).then(res => res.data),
    rechazarPedido: (pedidoId, motivo) => api.post(`/admin/pedidos/${pedidoId}/rechazar`, { motivo }, { headers: authHeader() }).then(res => res.data),
    getComprobanteUrl: (pedidoId) => api.get(`/admin/pedidos/${pedidoId}/comprobante_url`, { headers: authHeader() }).then(res => res.data),
    marcarComoEnviado: (pedidoId) => api.post(`/admin/pedidos/${pedidoId}/enviar`, {}, { headers: authHeader() }).then(res => res.data),
    marcarComoCompletado: (pedidoId) => api.post(`/admin/pedidos/${pedidoId}/completar`, {}, { headers: authHeader() }).then(res => res.data),
    batchUpdatePedidos: (actualizaciones) => api.post('/admin/pedidos/batch-update', { actualizaciones }, { headers: authHeader() }).then(res => res.data),
    getDetallesCompletosPedido: (pedidoId) => api.get(`/admin/pedidos/${pedidoId}/detalles-completos`, { headers: authHeader() }).then(res => res.data),
    
    // === Proveedores ===
    getProveedores: () => api.get('/admin/proveedores', { headers: authHeader() }).then(res => res.data),
    createProveedor: (data) => api.post('/admin/proveedores', data, { headers: authHeader() }).then(res => res.data),
    updateProveedor: (id, data) => api.put(`/admin/proveedores/${id}`, data, { headers: authHeader() }).then(res => res.data),
    deleteProveedor: (id) => api.delete(`/admin/proveedores/${id}`, { headers: authHeader() }).then(res => res.data),

    // === Productos y Catálogo ===
    getProductos: () => api.get('/admin/productos', { headers: authHeader() }).then(res => res.data),
    createProducto: (data) => api.post('/admin/productos', data, { headers: authHeader() }).then(res => res.data),
    updateProducto: (id, data) => api.put(`/admin/productos/${id}`, data, { headers: authHeader() }).then(res => res.data),
    deleteProducto: (id) => api.delete(`/admin/productos/${id}`, { headers: authHeader() }).then(res => res.data),
    getProductoDetails: (id) => api.get(`/admin/productos/${id}/details`, { headers: authHeader() }).then(res => res.data),
    createPrecio: (data) => api.post('/admin/productos/precios', data, { headers: authHeader() }).then(res => res.data),
    deletePrecio: (id) => api.delete(`/admin/productos/precios/${id}`, { headers: authHeader() }).then(res => res.data),
    createRequisito: (data) => api.post('/admin/productos/requisitos', data, { headers: authHeader() }).then(res => res.data),
    deleteRequisito: (id) => api.delete(`/admin/productos/requisitos/${id}`, { headers: authHeader() }).then(res => res.data),
    updatePrecio: (id, data) => api.put(`/admin/productos/precios/${id}`, data, { headers: authHeader() }).then(res => res.data),
    updateRequisito: (id, data) => api.put(`/admin/productos/requisitos/${id}`, data, { headers: authHeader() }).then(res => res.data),

    // === Soporte (Tickets, Chats, Resoluciones) ===
    getSoporteChats: (estado) => api.get(`/admin/soporte/chats?estado=${estado}`, { headers: authHeader() }).then(res => res.data),
    asignarChat: (id) => api.post(`/admin/soporte/chats/${id}/asignar`, {}, { headers: authHeader() }).then(res => res.data),
    getMensajesConversacion: (id, limit) => api.get(`/admin/soporte/chats/${id}/mensajes?limit=${limit}`, { headers: authHeader() }).then(res => res.data),
    enviarMensajeAsesor: (id, texto) => api.post(`/admin/soporte/chats/${id}/enviar_mensaje`, { texto }, { headers: authHeader() }).then(res => res.data),
    resolverConversacion: (id, data) => api.post(`/admin/soporte/chats/${id}/resolver`, data, { headers: authHeader() }).then(res => res.data),
    getTickets: (statuses = []) => {
        const params = statuses.length > 0 ? `?estados=${statuses.join(',')}` : '';
        return api.get(`/admin/soporte/tickets${params}`, { headers: authHeader() }).then(res => res.data);
    },
    updateTicketStatus: (id, data) => api.put(`/admin/soporte/tickets/${id}/estado`, data, { headers: authHeader() }).then(res => res.data),
    getResoluciones: () => api.get('/admin/soporte/resoluciones', { headers: authHeader() }).then(res => res.data),

    // === Agenda y Disponibilidad ===
    getDisponibilidad: () => api.get('/admin/disponibilidad', { headers: authHeader() }).then(res => res.data),
    addDisponibilidad: (data) => api.post('/admin/disponibilidad', data, { headers: authHeader() }).then(res => res.data),
    deleteDisponibilidad: (id) => api.delete(`/admin/disponibilidad/${id}`, { headers: authHeader() }).then(res => res.data),
    addDisponibilidadEnLote: (data) => api.post('/admin/disponibilidad/crear-lote', data, { headers: authHeader() }).then(res => res.data),
    getReunionesAgendadas: () => api.get('/admin/reuniones-agendadas', { headers: authHeader() }).then(res => res.data),

    // === Herramientas (Tools) ===
    getPerfilesCliente: (page = 1, perPage = 10, query = '') => {
        const params = new URLSearchParams({ page, per_page: perPage });
        if (query) params.append('q', query);
        return api.get(`/admin/tool/perfiles-cliente?${params.toString()}`, { headers: authHeader() }).then(res => res.data);
    },
    pausarBotCliente: (id) => api.post(`/admin/tool/perfiles-cliente/${id}/pausar-bot`, {}, { headers: authHeader() }).then(res => res.data),
    reanudarBotCliente: (id) => api.post(`/admin/tool/perfiles-cliente/${id}/reanudar-bot`, {}, { headers: authHeader() }).then(res => res.data),
    
    // --- Gestión Manual de Pedidos (Tool) ---
    getAllPedidos: () => api.get('/admin/tool/pedidos', { headers: authHeader() }).then(res => res.data),
    getPedidoForTool: (id) => api.get(`/admin/tool/pedidos/${id}`, { headers: authHeader() }).then(res => res.data),
    createPedidoForTool: (data) => api.post('/admin/tool/pedidos', data, { headers: authHeader() }).then(res => res.data),
    updatePedidoForTool: (id, data) => api.put(`/admin/tool/pedidos/${id}`, data, { headers: authHeader() }).then(res => res.data),
    deletePedidoForTool: (id) => api.delete(`/admin/tool/pedidos/${id}`, { headers: authHeader() }).then(res => res.data),

    // --- Listas para Formularios (Tool) ---
    getClientesList: () => api.get('/admin/tool/clientes-list', { headers: authHeader() }).then(res => res.data),
    getProductosList: () => api.get('/admin/tool/productos-list', { headers: authHeader() }).then(res => res.data),

    // === Gestión Manual de Clientes (Tool) ===
    getPerfilClienteForTool: (id) => api.get(`/admin/tool/perfiles-cliente/${id}`, { headers: authHeader() }).then(res => res.data),
    createPerfilClienteForTool: (data) => api.post('/admin/tool/perfiles-cliente', data, { headers: authHeader() }).then(res => res.data),
    updatePerfilClienteForTool: (id, data) => api.put(`/admin/tool/perfiles-cliente/${id}`, data, { headers: authHeader() }).then(res => res.data),
    deletePerfilClienteForTool: (id) => api.delete(`/admin/tool/perfiles-cliente/${id}`, { headers: authHeader() }).then(res => res.data),

    // === Dashboard ===
    getDashboardStats: () => api.get('/admin/dashboard/stats', { headers: authHeader() }).then(res => res.data),


};

export default adminService;