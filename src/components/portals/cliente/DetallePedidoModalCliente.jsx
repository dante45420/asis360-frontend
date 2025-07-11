// src/components/portals/cliente/DetalleProductoModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert, Box, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import portalService from '../../../services/portalService';

const DetalleProductoModal = ({ open, onClose, productoId, onAddToCart }) => {
    // --- LÓGICA EXISTENTE (SIN CAMBIOS) ---
    const [detalles, setDetalles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [respuestas, setRespuestas] = useState({});
    const [viewMode, setViewMode] = useState('details'); // 'details' o 'form'

    const fetchDetalles = useCallback(async () => {
        if (open && productoId) {
            setLoading(true); setError(''); setRespuestas({});
            try { const data = await portalService.getDetallesProducto(productoId); setDetalles(data); } 
            catch (err) { setError('No se pudieron cargar los detalles del producto.'); } 
            finally { setLoading(false); }
        }
    }, [open, productoId]);

    useEffect(() => { if (open) { setViewMode('details'); fetchDetalles(); } }, [open, fetchDetalles]);
    const handleChange = (nombreRequisito, valor) => { setRespuestas(prev => ({ ...prev, [nombreRequisito]: valor })); };

    const handleAddToCartClick = () => {
        const todosLosRequisitos = detalles.requisitos.map(r => r.nombre);
        for (const req of todosLosRequisitos) {
            if (!respuestas[req] || respuestas[req] === '') {
                alert(`Por favor, completa el campo "${req}".`); return;
            }
        }
        onAddToCart(productoId, respuestas); onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{detalles ? detalles.nombre : 'Cargando...'}</DialogTitle>
            <DialogContent dividers>
                {loading && <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}><CircularProgress /></Box>}
                {error && <Alert severity="error">{error}</Alert>}
                {detalles && (
                    viewMode === 'details' ? (
                        <Box>
                            <Chip label={`Vendido por: ${detalles.proveedor}`} sx={{ mb: 2 }} />
                            <Typography variant="h5" gutterBottom>{detalles.nombre}</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {detalles.descripcion}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Posibles Variaciones</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Este producto puede tener diferentes formatos o requisitos. Haz clic en "Configurar y Añadir" para especificar tu pedido.
                            </Typography>
                            {detalles.requisitos.filter(r => r.opciones.length > 0).map(req => (
                                <Box key={req.nombre} sx={{mb: 1}}>
                                    <Typography component="span" fontWeight="bold">{req.nombre}: </Typography>
                                    <Typography component="span">{req.opciones.join(', ')}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{pt: 1}}>
                            <Typography gutterBottom variant="h6">Configura tu Producto</Typography>
                            <Typography color="text.secondary" gutterBottom>Por favor, completa los siguientes datos para añadir el producto a tu pedido:</Typography>
                            {detalles.requisitos.map(req => (
                                <Box key={req.nombre} sx={{ my: 2.5 }}>
                                    {req.opciones.length > 0 ? (
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>{req.nombre}</InputLabel>
                                            <Select value={respuestas[req.nombre] || ''} label={req.nombre} onChange={(e) => handleChange(req.nombre, e.target.value)}>
                                                {req.opciones.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField fullWidth label={req.nombre} name={req.nombre} type={req.nombre.toLowerCase().includes('cantidad') ? 'number' : 'text'} value={respuestas[req.nombre] || ''} onChange={(e) => handleChange(req.nombre, e.target.value)} variant="outlined" />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{mr: 'auto'}}>Cancelar</Button>
                {viewMode === 'details' ? (
                    <Button onClick={() => setViewMode('form')} variant="contained" size="large" disabled={loading || !detalles}>Configurar y Añadir</Button>
                ) : (
                    <Button onClick={handleAddToCartClick} variant="contained" size="large" disabled={loading}>Añadir al Pedido</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DetalleProductoModal;