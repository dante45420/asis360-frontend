// src/components/portals/cliente/HistorialPedidosView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress, Alert, Button, Stack, Box, Typography, Divider } from '@mui/material';
import portalService from '../../../services/portalService';

const HistorialPedidosView = ({ onActionClick }) => {
    // --- LÓGICA EXISTENTE (SIN CAMBIOS) ---
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchPedidos = useCallback(async () => {
        try { setLoading(true); const data = await portalService.getHistorialPedidos(); setPedidos(data); } 
        catch (err) { setError(err.response?.data?.message || 'Error al cargar tus pedidos.'); } 
        finally { setLoading(false); }
    }, []);
    useEffect(() => { fetchPedidos(); }, [fetchPedidos]);
    const getStatusChip = (status) => {
        const colorMap = { 'en_camino': 'info', 'completo': 'success', 'en_espera': 'secondary', 'en_revision': 'warning', 'pagado': 'success', 'cancelado': 'error', 'esperando_pago': 'info', 'en_pausa': 'default', 'pendiente': 'primary' };
        return <Chip label={(status || 'desconocido').replace(/_/g, ' ')} color={colorMap[status] || 'default'} size="small" sx={{ textTransform: 'capitalize' }} />;
    };

    if (loading) return <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (pedidos.length === 0) return <Typography sx={{textAlign: 'center', mt: 4}}>Aún no tienes pedidos en tu historial.</Typography>

    return (
        <Box>
            {/* VISTA PARA COMPUTADOR (TABLA) */}
            <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell><TableCell>Fecha</TableCell><TableCell>Monto Total</TableCell><TableCell>Estado</TableCell><TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos.map((pedido) => (
                            <TableRow key={pedido.id}>
                                <TableCell>#{pedido.id}</TableCell>
                                <TableCell>{new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}</TableCell>
                                <TableCell>${(pedido.montoTotal || 0).toLocaleString('es-CL')}</TableCell>
                                <TableCell>{getStatusChip(pedido.estado)}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button size="small" onClick={() => onActionClick('ver_detalles', pedido)}>Ver Detalles</Button>
                                        {pedido.estado === 'esperando_pago' && <Button size="small" variant="contained" onClick={() => onActionClick('subir_comprobante', pedido)}>Pagar</Button>}
                                        <Button size="small" variant="outlined" onClick={() => onActionClick('repetir_pedido', pedido)}>Repetir</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* VISTA PARA CELULAR (TARJETAS) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {pedidos.map((pedido) => (
                    <Paper key={pedido.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography fontWeight="bold">Pedido #{pedido.id}</Typography>
                            {getStatusChip(pedido.estado)}
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                             <Typography variant="body2" color="text.secondary">Fecha:</Typography>
                             <Typography variant="body2">{new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                             <Typography variant="body2" color="text.secondary">Monto:</Typography>
                             <Typography variant="body2" fontWeight="bold">${(pedido.montoTotal || 0).toLocaleString('es-CL')}</Typography>
                        </Box>
                        <Stack spacing={1}>
                            {pedido.estado === 'esperando_pago' && <Button fullWidth variant="contained" onClick={() => onActionClick('subir_comprobante', pedido)}>Pagar Pedido</Button>}
                            <Button fullWidth variant="outlined" onClick={() => onActionClick('ver_detalles', pedido)}>Ver Detalles</Button>
                            <Button fullWidth variant="text" onClick={() => onActionClick('repetir_pedido', pedido)}>Repetir Pedido</Button>
                        </Stack>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default HistorialPedidosView;