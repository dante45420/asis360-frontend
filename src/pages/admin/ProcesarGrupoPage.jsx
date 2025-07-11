// src/pages/admin/ProcesarGrupoPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, TextField, Select, MenuItem, FormControl, InputLabel,
    Alert, Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import adminService from '../../services/adminService';
import ConfirmacionBatchModal from '../../components/admin/ConfirmacionBatchModal';

const ProcesarGrupoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [pedidos, setPedidos] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    
    useEffect(() => {
        const pedidosIniciales = location.state?.pedidos;
        if (!pedidosIniciales || pedidosIniciales.length === 0) {
            navigate('/admin/pedidos');
        } else {
            // --- LÓGICA DE INICIALIZACIÓN CORREGIDA ---
            // Nos aseguramos de que cada pedido tenga las propiedades que los inputs esperan.
            const pedidosListos = pedidosIniciales.map(p => ({
                ...p,
                // Si precio_pagado es nulo, usamos el histórico como valor inicial.
                precio_pagado: p.precio_pagado ?? p.precio_unitario_historico,
                // Inicializamos nuevo_estado con el estado actual para que el Select sea controlado.
                nuevo_estado: p.estado || 'en_espera'
            }));
            setPedidos(pedidosListos);
        }
    }, [location.state, navigate]);

    // Manejador para cambiar el precio de un item específico
    const handlePriceChange = (detalle_id, nuevo_precio) => {
        setPedidos(prevPedidos =>
            prevPedidos.map(p => 
                p.detalle_id === detalle_id 
                ? { ...p, precio_pagado: nuevo_precio } 
                : p
            )
        );
    };

    // Manejador para cambiar el estado de un pedido completo
    const handleStatusChange = (pedido_id, nuevo_estado) => {
        setPedidos(prevPedidos =>
            prevPedidos.map(p => 
                // Actualizamos todos los items que pertenecen al mismo pedido
                p.pedido_id === pedido_id 
                ? { ...p, nuevo_estado: nuevo_estado } 
                : p
            )
        );
    };

    const handleConfirm = async () => {
        setIsConfirmModalOpen(false);
        
        // 1. Agrupar los cambios por pedido_id
        const groupedUpdates = pedidos.reduce((acc, p) => {
            if (!acc[p.pedido_id]) {
                acc[p.pedido_id] = {
                    pedido_id: p.pedido_id,
                    nuevo_estado: p.nuevo_estado,
                    detalles: []
                };
            }
            acc[p.pedido_id].detalles.push({
                detalle_id: p.detalle_id,
                nuevo_precio_pagado: p.precio_pagado
            });
            return acc;
        }, {});

        // 2. Convertir el objeto agrupado en un array para la API
        const payload = Object.values(groupedUpdates);

        try {
            const response = await adminService.batchUpdatePedidos(payload);
            setSnackbar({ open: true, message: response.message });
            setTimeout(() => navigate('/admin/pedidos'), 2000);
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Error al aplicar los cambios.' });
        }
    };

    const getPayloadForConfirmationModal = () => {
        const groupedUpdates = pedidos.reduce((acc, p) => {
            if (!acc[p.pedido_id]) {
                acc[p.pedido_id] = { pedido_id: p.pedido_id, nuevo_estado: p.nuevo_estado, detalles: [] };
            }
            acc[p.pedido_id].detalles.push({ detalle_id: p.detalle_id, nuevo_precio_pagado: p.precio_pagado });
            return acc;
        }, {});
        return Object.values(groupedUpdates);
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/pedidos')}>
                Volver a Gestión de Pedidos
            </Button>
            <Typography variant="h4" gutterBottom>Procesar Grupo de Pedidos</Typography>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow><TableCell>Cliente</TableCell><TableCell>Producto</TableCell><TableCell>Precio Original</TableCell><TableCell>Precio Final Pagado</TableCell><TableCell>Nuevo Estado del Pedido</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
                            {pedidos.map(p => (
                                <TableRow key={p.detalle_id}>
                                    <TableCell>{p.cliente_nombre}</TableCell>
                                    <TableCell>{p.nombre_producto_corto}</TableCell>
                                    <TableCell>${(p.precio_unitario_historico || 0).toLocaleString('es-CL')}</TableCell>
                                    <TableCell>
                                        <TextField 
                                            type="number"
                                            size="small"
                                            value={p.precio_pagado} // Ahora siempre tendrá un valor
                                            onChange={(e) => handlePriceChange(p.detalle_id, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={p.nuevo_estado} // Ahora siempre tendrá un valor
                                                onChange={(e) => handleStatusChange(p.pedido_id, e.target.value)}
                                            >
                                                <MenuItem value="en_espera">En Espera</MenuItem>
                                                <MenuItem value="esperando_pago">Esperando Pago</MenuItem>
                                                <MenuItem value="cancelado">Cancelado</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Button variant="contained" size="large" sx={{ mt: 3, float: 'right' }} onClick={() => setIsConfirmModalOpen(true)}>
                Aplicar Todos los Cambios
            </Button>

            <ConfirmacionBatchModal 
                open={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                cambios={getPayloadForConfirmationModal()}
            />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />
        </Box>
    );
};

export default ProcesarGrupoPage;