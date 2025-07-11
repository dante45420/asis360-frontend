// src/components/admin/DetalleCompletoPedidoModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import adminService from '../../services/adminService';

const DetalleCompletoPedidoModal = ({ open, onClose, pedidoId }) => {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && pedidoId) {
            setLoading(true);
            setError('');
            adminService.getDetallesCompletosPedido(pedidoId)
                .then(data => setPedido(data))
                .catch(() => setError('No se pudo cargar el detalle del pedido.'))
                .finally(() => setLoading(false));
        }
    }, [open, pedidoId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalle del Pedido #{pedido?.pedido_id}</DialogTitle>
            <DialogContent dividers>
                {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
                    pedido && (
                        <Box>
                            <Typography variant="h6">Cliente: {pedido.cliente_nombre}</Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>Estado: {pedido.estado}</Typography>
                            <List>
                                {pedido.items.map((item, index) => (
                                    <ListItem key={index} disableGutters>
                                        <ListItemText 
                                            primary={`${item.cantidad} x ${item.nombre_producto}`}
                                            secondary={`Precio Unitario: $${item.precio_final.toLocaleString('es-CL')}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Divider sx={{ my: 2 }}/>
                            <Typography variant="h6" align="right">Total: ${pedido.monto_total.toLocaleString('es-CL')}</Typography>
                        </Box>
                    )
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetalleCompletoPedidoModal;