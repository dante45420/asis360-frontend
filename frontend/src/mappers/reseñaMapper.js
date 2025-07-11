// src/mappers/reseñaMapper.js
export const mapReseñasFromApi = (apiReseñas) => {
    if (!apiReseñas || !Array.isArray(apiReseñas)) return [];
    return apiReseñas.map(r => ({
        id: r.reseña_id,
        productoId: r.producto_id,
        productoNombre: r.producto_nombre,
        calificacion: r.calificacion,
        comentario: r.comentario,
        fechaCreacion: r.fecha_creacion,
    }));
};

export const mapProductosParaReseñaFromApi = (apiProductos) => {
    if (!apiProductos || !Array.isArray(apiProductos)) return [];
    return apiProductos.map(p => ({
        id: p.producto_id,
        nombre: p.nombre_producto,
    }));
};