// src/mappers/pedidoMapper.js
export const mapPedidoFromApi = (apiPedido) => ({
    id: apiPedido.pedido_id,
    fechaCreacion: apiPedido.fecha_creacion,
    estado: apiPedido.estado,
    montoTotal: apiPedido.monto_total,
});

export const mapPedidosFromApi = (apiPedidos) => apiPedidos.map(mapPedidoFromApi);

export const mapCarritoFromApi = (apiCarrito) => {
    return {
        pedidoId: apiCarrito.pedido_id,
        total: apiCarrito.total,
        items: (apiCarrito.items || []).map(item => ({
            detallePedidoId: item.detalle_pedido_id, // ID para poder borrarlo
            productName: item.product_name,
            quantity: item.quantity,
            lineTotal: item.line_total,
            requisitos: item.requisitos,
        }))
    };
};