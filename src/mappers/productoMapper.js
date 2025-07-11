// src/mappers/productoMapper.js

export const mapProductosCatalogoFromApi = (apiProductos) => {
    if (!apiProductos || !Array.isArray(apiProductos)) return [];
    return apiProductos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        proveedor: p.proveedor,
        precioMin: p.precio_min,
        precioMax: p.precio_max,
    }));
};

export const mapDetallesProductoFromApi = (apiDetalles) => {
    if (!apiDetalles) return null;
    return {
        id: apiDetalles.producto_id,
        nombre: apiDetalles.nombre_producto,
        sku: apiDetalles.sku,
        descripcion: apiDetalles.descripcion || 'Sin descripción disponible.',
        requisitos: (apiDetalles.requisitos || []).map(r => ({
            nombre: r.nombre_requisito,
            // --- LÍNEA CORREGIDA ---
            // Si r.opciones es null o undefined, lo convertimos en un array vacío.
            opciones: r.opciones || [],
            orden: r.orden,
        })),
    };
};