// src/components/portals/cliente/DejarResenaModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Typography } from '@mui/material';
import portalService from '../../../services/portalService';

// Aseguramos que el objeto reseñaToEdit tenga un formato consistente
const normalizeReseña = (reseña) => {
    if (!reseña) return null;
    return {
        id: reseña.reseña_id,
        producto_id: reseña.producto_id,
        calificacion: reseña.calificacion,
        comentario: reseña.comentario,
        nombre_producto: reseña.nombre_producto,
    };
};

const DejarResenaModal = ({ open, onClose, onSave, reseñaToEdit }) => {
    const normalizedReseña = normalizeReseña(reseñaToEdit);
    const isEditing = Boolean(normalizedReseña);

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        producto_id: '',
        calificacion: 5,
        comentario: ''
    });

    const fetchProductosParaResena = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await portalService.getProductosParaResena();
            // Mapeamos los datos de la API a la estructura que usa el componente
            const mappedData = data.map(p => ({ producto_id: p.producto_id, nombre_producto: p.nombre_producto }));
            setProductos(mappedData);
            
            if (mappedData.length > 0) {
                // Si hay productos, seleccionamos el primero por defecto
                setFormData(prev => ({ ...prev, producto_id: mappedData[0].producto_id }));
            } else {
                setError('No tienes productos pendientes para dejar una reseña.');
            }
        } catch (err) {
            setError('No se pudieron cargar los productos para reseña.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            // Resetear el estado al abrir
            setFormData({ producto_id: '', calificacion: 5, comentario: '' });

            if (isEditing) {
                // Modo Edición: poblamos el form con la reseña existente
                setFormData({
                    producto_id: normalizedReseña.producto_id,
                    calificacion: normalizedReseña.calificacion,
                    comentario: normalizedReseña.comentario,
                });
                // Para el Select, solo necesitamos este producto
                setProductos([{ 
                    producto_id: normalizedReseña.producto_id, 
                    nombre_producto: normalizedReseña.nombre_producto 
                }]);
                setLoading(false);
                setError('');
            } else {
                // Modo Creación: buscamos los productos pendientes
                fetchProductosParaResena();
            }
        }
    }, [isEditing, open, normalizedReseña, fetchProductosParaResena]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (event, newValue) => {
        setFormData(prev => ({ ...prev, calificacion: newValue }));
    };

    const handleSubmit = () => {
        if (!formData.producto_id) {
            alert('Por favor, selecciona un producto.');
            return;
        }
        // Pasamos el ID original de la reseña si estamos editando
        onSave(normalizedReseña?.id, formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Editar Reseña' : 'Dejar una Reseña'}</DialogTitle>
            <DialogContent>
                {loading ? <CircularProgress sx={{my: 4}} /> : error && !isEditing ? <Alert severity="warning" sx={{mt: 2}}>{error}</Alert> : (
                    <>
                        <FormControl fullWidth margin="normal" disabled={isEditing}>
                            <InputLabel id="producto-select-label">Producto</InputLabel>
                            <Select
                                labelId="producto-select-label"
                                name="producto_id"
                                value={formData.producto_id || ''} // Usamos '' como fallback para evitar errores
                                label="Producto"
                                onChange={handleChange}
                            >
                                {productos.map(p => (
                                    // Usamos los nombres de propiedad correctos y consistentes
                                    <MenuItem key={p.producto_id} value={p.producto_id}>
                                        {p.nombre_producto}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography component="legend" sx={{ mt: 2 }}>Calificación</Typography>
                        <Rating
                            name="calificacion"
                            value={formData.calificacion || 0} // Usamos 0 como fallback
                            onChange={handleRatingChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Comentario"
                            name="comentario"
                            multiline
                            rows={4}
                            value={formData.comentario || ''} // Usamos '' como fallback
                            onChange={handleChange}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading || (!!error && !isEditing)}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DejarResenaModal;